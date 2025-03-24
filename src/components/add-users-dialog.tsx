"use client"

import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { userService } from '@/services/user.service';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface AddUsersDialogProps {
  classId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUsersAdded: () => void;
}

export function AddUsersDialog({
  classId,
  open,
  onOpenChange,
  onUsersAdded
}: AddUsersDialogProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getStudentsNotInClass(classId);
        setUsers(data);
      } catch (error) {
        toast.error("Erreur lors du chargement des utilisateurs");
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchUsers();
    }
  }, [open]);

  const handleUserSelect = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleAddUsers = async () => {
    try {
      await userService.addUsersToClass(classId, Array.from(selectedUsers));
      toast.success("Utilisateurs ajoutés avec succès");
      onUsersAdded();
      onOpenChange(false);
    } catch (error) {
      toast.error("Erreur lors de l'ajout des utilisateurs");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Ajouter des utilisateurs à la classe</DialogTitle>
          <DialogDescription>
            Sélectionnez les utilisateurs que vous souhaitez ajouter à cette classe.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[400px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.has(user.id)}
                      onCheckedChange={() => handleUserSelect(user.id)}
                    />
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>
          <Button
            onClick={handleAddUsers}
            disabled={selectedUsers.size === 0}
          >
            Ajouter les utilisateurs sélectionnés
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 