import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, UserPlus, UserMinus, Crown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
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
  roles: Array<{ role: string; is_owner: boolean }>;
}

export const RolesManagement = () => {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const checkOwnerStatus = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from("user_roles")
        .select("is_owner")
        .eq("user_id", user.id)
        .eq("is_owner", true)
        .maybeSingle();
      
      setIsOwner(!!data);
    } catch (error) {
      console.error("Error checking owner status:", error);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, email");

      if (profilesError) throw profilesError;

      // Fetch all roles with is_owner flag
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role, is_owner");

      if (rolesError) throw rolesError;

      // Combine data
      const usersWithRoles = profiles?.map((profile) => ({
        id: profile.id,
        email: profile.email || "No email",
        roles: roles?.filter((r) => r.user_id === profile.id).map((r) => ({ 
          role: r.role, 
          is_owner: r.is_owner || false 
        })) || [],
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
    checkOwnerStatus();
    fetchUsers();
  }, [user]);

  const addRole = async (userId: string, role: "admin" | "user") => {
    // Check if trying to add admin role without owner permission
    if (role === "admin" && !isOwner) {
      toast({
        title: "Permission Denied",
        description: "Only the owner can grant admin roles",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role, is_owner: false });

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
        description: error.message || "Failed to add role. You may not have permission.",
        variant: "destructive",
      });
    }
  };

  const removeRole = async (userId: string, role: "admin" | "user") => {
    // Check if trying to remove admin role without owner permission
    if (role === "admin" && !isOwner) {
      toast({
        title: "Permission Denied",
        description: "Only the owner can remove admin roles",
        variant: "destructive",
      });
      return;
    }

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
        description: error.message || "Failed to remove role. You may not have permission.",
        variant: "destructive",
      });
    }
  };

  const makeOwner = async (userId: string) => {
    try {
      // Update the admin role to be owner
      const { error } = await supabase
        .from("user_roles")
        .update({ is_owner: true })
        .eq("user_id", userId)
        .eq("role", "admin");

      if (error) throw error;

      toast({
        title: "Success",
        description: "User is now the owner",
      });
      checkOwnerStatus();
      fetchUsers();
    } catch (error: any) {
      console.error("Error making owner:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to set owner",
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
            <CardDescription>
              Manage user roles and permissions {isOwner && <Badge variant="default" className="ml-2"><Crown className="h-3 w-3 mr-1" />Owner</Badge>}
            </CardDescription>
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
                        user.roles.map((roleData) => (
                          <Badge 
                            key={roleData.role} 
                            variant={roleData.role === "admin" ? "default" : "secondary"}
                            className={roleData.is_owner ? "bg-gradient-to-r from-yellow-500 to-amber-600" : ""}
                          >
                            {roleData.is_owner && <Crown className="h-3 w-3 mr-1" />}
                            {roleData.role}
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
                          {!user.roles.some(r => r.role === "admin") && (
                            <SelectItem value="admin" disabled={!isOwner}>
                              <div className="flex items-center">
                                <UserPlus className="h-4 w-4 mr-2" />
                                Admin {!isOwner && "(Owner only)"}
                              </div>
                            </SelectItem>
                          )}
                          {!user.roles.some(r => r.role === "user") && (
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
                            {user.roles.map((roleData) => (
                              <SelectItem 
                                key={roleData.role} 
                                value={roleData.role}
                                disabled={roleData.role === "admin" && !isOwner}
                              >
                                <div className="flex items-center">
                                  <UserMinus className="h-4 w-4 mr-2" />
                                  {roleData.role} {roleData.role === "admin" && !isOwner && "(Owner only)"}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {isOwner && user.roles.some(r => r.role === "admin" && !r.is_owner) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => makeOwner(user.id)}
                          className="ml-2"
                        >
                          <Crown className="h-4 w-4 mr-1" />
                          Make Owner
                        </Button>
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
