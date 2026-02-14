"use client";

import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Printer } from "@/lib/api-types";
import { createPrinter, updatePrinter } from "@/actions/printers";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";

const printerSchema = z.object({
  name: z.string().min(1, "Il nome è obbligatorio"),
  ip: z.string().regex(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/, "Inserisci un indirizzo IP valido"),
  port: z.coerce
    .number()
    .int()
    .min(0, "La porta deve essere maggiore o uguale a 0")
    .max(65535, "La porta deve essere minore o uguale a 65535"),
  description: z.string().optional(),
});

type PrinterFormValues = z.input<typeof printerSchema>;

interface PrinterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  printer: Printer | null;
  onSaved: (printer: Printer) => void;
}

export function PrinterDialog({
  open,
  onOpenChange,
  printer,
  onSaved,
}: PrinterDialogProps) {
  const isEditing = !!printer;

  const form = useForm<PrinterFormValues>({
    resolver: zodResolver(printerSchema),
    defaultValues: {
      name: "",
      ip: "",
      port: 9100,
      description: "",
    },
  });

  useEffect(() => {
    if (printer) {
      form.reset({
        name: printer.name,
        ip: printer.ip,
        port: printer.port,
        description: printer.description || "",
      });
    } else {
      form.reset({
        name: "",
        ip: "",
        port: 9100,
        description: "",
      });
    }
  }, [printer, open, form]);

  async function onSubmit(values: PrinterFormValues) {
    try {
      const data = {
        name: values.name.trim(),
        ip: values.ip.trim(),
        port: values.port as number,
        description: values.description?.trim() || undefined,
      };

      if (isEditing && printer) {
        const updated = await updatePrinter(printer.id, {
          ...data,
          status: printer.status,
        });
        onSaved(updated);
        toast.success("Stampante aggiornata");
      } else {
        const created = await createPrinter(data);
        onSaved(created);
        toast.success("Stampante creata");
      }
    } catch (error: any) {
      toast.error(error.message || "Errore durante il salvataggio");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifica Stampante" : "Nuova Stampante"}
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="py-4">
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
                          placeholder="Nome della stampante"
                          autoFocus
                        />
                      </FormControl>
                      <FormMessage />
                    </Field>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ip"
                render={({ field }) => (
                  <FormItem>
                    <Field>
                      <FieldLabel>Indirizzo IP</FieldLabel>
                      <FormControl>
                        <Input {...field} placeholder="192.168.1.100" />
                      </FormControl>
                      <FormMessage />
                    </Field>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="port"
                render={({ field }) => (
                  <FormItem>
                    <Field>
                      <FieldLabel>Porta</FieldLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={String(field.value ?? "")}
                          type="number"
                          placeholder="9100"
                          min={0}
                          max={65535}
                        />
                      </FormControl>
                      <FormMessage />
                    </Field>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <Field>
                      <FieldLabel>Descrizione</FieldLabel>
                      <FormControl>
                        <Input {...field} placeholder="Descrizione opzionale" />
                      </FormControl>
                      <FormMessage />
                    </Field>
                  </FormItem>
                )}
              />
            </FieldGroup>
            <DialogFooter>
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
                    ? "Salva Modifiche"
                    : "Crea Stampante"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
