"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CashRegister, Printer } from "@/lib/api-types";
import {
  createCashRegister,
  updateCashRegister,
} from "@/actions/cash-registers";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";

const cashRegisterSchema = z.object({
  name: z.string().min(1, "Il nome è obbligatorio"),
  defaultPrinterId: z.string().min(1, "Seleziona una stampante predefinita"),
  enabled: z.boolean(),
});

type CashRegisterFormValues = z.infer<typeof cashRegisterSchema>;

interface CashRegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cashRegister: CashRegister | null;
  printers: Printer[];
  onSaved: (cashRegister: CashRegister) => void;
  onDelete?: (cashRegister: CashRegister) => void;
}

export function CashRegisterDialog({
  open,
  onOpenChange,
  cashRegister,
  printers,
  onSaved,
  onDelete,
}: CashRegisterDialogProps) {
  const isEditing = !!cashRegister;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const form = useForm<CashRegisterFormValues>({
    resolver: zodResolver(cashRegisterSchema),
    defaultValues: {
      name: "",
      defaultPrinterId: printers[0]?.id || "",
      enabled: true,
    },
  });

  useEffect(() => {
    if (cashRegister) {
      form.reset({
        name: cashRegister.name,
        defaultPrinterId: cashRegister.defaultPrinterId,
        enabled: cashRegister.enabled,
      });
    } else {
      form.reset({
        name: "",
        defaultPrinterId: printers[0]?.id || "",
        enabled: true,
      });
    }
  }, [cashRegister, open, printers, form]);

  async function onSubmit(values: CashRegisterFormValues) {
    try {
      const data = {
        name: values.name.trim(),
        defaultPrinterId: values.defaultPrinterId,
        enabled: values.enabled,
      };

      if (isEditing && cashRegister) {
        const updated = await updateCashRegister(cashRegister.id, data);
        onSaved(updated);
        toast.success("Registratore di cassa aggiornato");
      } else {
        const created = await createCashRegister(data);
        onSaved(created);
        toast.success("Registratore di cassa creato");
      }
    } catch (error: any) {
      toast.error(error.message || "Errore durante il salvataggio");
    }
  }

  function handleDeleteConfirm() {
    if (cashRegister && onDelete) {
      setShowDeleteConfirm(false);
      onDelete(cashRegister);
      onOpenChange(false);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">
              {isEditing
                ? "Modifica Registratore di Cassa"
                : "Nuovo Registratore di Cassa"}
            </DialogTitle>
          </DialogHeader>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup className="py-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <Field>
                        <FieldLabel>Nome</FieldLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Nome del registratore"
                            autoFocus
                          />
                        </FormControl>
                        <FormMessage />
                      </Field>
                    </FormItem>
                  )}
                />

                <div className="flex items-center gap-3">
                  <FieldLabel htmlFor="enabled" className="mb-0">
                    Abilitato
                  </FieldLabel>
                  <FormField
                    control={form.control}
                    name="enabled"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Checkbox
                            id="enabled"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="defaultPrinterId"
                  render={({ field }) => (
                    <FormItem>
                      <Field>
                        <FieldLabel>Stampante Cassa</FieldLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleziona stampante" />
                            </SelectTrigger>
                            <SelectContent>
                              {printers.map((printer) => (
                                <SelectItem key={printer.id} value={printer.id}>
                                  {printer.name} ({printer.ip})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </Field>
                    </FormItem>
                  )}
                />
              </FieldGroup>
              <DialogFooter>
                {isEditing && onDelete && cashRegister && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="mr-auto"
                  >
                    <Trash2Icon className="h-4 w-4 mr-2" />
                    Elimina
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Annulla
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting
                    ? "Salvataggio..."
                    : isEditing
                      ? "Salva"
                      : "Crea"}
                </Button>
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Conferma eliminazione</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare il registratore <span className="font-bold">{cashRegister?.name}</span>?
              <br />
              Questa azione non può essere annullata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              variant="destructive"
            >
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
