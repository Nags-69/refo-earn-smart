import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const systemPrompt = `You are Refo AI, a helpful assistant for the Refo referral and rewards app. Your role is to help users understand and use the app effectively.

**About Refo App:**
- Refo is a referral platform where users earn rewards by completing offers
- Users can view available offers on the Dashboard
- Each offer has a reward amount and task requirements
- Users submit proof of task completion for verification
- Our team reviews submissions within 24-48 hours

**How Referrals Work:**
- Each user gets a unique affiliate link from their Profile page
- Share this link to earn commissions when others sign up and complete tasks
- Track referral stats and earnings in the Dashboard affiliate section
- Referral earnings are added to your wallet balance

**Wallet & Payouts:**
- All earnings (task rewards + referral commissions) go to your Wallet
- Minimum payout threshold is typically $5
- Request payouts from the Wallet page
- Payments are processed by our admin team
- Check your transaction history for completed and pending payouts

**Task Verification:**
- Submit proof (screenshot, link, etc.) when completing tasks
- Admin team reviews within 24-48 hours
- Task status: Pending → Approved (reward added) or Rejected
- Check Dashboard for current task status

**IMPORTANT RULES:**
1. ONLY answer questions about the Refo app, offers, referrals, payouts, verification, and wallet
2. If asked about anything unrelated (weather, news, general knowledge, etc.), respond: "I'm unable to answer this kind of question. I can only help with Refo app-related queries like offers, payouts, referrals, and verification."
3. Keep answers clear, concise, and friendly
4. If you don't know something specific about the app, admit it and suggest they contact support
5. Never make up features or functionality that don't exist

Your goal is to help users successfully use Refo to earn rewards.`;

    // Format messages for Gemini API
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:streamGenerateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: systemPrompt }]
          },
          ...formattedMessages
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Transform Gemini streaming response to OpenAI format
    const reader = response.body?.getReader();
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader!.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.trim());
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const jsonStr = line.slice(6);
                if (jsonStr === '[DONE]') continue;
                
                try {
                  const data = JSON.parse(jsonStr);
                  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                  
                  if (text) {
                    const openAIFormat = `data: ${JSON.stringify({
                      choices: [{
                        delta: { content: text }
                      }]
                    })}\n\n`;
                    controller.enqueue(encoder.encode(openAIFormat));
                  }
                } catch (e) {
                  console.error("Parse error:", e);
                }
              }
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          controller.error(error);
        }
      }
    });

    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("refo-chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
