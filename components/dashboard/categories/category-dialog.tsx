"use client";

import { useEffect, useRef, useState } from "react";
import { Category } from "@/lib/api-types";
import { createCategory, updateCategory } from "@/actions/categories";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2Icon, ImageIcon, UploadIcon } from "lucide-react";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1, "Il nome è obbligatorio"),
  available: z.boolean(),
});

type CategoryFormValues = z.input<typeof categorySchema>;

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onSaved: (category: Category) => void;
  onDelete?: (category: Category) => void;
}

export function CategoryDialog({
  open,
  onOpenChange,
  category,
  onSaved,
  onDelete,
}: CategoryDialogProps) {
  const isEditing = !!category;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      available: true,
    },
  });

  useEffect(() => {
    if (open) {
      if (category) {
        form.reset({
          name: category.name,
          available: category.available,
        });
      } else {
        form.reset({
          name: "",
          available: true,
        });
      }
      setImagePreview(null);
      setImageFile(null);
    }
  }, [category, open, form]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    }
  }

  function processFile(file: File) {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    }
  }

  async function onSubmit(values: CategoryFormValues) {
    try {
      const data = {
        name: values.name.trim(),
        available: values.available,
      };

      if (isEditing && category) {
        const updated = await updateCategory(category.id, data);
        onSaved(updated);
        toast.success("Categoria aggiornata");
      } else {
        const created = await createCategory(data);
        onSaved(created);
        toast.success("Categoria creata");
      }
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Errore durante il salvataggio");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl select-none">
            {isEditing ? "Modifica Categoria" : "Nuova Categoria"}
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="py-2">
              <Field>
                <FieldLabel htmlFor="name">Nome</FieldLabel>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          id="name"
                          autoComplete="off"
                          placeholder="Nome della categoria"
                          autoFocus
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Field>

              <div className="flex items-center gap-3">
                <FieldLabel htmlFor="available" className="mb-0">
                  Disponibile
                </FieldLabel>
                <FormField
                  control={form.control}
                  name="available"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Checkbox
                          id="available"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Field>
                <FieldLabel>Immagine</FieldLabel>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                {imagePreview ? (
                  <div
                    className="relative cursor-pointer rounded-xl border overflow-hidden"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <img
                      src={imagePreview}
                      alt="Anteprima"
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <UploadIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                ) : (
                  <Empty
                    className={`cursor-pointer border transition-colors h-40 ${
                      isDragOver
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <EmptyHeader>
                      <EmptyMedia>
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      </EmptyMedia>
                      <EmptyTitle>Carica un&apos;immagine</EmptyTitle>
                      <EmptyDescription>
                        Trascina qui o clicca per selezionare un file
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                )}
              </Field>
            </FieldGroup>
            <DialogFooter>
              {isEditing && onDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    onDelete(category);
                    onOpenChange(false);
                  }}
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
  );
}
