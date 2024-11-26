"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SalesRep {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
}

export function SalesRepManagement() {
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentSalesRep, setCurrentSalesRep] = useState<SalesRep | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchSalesReps();
  }, []);

  const fetchSalesReps = async () => {
    try {
      const response = await fetch("/api/sales-reps");
      const data = await response.json();
      setSalesReps(data);
    } catch (error) {
      console.error("Error fetching sales reps:", error);
      toast({
        title: "Error",
        description: "Failed to load sales representatives",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/sales-reps", {
        method: currentSalesRep ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          currentSalesRep
            ? { ...formData, id: currentSalesRep.id }
            : formData
        ),
      });

      if (response.ok) {
        setIsAddDialogOpen(false);
        setIsEditDialogOpen(false);
        setCurrentSalesRep(null);
        setFormData({ name: "", email: "", phone: "" });
        fetchSalesReps();
        toast({
          title: "Success",
          description: currentSalesRep 
            ? "Sales representative updated successfully"
            : "Sales representative added successfully",
        });
      }
    } catch (error) {
      console.error("Error saving sales rep:", error);
      toast({
        title: "Error",
        description: "Failed to save sales representative",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (salesRep: SalesRep) => {
    setCurrentSalesRep(salesRep);
    setFormData({
      name: salesRep.name,
      email: salesRep.email,
      phone: salesRep.phone,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sales representative?")) {
      return;
    }

    try {
      const response = await fetch(`/api/sales-reps?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchSalesReps();
        toast({
          title: "Success",
          description: "Sales representative deleted successfully",
        });
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting sales rep:", error);
      toast({
        title: "Error",
        description: "Failed to delete sales representative",
        variant: "destructive",
      });
    }
  };

  const SalesRepForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
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
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) =>
            setFormData({ ...formData, phone: e.target.value })
          }
          required
        />
      </div>
      <Button type="submit" className="w-full">
        {currentSalesRep ? "Update" : "Add"} Sales Representative
      </Button>
    </form>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sales Representatives</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Sales Rep
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Sales Representative</DialogTitle>
            </DialogHeader>
            <SalesRepForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salesReps.map((salesRep) => (
              <TableRow key={salesRep.id}>
                <TableCell>{salesRep.name}</TableCell>
                <TableCell>{salesRep.email}</TableCell>
                <TableCell>{salesRep.phone}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      salesRep.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {salesRep.status}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(salesRep)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(salesRep.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Sales Representative</DialogTitle>
          </DialogHeader>
          <SalesRepForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}
