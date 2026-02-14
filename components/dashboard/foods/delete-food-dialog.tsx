"use client";

import { useState } from "react";
import { Food } from "@/lib/api-types";
import { deleteFood } from "@/actions/foods";
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

interface DeleteFoodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  food: Food | null;
  onDeleted: (id: string) => void;
}

export function DeleteFoodDialog({
  open,
  onOpenChange,
  food,
  onDeleted,
}: DeleteFoodDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    if (!food) return;

    setIsLoading(true);
    try {
      await deleteFood(food.id);
      onDeleted(food.id);
      toast.success(`"${food.name}" eliminato`);
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
          <AlertDialogTitle>Elimina Cibo</AlertDialogTitle>
          <AlertDialogDescription>
            Sei sicuro di voler eliminare &quot;{food?.name}&quot;? Questa
            azione non può essere annullata.
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
