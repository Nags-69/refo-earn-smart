import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Payout = {
  user_id: string;
  user_email?: string;
  total_earnings: number;
  pending_balance: number;
  completed_payouts: number;
};

type PayoutRequest = {
  id: string;
  user_id: string;
  user_email?: string;
  amount: number;
  payout_method: string;
  upi_id?: string;
  bank_account_number?: string;
  bank_ifsc_code?: string;
  bank_account_holder?: string;
  status: string;
  created_at: string;
};

const PayoutsManagement = () => {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchPayouts();
    fetchPayoutRequests();
  }, []);

  const fetchPayoutRequests = async () => {
    const { data, error } = await supabase
      .from("payout_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching payout requests:", error);
      return;
    }

    if (data) {
      const requestsWithDetails = await Promise.all(
        data.map(async (request) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("email, username")
            .eq("id", request.user_id)
            .maybeSingle();

          return {
            ...request,
            user_email: profile?.username || profile?.email || "N/A",
          };
        })
      );

      setPayoutRequests(requestsWithDetails);
    }
  };

  const fetchPayouts = async () => {
    const { data: wallets, error } = await supabase.from("wallet").select("*");

    if (error) {
      console.error("Error fetching wallets:", error);
      toast({ title: "Error loading payouts", variant: "destructive" });
      return;
    }

    if (wallets) {
      const payoutsWithDetails = await Promise.all(
        wallets.map(async (wallet) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("email, username")
            .eq("id", wallet.user_id)
            .maybeSingle();

          const { data: transactions } = await supabase
            .from("transactions")
            .select("amount")
            .eq("user_id", wallet.user_id)
            .eq("status", "completed");

          const completedPayouts = transactions?.reduce(
            (sum, t) => sum + Number(t.amount),
            0
          ) || 0;

          return {
            user_id: wallet.user_id,
            user_email: profile?.username || profile?.email || "N/A",
            total_earnings: Number(wallet.total_balance || 0),
            pending_balance: Number(wallet.pending_balance || 0),
            completed_payouts: completedPayouts,
          };
        })
      );

      setPayouts(payoutsWithDetails);
    }
  };

  const handlePayoutRequest = async (requestId: string, action: "approve" | "reject") => {
    const request = payoutRequests.find((r) => r.id === requestId);
    if (!request) return;

    if (action === "approve") {
      // Get current wallet balance
      const { data: walletData } = await supabase
        .from("wallet")
        .select("total_balance")
        .eq("user_id", request.user_id)
        .single();

      if (!walletData) {
        toast({ title: "Error: User wallet not found", variant: "destructive" });
        return;
      }

      if (Number(walletData.total_balance) < Number(request.amount)) {
        toast({ title: "Error: Insufficient balance", variant: "destructive" });
        return;
      }

      // Create withdrawal transaction
      const { error: transactionError } = await supabase.from("transactions").insert({
        user_id: request.user_id,
        type: "withdrawal",
        amount: request.amount,
        status: "completed",
        description: `Withdrawal via ${request.payout_method}`,
      });

      if (transactionError) {
        toast({ title: "Error creating transaction", variant: "destructive" });
        return;
      }

      // Deduct from wallet
      const newBalance = Number(walletData.total_balance) - Number(request.amount);
      const { error: walletError } = await supabase
        .from("wallet")
        .update({ total_balance: Math.max(0, newBalance) })
        .eq("user_id", request.user_id);

      if (walletError) {
        toast({ title: "Error updating wallet", variant: "destructive" });
        return;
      }

      // Update payout request status
      const { error: updateError } = await supabase
        .from("payout_requests")
        .update({
          status: "completed",
          processed_at: new Date().toISOString(),
        })
        .eq("id", requestId);

      if (updateError) {
        toast({ title: "Error updating payout request", variant: "destructive" });
      } else {
        toast({ title: `Payout approved! ₹${request.amount} paid to ${request.user_email}` });
        fetchPayouts();
        fetchPayoutRequests();
      }
    } else {
      // Reject payout
      const { error } = await supabase
        .from("payout_requests")
        .update({
          status: "rejected",
          processed_at: new Date().toISOString(),
          rejection_reason: "Rejected by admin",
        })
        .eq("id", requestId);

      if (error) {
        toast({ title: "Error rejecting payout", variant: "destructive" });
      } else {
        toast({ title: "Payout request rejected" });
        fetchPayoutRequests();
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Payouts Management</h2>
      
      {/* Payout Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Payout Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payoutRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.user_email}</TableCell>
                    <TableCell>₹{Number(request.amount).toFixed(2)}</TableCell>
                    <TableCell>{request.payout_method}</TableCell>
                    <TableCell className="text-xs">
                      {request.payout_method === "UPI" ? (
                        <span>UPI: {request.upi_id}</span>
                      ) : (
                        <div>
                          <div>A/C: {request.bank_account_number}</div>
                          <div>IFSC: {request.bank_ifsc_code}</div>
                          <div>Name: {request.bank_account_holder}</div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          request.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-500"
                            : request.status === "completed"
                            ? "bg-green-500/20 text-green-500"
                            : "bg-red-500/20 text-red-500"
                        }`}
                      >
                        {request.status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      {request.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handlePayoutRequest(request.id, "approve")}
                          >
                            Pay
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handlePayoutRequest(request.id, "reject")}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* User Wallets Overview */}
      <Card>
        <CardHeader>
          <CardTitle>User Earnings & Payouts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Total Earnings</TableHead>
                  <TableHead>Pending Balance</TableHead>
                  <TableHead>Completed Payouts</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payouts.map((payout) => (
                  <TableRow key={payout.user_id}>
                    <TableCell className="font-medium">{payout.user_email}</TableCell>
                    <TableCell>${payout.total_earnings.toFixed(2)}</TableCell>
                    <TableCell>${payout.pending_balance.toFixed(2)}</TableCell>
                    <TableCell>${payout.completed_payouts.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <span className="text-sm text-muted-foreground">View only</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayoutsManagement;
