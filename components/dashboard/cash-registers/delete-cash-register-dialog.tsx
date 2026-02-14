"use client";

import { useState } from "react";
import { CashRegister } from "@/lib/api-types";
import { deleteCashRegister } from "@/actions/cash-registers";
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

interface DeleteCashRegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cashRegister: CashRegister | null;
  onDeleted: (id: string) => void;
}

export function DeleteCashRegisterDialog({
  open,
  onOpenChange,
  cashRegister,
  onDeleted,
}: DeleteCashRegisterDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    if (!cashRegister) return;

    setIsLoading(true);
    try {
      await deleteCashRegister(cashRegister.id);
      onDeleted(cashRegister.id);
      toast.success(`Registratore "${cashRegister.name}" eliminato`);
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
          <AlertDialogTitle>Elimina Registratore di Cassa</AlertDialogTitle>
          <AlertDialogDescription>
            Sei sicuro di voler eliminare il registratore &quot;
            {cashRegister?.name}&quot;? Questa azione non può essere annullata.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Annulla</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {isLoading ? "Eliminazione..." : "Elimina"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
