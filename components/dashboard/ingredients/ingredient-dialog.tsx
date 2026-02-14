"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Ingredient } from "@/lib/api-types";
import { createIngredient, updateIngredient } from "@/actions/ingredients";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";

const ingredientSchema = z.object({
  name: z.string().min(1, "Il nome è obbligatorio"),
});

type IngredientFormValues = z.infer<typeof ingredientSchema>;

interface IngredientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ingredient: Ingredient | null;
  onSaved: (ingredient: Ingredient) => void;
  onDelete?: (ingredient: Ingredient) => void;
}

export function IngredientDialog({
  open,
  onOpenChange,
  ingredient,
  onSaved,
  onDelete,
}: IngredientDialogProps) {
  const isEditing = !!ingredient;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const form = useForm<IngredientFormValues>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (ingredient) {
      form.reset({
        name: ingredient.name,
      });
    } else {
      form.reset({
        name: "",
      });
    }
  }, [ingredient, open, form]);

  async function onSubmit(values: IngredientFormValues) {
    try {
      if (isEditing && ingredient) {
        const updated = await updateIngredient(ingredient.id, {
          name: values.name.trim(),
        });
        onSaved(updated);
        toast.success("Ingrediente aggiornato");
      } else {
        const created = await createIngredient({ name: values.name.trim() });
        onSaved(created);
        toast.success("Ingrediente creato");
      }
    } catch (error: any) {
      toast.error(error.message || "Errore durante il salvataggio");
    }
  }

  function handleDeleteConfirm() {
    if (ingredient && onDelete) {
      setShowDeleteConfirm(false);
      onDelete(ingredient);
      onOpenChange(false);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">
              {isEditing ? "Modifica Ingrediente" : "Nuovo Ingrediente"}
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
                            placeholder="Nome dell'ingrediente"
                            autoFocus
                          />
                        </FormControl>
                        <FormMessage />
                      </Field>
                    </FormItem>
                  )}
                />
              </FieldGroup>
              <DialogFooter>
                {isEditing && onDelete && ingredient && (
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
              Sei sicuro di voler eliminare l'ingrediente <span className="font-bold">{ingredient?.name}</span>?
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
