import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Send, Users } from "lucide-react";

type User = {
  id: string;
  username: string | null;
  email: string | null;
  is_verified: boolean | null;
};

const NotificationsManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [notificationType, setNotificationType] = useState<"info" | "success" | "error">("info");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, username, email, is_verified")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
      return;
    }

    setUsers(data || []);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedUsers(new Set(users.map(u => u.id)));
    } else {
      setSelectedUsers(new Set());
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    const newSelected = new Set(selectedUsers);
    if (checked) {
      newSelected.add(userId);
    } else {
      newSelected.delete(userId);
    }
    setSelectedUsers(newSelected);
    setSelectAll(newSelected.size === users.length);
  };

  const handleSendNotifications = async () => {
    if (!title.trim() || !message.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and message are required",
        variant: "destructive",
      });
      return;
    }

    if (selectedUsers.size === 0) {
      toast({
        title: "No Recipients",
        description: "Please select at least one user",
        variant: "destructive",
      });
      return;
    }

    setSending(true);

    try {
      const notifications = Array.from(selectedUsers).map(userId => ({
        user_id: userId,
        title,
        message,
        type: notificationType,
      }));

      const { error } = await supabase
        .from("notifications")
        .insert(notifications);

      if (error) throw error;

      toast({
        title: "Notifications Sent!",
        description: `Successfully sent to ${selectedUsers.size} user(s)`,
      });

      // Reset form
      setTitle("");
      setMessage("");
      setNotificationType("info");
      setSelectedUsers(new Set());
      setSelectAll(false);
    } catch (error: any) {
      console.error("Error sending notifications:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-success";
      case "error":
        return "text-destructive";
      default:
        return "text-primary";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Notifications Management</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Send Notification Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send Custom Notification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Notification title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Notification message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={notificationType} onValueChange={(value: any) => setNotificationType(value)}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">
                    <span className="text-primary">ℹ️ Info</span>
                  </SelectItem>
                  <SelectItem value="success">
                    <span className="text-success">✅ Success</span>
                  </SelectItem>
                  <SelectItem value="error">
                    <span className="text-destructive">⚠️ Error/Warning</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">
                  Selected: {selectedUsers.size} user(s)
                </p>
              </div>
              <Button
                className="w-full"
                onClick={handleSendNotifications}
                disabled={sending || selectedUsers.size === 0}
              >
                {sending ? "Sending..." : `Send to ${selectedUsers.size} User(s)`}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Select Recipients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b">
                <Checkbox
                  id="select-all"
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                />
                <label
                  htmlFor="select-all"
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  Select All Users ({users.length})
                </label>
              </div>

              <div className="max-h-[400px] overflow-y-auto space-y-2">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50">
                    <Checkbox
                      id={`user-${user.id}`}
                      checked={selectedUsers.has(user.id)}
                      onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                    />
                    <label
                      htmlFor={`user-${user.id}`}
                      className="flex-1 text-sm cursor-pointer"
                    >
                      <div className="font-medium">
                        {user.username || user.email || "Unknown User"}
                      </div>
                      {user.email && user.username && (
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      )}
                    </label>
                    {user.is_verified && (
                      <span className="text-xs text-success">✓ Verified</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setTitle("Welcome! 🎉");
                setMessage("Thank you for joining our platform. Start completing tasks to earn rewards!");
                setNotificationType("success");
              }}
            >
              Welcome Message
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setTitle("New Offers Available! 🎁");
                setMessage("Check out the latest offers in the dashboard and start earning today!");
                setNotificationType("info");
              }}
            >
              New Offers Alert
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setTitle("System Maintenance 🔧");
                setMessage("Our platform will undergo scheduled maintenance. We'll be back shortly!");
                setNotificationType("error");
              }}
            >
              Maintenance Notice
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsManagement;
