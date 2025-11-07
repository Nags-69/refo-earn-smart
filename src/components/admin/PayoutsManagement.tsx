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

const PayoutsManagement = () => {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    const { data: wallets } = await supabase.from("wallet").select("*");

    if (wallets) {
      const payoutsWithDetails = await Promise.all(
        wallets.map(async (wallet) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("email")
            .eq("id", wallet.user_id)
            .single();

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
            user_email: profile?.email || "N/A",
            total_earnings: Number(wallet.total_balance),
            pending_balance: Number(wallet.pending_balance),
            completed_payouts: completedPayouts,
          };
        })
      );

      setPayouts(payoutsWithDetails);
    }
  };

  const createPayout = async (userId: string, amount: number) => {
    const { error } = await supabase.from("transactions").insert({
      user_id: userId,
      type: "withdrawal",
      amount: amount,
      status: "completed",
      description: "Admin payout",
    });

    if (error) {
      toast({ title: "Error creating payout", variant: "destructive" });
    } else {
      const { error: walletError } = await supabase
        .from("wallet")
        .update({ pending_balance: 0 })
        .eq("user_id", userId);

      if (walletError) {
        toast({ title: "Error updating wallet", variant: "destructive" });
      } else {
        toast({ title: "Payout completed successfully" });
        fetchPayouts();
      }
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Payouts Management</h2>
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
                      {payout.pending_balance > 0 && (
                        <Button
                          size="sm"
                          onClick={() =>
                            createPayout(payout.user_id, payout.pending_balance)
                          }
                        >
                          Mark as Paid
                        </Button>
                      )}
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
