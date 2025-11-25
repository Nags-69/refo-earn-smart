import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Link2, Clock, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const fetchStats = async () => {
  const [profilesResult, tasksResult, transactionsResult] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("tasks").select("status", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("transactions").select("status", { count: "exact", head: true }).eq("status", "completed"),
  ]);

  return {
    totalUsers: profilesResult.count || 0,
    totalReferrals: 0, // Removed expensive query
    pendingTasks: tasksResult.count || 0,
    completedPayouts: transactionsResult.count || 0,
  };
};

const Overview = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-overview'],
    queryFn: fetchStats,
    staleTime: 30000, // Cache for 30 seconds
  });

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-primary",
    },
    {
      title: "Pending Tasks",
      value: stats?.pendingTasks || 0,
      icon: Clock,
      color: "text-muted-foreground",
    },
    {
      title: "Completed Payouts",
      value: stats?.completedPayouts || 0,
      icon: CheckCircle,
      color: "text-success",
    },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-9 w-20" />
              ) : (
                <div className="text-3xl font-bold">{stat.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Overview;
