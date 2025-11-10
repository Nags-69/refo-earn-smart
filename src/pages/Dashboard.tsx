import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BottomNav from "@/components/BottomNav";
import OfferCard from "@/components/OfferCard";

const Dashboard = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<any>(null);
  const [tasks, setTasks] = useState([]);
  const [offers, setOffers] = useState([]);
  const [affiliateLink, setAffiliateLink] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadDashboardData(user.id);
    }
  }, [user]);

  const loadDashboardData = async (userId: string) => {
    // Load wallet
    const { data: walletData } = await supabase
      .from("wallet")
      .select("*")
      .eq("user_id", userId)
      .single();
    setWallet(walletData);

    // Load tasks
    const { data: tasksData } = await supabase
      .from("tasks")
      .select("*, offers(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setTasks(tasksData || []);

    // Load available offers
    const { data: offersData } = await supabase
      .from("offers")
      .select("*")
      .eq("is_public", true)
      .eq("status", "active")
      .order("created_at", { ascending: false });
    setOffers(offersData || []);

    // Load affiliate link
    const { data: affiliateData } = await supabase
      .from("affiliate_links")
      .select("unique_code")
      .eq("user_id", userId)
      .single();
    
    if (affiliateData) {
      setAffiliateLink(`${window.location.origin}/?partner=${affiliateData.unique_code}`);
    }
  };

  const handleStartTask = async (offerId: string) => {
    if (!user) return;

    // Check if task already exists
    const { data: existingTask } = await supabase
      .from("tasks")
      .select("id")
      .eq("user_id", user.id)
      .eq("offer_id", offerId)
      .maybeSingle();

    if (existingTask) {
      toast({
        title: "Task already started",
        description: "You already have this task in your tasks list",
        variant: "destructive",
      });
      return;
    }

    // Create new task
    const { error } = await supabase
      .from("tasks")
      .insert({
        user_id: user.id,
        offer_id: offerId,
        status: "pending",
      });

    if (error) {
      toast({
        title: "Failed to start task",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Task started!",
      description: "Check 'My Tasks' tab to view and complete it",
    });

    loadDashboardData(user.id);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(affiliateLink);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Affiliate link copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      pending: "secondary",
      completed: "default",
      verified: "default",
      rejected: "destructive",
    };
    const colors: any = {
      pending: "bg-muted",
      completed: "bg-primary",
      verified: "bg-success",
      rejected: "bg-destructive",
    };
    
    return (
      <Badge className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-heading font-bold">Dashboard</h1>
            {wallet && (
              <Card className="px-4 py-2 bg-primary/10">
                <span className="text-sm text-muted-foreground">Wallet Balance</span>
                <p className="text-xl font-heading font-bold text-primary">
                  ₹{wallet.total_balance?.toFixed(2)}
                </p>
              </Card>
            )}
          </div>
        </div>

        <Tabs defaultValue="offers" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="offers">Offers</TabsTrigger>
            <TabsTrigger value="tasks">My Tasks</TabsTrigger>
            <TabsTrigger value="affiliate">Affiliate</TabsTrigger>
          </TabsList>

          <TabsContent value="offers" className="space-y-4">
            {offers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {offers.map((offer: any) => (
                  <OfferCard
                    key={offer.id}
                    title={offer.title}
                    description={offer.description}
                    reward={offer.reward}
                    logoUrl={offer.logo_url}
                    category={offer.category}
                    status={offer.status}
                    onStartTask={() => handleStartTask(offer.id)}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  No offers available at the moment
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            {tasks.length > 0 ? (
              tasks.map((task: any) => (
                <Card key={task.id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-heading font-semibold mb-2">
                        {task.offers?.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Reward: ₹{task.offers?.reward}
                      </p>
                      {getStatusBadge(task.status)}
                      {task.rejection_reason && (
                        <p className="text-sm text-destructive mt-2">
                          Reason: {task.rejection_reason}
                        </p>
                      )}
                    </div>
                    {task.status === "pending" && (
                      <Button size="sm" variant="outline">
                        Upload Proof
                      </Button>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  No tasks yet. Start with an offer from the Home page!
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="affiliate" className="space-y-4">
            <Card className="p-6">
              <h3 className="font-heading font-semibold text-lg mb-4">
                Your Affiliate Link
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Share this link to earn commissions on verified conversions
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={affiliateLink}
                  readOnly
                  className="flex-1 px-4 py-2 bg-secondary rounded-2xl text-sm"
                />
                <Button
                  size="icon"
                  onClick={copyToClipboard}
                  className="bg-primary hover:bg-primary/90 rounded-2xl"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
