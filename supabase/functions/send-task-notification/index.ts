import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  userEmail: string;
  taskStatus: string;
  offerTitle: string;
  reward: number;
  rejectionReason?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userEmail, taskStatus, offerTitle, reward, rejectionReason }: NotificationRequest = await req.json();

    console.log("Sending notification:", { userEmail, taskStatus, offerTitle });

    let subject = "";
    let html = "";

    if (taskStatus === "completed") {
      subject = `🎉 Task Verified - ${offerTitle}`;
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #22c55e;">Task Verified!</h1>
          <p>Great news! Your task for <strong>${offerTitle}</strong> has been verified.</p>
          <p>You've earned <strong>₹${reward}</strong> which has been added to your wallet balance.</p>
          <p style="margin-top: 30px;">Keep up the great work!</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">This is an automated notification from your rewards platform.</p>
        </div>
      `;
    } else if (taskStatus === "rejected") {
      subject = `❌ Task Rejected - ${offerTitle}`;
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #ef4444;">Task Rejected</h1>
          <p>Unfortunately, your task submission for <strong>${offerTitle}</strong> has been rejected.</p>
          ${rejectionReason ? `<p><strong>Reason:</strong> ${rejectionReason}</p>` : ""}
          <p style="margin-top: 30px;">Please review the task requirements and try again.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">This is an automated notification from your rewards platform.</p>
        </div>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "Refo <onboarding@resend.dev>",
      to: [userEmail],
      subject,
      html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-task-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
