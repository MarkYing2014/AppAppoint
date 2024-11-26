"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MultiSelect } from "@/components/ui/multi-select";
import { Loader2, Plus, Trash2 } from "lucide-react";

interface Territory {
  id: string;
  name: string;
  description: string;
  salesReps: SalesRep[];
}

interface SalesRep {
  id: string;
  name: string;
  email: string;
}

export function TerritoryManagement() {
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingTerritory, setEditingTerritory] = useState<Territory | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    salesRepIds: [] as string[],
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTerritories();
    fetchSalesReps();
  }, []);

  const fetchTerritories = async () => {
    try {
      const response = await fetch("/api/territories");
      if (!response.ok) throw new Error("Failed to fetch territories");
      const data = await response.json();
      setTerritories(data);
      setError(null);
    } catch (err) {
      setError("Failed to load data. Please try again later.");
      console.error("Error fetching territories:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSalesReps = async () => {
    try {
      const response = await fetch("/api/sales-reps");
      if (!response.ok) throw new Error("Failed to fetch sales reps");
      const data = await response.json();
      setSalesReps(data);
    } catch (err) {
      console.error("Error fetching sales reps:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingTerritory
        ? "/api/territories"
        : "/api/territories";
      const method = editingTerritory ? "PUT" : "POST";
      const body = editingTerritory
        ? { ...formData, id: editingTerritory.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Failed to save territory");

      toast({
        title: `Territory ${editingTerritory ? "updated" : "created"} successfully`,
        variant: "default",
      });

      setShowAddDialog(false);
      setEditingTerritory(null);
      resetForm();
      fetchTerritories();
    } catch (err) {
      console.error("Error saving territory:", err);
      toast({
        title: "Error",
        description: "Failed to save territory. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/territories?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete territory");

      toast({
        title: "Territory deleted successfully",
        variant: "default",
      });

      fetchTerritories();
    } catch (err) {
      console.error("Error deleting territory:", err);
      toast({
        title: "Error",
        description: "Failed to delete territory. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (territory: Territory) => {
    setEditingTerritory(territory);
    setFormData({
      name: territory.name,
      description: territory.description || "",
      salesRepIds: territory.salesReps.map((rep) => rep.id),
    });
    setShowAddDialog(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      salesRepIds: [],
    });
  };

  if (loading && territories.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchTerritories}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Territories</h2>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingTerritory(null);
                resetForm();
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Territory
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTerritory ? "Edit Territory" : "Add Territory"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name">Name</label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description">Description</label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="salesReps">Sales Representatives</label>
                <MultiSelect
                  options={salesReps.map((rep) => ({
                    value: rep.id,
                    label: rep.name,
                  }))}
                  value={formData.salesRepIds}
                  onChange={(value) =>
                    setFormData({ ...formData, salesRepIds: value })
                  }
                  placeholder="Select sales representatives..."
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddDialog(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editingTerritory ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {territories.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No territories found.</p>
          <p className="text-sm text-muted-foreground">
            Click the "Add Territory" button to create one.
          </p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Sales Representatives</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {territories.map((territory) => (
                <TableRow key={territory.id}>
                  <TableCell>{territory.name}</TableCell>
                  <TableCell>{territory.description}</TableCell>
                  <TableCell>
                    {territory.salesReps
                      .map((rep) => rep.name)
                      .join(", ") || "None"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(territory)}
                      >
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete Territory
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this territory? This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(territory.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
