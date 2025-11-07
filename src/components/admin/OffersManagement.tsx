import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Offer = {
  id: string;
  title: string;
  description: string;
  reward: number;
  logo_url: string;
  category: string;
  status: string;
};

const OffersManagement = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    reward: "",
    logo_url: "",
    category: "",
    status: "active",
  });

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    const { data } = await supabase.from("offers").select("*").order("created_at", { ascending: false });
    if (data) setOffers(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const offerData = {
      title: formData.title,
      description: formData.description,
      reward: parseFloat(formData.reward),
      logo_url: formData.logo_url,
      category: formData.category,
      status: formData.status,
      is_public: true,
    };

    if (editingOffer) {
      const { error } = await supabase.from("offers").update(offerData).eq("id", editingOffer.id);
      if (error) {
        toast({ title: "Error updating offer", variant: "destructive" });
      } else {
        toast({ title: "Offer updated successfully" });
      }
    } else {
      const { error } = await supabase.from("offers").insert(offerData);
      if (error) {
        toast({ title: "Error creating offer", variant: "destructive" });
      } else {
        toast({ title: "Offer created successfully" });
      }
    }

    setIsDialogOpen(false);
    resetForm();
    fetchOffers();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("offers").delete().eq("id", id);
    if (error) {
      toast({ title: "Error deleting offer", variant: "destructive" });
    } else {
      toast({ title: "Offer deleted successfully" });
      fetchOffers();
    }
  };

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title,
      description: offer.description || "",
      reward: offer.reward.toString(),
      logo_url: offer.logo_url || "",
      category: offer.category || "",
      status: offer.status || "active",
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingOffer(null);
    setFormData({
      title: "",
      description: "",
      reward: "",
      logo_url: "",
      category: "",
      status: "active",
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Offers Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Offer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingOffer ? "Edit Offer" : "Add New Offer"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="reward">Reward ($)</Label>
                <Input
                  id="reward"
                  type="number"
                  step="0.01"
                  value={formData.reward}
                  onChange={(e) => setFormData({ ...formData, reward: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="logo_url">Logo URL</Label>
                <Input
                  id="logo_url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <Button type="submit" className="w-full">
                {editingOffer ? "Update Offer" : "Create Offer"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Offers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Reward</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offers.map((offer) => (
                  <TableRow key={offer.id}>
                    <TableCell className="font-medium">{offer.title}</TableCell>
                    <TableCell>${offer.reward}</TableCell>
                    <TableCell>{offer.category || "N/A"}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          offer.status === "active"
                            ? "bg-success/20 text-success"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {offer.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(offer)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(offer.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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

export default OffersManagement;
