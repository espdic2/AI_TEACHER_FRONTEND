"use client"

import { useState, useEffect } from "react";
import { User } from "@/types/user";
import { userService } from "@/services/user.service";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";

interface EditUserDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated: () => void;
}

export function EditUserDialog({
  user,
  open,
  onOpenChange,
  onUserUpdated,
}: EditUserDialogProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
  });
  
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  
  const [passwordError, setPasswordError] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    // Mettre à jour les données du formulaire lorsque l'utilisateur change
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    
    // Réinitialiser les données de mot de passe et l'onglet actif
    setPasswordData({
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordError("");
    setActiveTab("profile");
  }, [user, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userService.updateUser(user.id, formData);
      toast.success("Utilisateur mis à jour avec succès");
      onUserUpdated();
      onOpenChange(false);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de l'utilisateur");
    }
  };
  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    
    // Validation du mot de passe
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas");
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setPasswordError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    
    try {
      await userService.resetUserPassword(user.id, passwordData.newPassword);
      toast.success("Mot de passe réinitialisé avec succès");
      setPasswordData({
        newPassword: "",
        confirmPassword: "",
      });
      onUserUpdated();
      onOpenChange(false);
    } catch (error) {
      toast.error("Erreur lors de la réinitialisation du mot de passe");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier l'utilisateur</DialogTitle>
          <DialogDescription>
            Modifiez les informations de l'utilisateur ou réinitialisez son mot de passe.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="password">Mot de passe</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <form id="profile-form" onSubmit={handleSubmit} className="space-y-4 py-2">
              <div>
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="role">Rôle</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: "ADMIN" | "PROFESSOR" | "STUDENT") =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STUDENT">Étudiant</SelectItem>
                    <SelectItem value="PROFESSOR">Professeur</SelectItem>
                    <SelectItem value="ADMIN">Administrateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="password">
            <form id="password-form" onSubmit={handlePasswordSubmit} className="space-y-4 py-2">
              <div>
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                />
              </div>
              {passwordError && (
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {passwordError}
                </div>
              )}
            </form>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          {activeTab === "profile" ? (
            <Button type="submit" form="profile-form">Enregistrer</Button>
          ) : (
            <Button type="submit" form="password-form">Réinitialiser le mot de passe</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 