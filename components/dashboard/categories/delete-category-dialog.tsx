"use client";

import { useState } from "react";
import { Category } from "@/lib/api-types";
import { deleteCategory } from "@/actions/categories";
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

interface DeleteCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onDeleted: (id: string) => void;
}

export function DeleteCategoryDialog({
  open,
  onOpenChange,
  category,
  onDeleted,
}: DeleteCategoryDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    if (!category) return;

    setIsLoading(true);
    try {
      await deleteCategory(category.id);
      onDeleted(category.id);
      toast.success(`Categoria "${category.name}" eliminata`);
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
          <AlertDialogTitle>Elimina Categoria</AlertDialogTitle>
          <AlertDialogDescription>
            Sei sicuro di voler eliminare la categoria &quot;{category?.name}
            &quot;? Questa azione non può essere annullata.
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
