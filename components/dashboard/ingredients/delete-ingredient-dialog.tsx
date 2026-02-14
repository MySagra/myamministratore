"use client";

import { useState } from "react";
import { Ingredient } from "@/lib/api-types";
import { deleteIngredient } from "@/actions/ingredients";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface DeleteIngredientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ingredient: Ingredient | null;
  onDeleted: (id: string) => void;
}

export function DeleteIngredientDialog({
  open,
  onOpenChange,
  ingredient,
  onDeleted,
}: DeleteIngredientDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    if (!ingredient) return;

    setIsLoading(true);
    try {
      await deleteIngredient(ingredient.id);
      onDeleted(ingredient.id);
      toast.success(`Ingrediente "${ingredient.name}" eliminato`);
    } catch (error: any) {
      toast.error(error.message || "Errore durante l'eliminazione");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Elimina Ingrediente</AlertDialogTitle>
          <AlertDialogDescription>
            Sei sicuro di voler eliminare l&apos;ingrediente &quot;
            {ingredient?.name}&quot;? Questa azione non può essere annullata.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Annulla</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            variant="destructive"
          >
            {isLoading ? "Eliminazione..." : "Elimina"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
