"use client";

import { useEffect } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
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
}

export function CashRegisterDialog({
  open,
  onOpenChange,
  cashRegister,
  printers,
  onSaved,
}: CashRegisterDialogProps) {
  const isEditing = !!cashRegister;

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? "Modifica Registratore di Cassa"
              : "Nuovo Registratore di Cassa"}
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
                          placeholder="Nome del registratore"
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
                name="defaultPrinterId"
                render={({ field }) => (
                  <FormItem>
                    <Field>
                      <FieldLabel>Stampante Predefinita</FieldLabel>
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
              <FormField
                control={form.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem>
                    <Field orientation="horizontal">
                      <FieldLabel>Abilitato</FieldLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
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
                    : "Crea Registratore"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
