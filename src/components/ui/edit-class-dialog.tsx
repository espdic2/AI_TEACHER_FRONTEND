import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { userService } from "@/services/user.service";
import { toast } from "sonner";
import { User } from "@/types/user";

interface EditClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: any) => void;
  initialData: {
    name: string;
    description: string;
    professorId: string;
  };
}

export function EditClassDialog({
  open,
  onOpenChange,
  onConfirm,
  initialData,
}: EditClassDialogProps) {
  const [formData, setFormData] = useState(initialData);
  const [professors, setProfessors] = useState<User[]>([]);

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const professors = await userService.getProfessors();
        setProfessors(professors);
      } catch (error) {
        toast.error("Erreur lors du chargement des professeurs");
      }
    };

    if (open) {
      fetchProfessors();
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier la classe</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nom de la classe</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="professor">Professeur</Label>
              <Select
                value={formData.professorId}
                onValueChange={(value) => setFormData({ ...formData, professorId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un professeur" />
                </SelectTrigger>
                <SelectContent>
                  {professors.map((professor) => (
                    <SelectItem key={professor.id} value={professor.id}>
                      {professor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 