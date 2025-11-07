import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Task = {
  id: string;
  user_id: string;
  offer_id: string;
  status: string;
  created_at: string;
  user_email?: string;
  offer_title?: string;
  offer_reward?: number;
};

const ReferralsManagement = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data: tasksData } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (tasksData) {
      const tasksWithDetails = await Promise.all(
        tasksData.map(async (task) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("email")
            .eq("id", task.user_id)
            .single();
          
          const { data: offer } = await supabase
            .from("offers")
            .select("title, reward")
            .eq("id", task.offer_id)
            .single();

          return {
            ...task,
            user_email: profile?.email || "N/A",
            offer_title: offer?.title || "N/A",
            offer_reward: offer?.reward || 0,
          };
        })
      );

      setTasks(tasksWithDetails);
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", taskId);

    if (error) {
      toast({ title: "Error updating status", variant: "destructive" });
    } else {
      toast({ title: `Task marked as ${newStatus}` });
      fetchTasks();
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Referrals Management</h2>
      <Card>
        <CardHeader>
          <CardTitle>All Referral Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Offer</TableHead>
                  <TableHead>Reward</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.user_email}</TableCell>
                    <TableCell>{task.offer_title}</TableCell>
                    <TableCell>${task.offer_reward}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          task.status === "completed"
                            ? "bg-success/20 text-success"
                            : task.status === "pending"
                            ? "bg-muted text-muted-foreground"
                            : "bg-destructive/20 text-destructive"
                        }`}
                      >
                        {task.status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(task.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      {task.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => updateTaskStatus(task.id, "completed")}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateTaskStatus(task.id, "rejected")}
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
    </div>
  );
};

export default ReferralsManagement;
