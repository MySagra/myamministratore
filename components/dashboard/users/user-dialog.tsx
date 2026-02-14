"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Role } from "@/lib/api-types";
import { createUser, updateUser } from "@/actions/users";
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
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";

const userSchema = z.object({
  username: z.string().min(4, "L'username deve avere almeno 4 caratteri"),
  password: z.string(),
  roleId: z.string().min(1, "Seleziona un ruolo"),
});

type UserFormValues = z.infer<typeof userSchema>;

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  roles: Role[];
  onSaved: (user: User) => void;
  onDelete?: (user: User) => void;
}

export function UserDialog({
  open,
  onOpenChange,
  user,
  roles,
  onSaved,
  onDelete,
}: UserDialogProps) {
  const isEditing = !!user;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      password: "",
      roleId: roles[0]?.id || "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username,
        password: "",
        roleId: user.role.id,
      });
    } else {
      form.reset({
        username: "",
        password: "",
        roleId: roles[0]?.id || "",
      });
    }
  }, [user, open, roles, form]);

  async function onSubmit(values: UserFormValues) {
    if (!values.password && !isEditing) {
      toast.error("La password è obbligatoria");
      return;
    }

    try {
      const data = {
        username: values.username.trim(),
        password: values.password || (isEditing ? user!.username : ""),
        roleId: values.roleId,
      };

      if (isEditing && user) {
        const updated = await updateUser(user.id, data);
        onSaved(updated);
        toast.success("Utente aggiornato");
      } else {
        const created = await createUser(data);
        onSaved(created);
        toast.success("Utente creato");
      }
    } catch (error: any) {
      toast.error(error.message || "Errore durante il salvataggio");
    }
  }

  function handleDeleteConfirm() {
    if (user && onDelete) {
      setShowDeleteConfirm(false);
      onDelete(user);
      onOpenChange(false);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Modifica Utente" : "Nuovo Utente"}
            </DialogTitle>
          </DialogHeader>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup className="py-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <Field>
                        <FieldLabel>Username</FieldLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Username (min. 4 caratteri)"
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <Field>
                        <FieldLabel>Password</FieldLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder={
                              isEditing ? "Nuova password" : "Password"
                            }
                          />
                        </FormControl>
                        {isEditing && (
                          <FieldDescription>
                            Lascia vuoto per non cambiare
                          </FieldDescription>
                        )}
                        <FormMessage />
                      </Field>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="roleId"
                  render={({ field }) => (
                    <FormItem>
                      <Field>
                        <FieldLabel>Ruolo</FieldLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleziona ruolo" />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem key={role.id} value={role.id}>
                                  {role.name}
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
                {isEditing && onDelete && user && (
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
              Sei sicuro di voler eliminare l'utente <span className="font-bold">{user?.username}</span>?
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
