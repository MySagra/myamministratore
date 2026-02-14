"use client";

import { useState } from "react";
import { Printer } from "@/lib/api-types";
import { deletePrinter } from "@/actions/printers";
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

interface DeletePrinterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  printer: Printer | null;
  onDeleted: (id: string) => void;
}

export function DeletePrinterDialog({
  open,
  onOpenChange,
  printer,
  onDeleted,
}: DeletePrinterDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    if (!printer) return;

    setIsLoading(true);
    try {
      await deletePrinter(printer.id);
      onDeleted(printer.id);
      toast.success(`Stampante "${printer.name}" eliminata`);
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
          <AlertDialogTitle>Elimina Stampante</AlertDialogTitle>
          <AlertDialogDescription>
            Sei sicuro di voler eliminare la stampante &quot;{printer?.name}
            &quot;? Questa azione non può essere annullata.
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
