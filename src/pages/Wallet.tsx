import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet as WalletIcon, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const Wallet = () => {
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Bypass auth - use demo data
    loadWalletData('demo-user');
  }, []);

  const loadWalletData = async (userId: string) => {
    // Load wallet
    const { data: walletData } = await supabase
      .from("wallet")
      .select("*")
      .eq("user_id", userId)
      .single();
    setWallet(walletData);

    // Load transactions
    const { data: transactionsData } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);
    setTransactions(transactionsData || []);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-heading font-bold mb-8">Wallet</h1>

        {/* Balance Cards */}
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <Card className="p-6 bg-gradient-to-br from-primary/20 to-primary/5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/20 rounded-2xl">
                <WalletIcon className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                Total Balance
              </span>
            </div>
            <p className="text-3xl font-heading font-bold text-primary">
              ₹{wallet?.total_balance?.toFixed(2) || "0.00"}
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-muted/50 to-muted/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-muted rounded-2xl">
                <Clock className="h-6 w-6 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                Pending Balance
              </span>
            </div>
            <p className="text-3xl font-heading font-bold">
              ₹{wallet?.pending_balance?.toFixed(2) || "0.00"}
            </p>
          </Card>
        </div>

        {/* Payout Info */}
        <Card className="p-4 mb-8 bg-accent/50 border-accent">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-1">Payout Information</h3>
              <p className="text-sm text-muted-foreground">
                Payouts are processed in 3–5 business days once your balance reaches ₹500
              </p>
            </div>
          </div>
        </Card>

        {/* Transaction History */}
        <div>
          <h2 className="text-xl font-heading font-semibold mb-4">Transaction History</h2>
          
          {transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((transaction: any) => (
                <Card key={transaction.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-2xl ${
                        transaction.type === "credit" ? "bg-success/20" : "bg-destructive/20"
                      }`}>
                        <CheckCircle2 className={`h-5 w-5 ${
                          transaction.type === "credit" ? "text-success" : "text-destructive"
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(transaction.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-heading font-bold ${
                        transaction.type === "credit" ? "text-success" : "text-destructive"
                      }`}>
                        {transaction.type === "credit" ? "+" : "-"}₹{transaction.amount}
                      </p>
                      <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No transactions yet</p>
            </Card>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Wallet;
