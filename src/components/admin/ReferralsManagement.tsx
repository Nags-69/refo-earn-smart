import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Image } from "lucide-react";

type Task = {
  id: string;
  user_id: string;
  offer_id: string;
  status: string;
  created_at: string;
  proof_url?: string;
  user_email?: string;
  offer_title?: string;
  offer_reward?: number;
};

const ReferralsManagement = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data: tasksData, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tasks:", error);
      toast({ title: "Error loading tasks", variant: "destructive" });
      return;
    }

    if (tasksData) {
      const tasksWithDetails = await Promise.all(
        tasksData.map(async (task) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("email, username")
            .eq("id", task.user_id)
            .maybeSingle();
          
          const { data: offer } = await supabase
            .from("offers")
            .select("title, reward")
            .eq("id", task.offer_id)
            .maybeSingle();

          return {
            ...task,
            user_email: profile?.username || profile?.email || "N/A",
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
                  <TableHead>Proof</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.user_email}</TableCell>
                    <TableCell>{task.offer_title}</TableCell>
                    <TableCell>₹{task.offer_reward}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          task.status === "completed"
                            ? "bg-primary/20 text-primary"
                            : task.status === "verified"
                            ? "bg-success/20 text-success"
                            : task.status === "pending"
                            ? "bg-muted text-muted-foreground"
                            : "bg-destructive/20 text-destructive"
                        }`}
                      >
                        {task.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {task.proof_url ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedProof(task.proof_url!)}
                        >
                          <Image className="h-4 w-4" />
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-xs">No proof</span>
                      )}
                    </TableCell>
                    <TableCell>{new Date(task.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      {(task.status === "pending" || task.status === "completed") && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => updateTaskStatus(task.id, "verified")}
                          >
                            Verify
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

      <Dialog open={!!selectedProof} onOpenChange={() => setSelectedProof(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Task Proof Screenshot</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-4">
            {selectedProof && (
              <img 
                src={selectedProof} 
                alt="Task proof" 
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReferralsManagement;
