import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, UserPlus, UserMinus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserWithRoles {
  id: string;
  email: string;
  roles: string[];
}

export const RolesManagement = () => {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, email");

      if (profilesError) throw profilesError;

      // Fetch all roles
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      // Combine data
      const usersWithRoles = profiles?.map((profile) => ({
        id: profile.id,
        email: profile.email || "No email",
        roles: roles?.filter((r) => r.user_id === profile.id).map((r) => r.role) || [],
      })) || [];

      setUsers(usersWithRoles);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load users and roles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addRole = async (userId: string, role: "admin" | "user") => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Added ${role} role`,
      });
      fetchUsers();
    } catch (error: any) {
      console.error("Error adding role:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add role",
        variant: "destructive",
      });
    }
  };

  const removeRole = async (userId: string, role: "admin" | "user") => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", role);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Removed ${role} role`,
      });
      fetchUsers();
    } catch (error: any) {
      console.error("Error removing role:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove role",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>User Roles Management</CardTitle>
            <CardDescription>Manage user roles and permissions</CardDescription>
          </div>
          <Button onClick={fetchUsers} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Current Roles</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell className="font-mono text-xs">{user.id}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {user.roles.length === 0 ? (
                        <Badge variant="secondary">No roles</Badge>
                      ) : (
                        user.roles.map((role) => (
                          <Badge key={role} variant={role === "admin" ? "default" : "secondary"}>
                            {role}
                          </Badge>
                        ))
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Select onValueChange={(value) => {
                        if (value === "admin" || value === "user") {
                          addRole(user.id, value);
                        }
                      }}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Add role" />
                        </SelectTrigger>
                        <SelectContent>
                          {!user.roles.includes("admin") && (
                            <SelectItem value="admin">
                              <div className="flex items-center">
                                <UserPlus className="h-4 w-4 mr-2" />
                                Admin
                              </div>
                            </SelectItem>
                          )}
                          {!user.roles.includes("user") && (
                            <SelectItem value="user">
                              <div className="flex items-center">
                                <UserPlus className="h-4 w-4 mr-2" />
                                User
                              </div>
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      {user.roles.length > 0 && (
                        <Select onValueChange={(value) => {
                          if (value === "admin" || value === "user") {
                            removeRole(user.id, value);
                          }
                        }}>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Remove" />
                          </SelectTrigger>
                          <SelectContent>
                            {user.roles.map((role) => (
                              <SelectItem key={role} value={role}>
                                <div className="flex items-center">
                                  <UserMinus className="h-4 w-4 mr-2" />
                                  {role}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
