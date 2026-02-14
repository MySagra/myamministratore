"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { OrderDetailResponse, OrderStatus } from "@/lib/api-types";
import { getOrderById, updateOrderStatus } from "@/actions/orders";
import { toast } from "sonner";
import { Loader2Icon, ClipboardListIcon } from "lucide-react";

interface OrderDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: number | null;
  onOrderUpdated: () => void;
}

const statusLabels: Record<string, string> = {
  PENDING: "In attesa",
  CONFIRMED: "Confermato",
  COMPLETED: "Completato",
  PICKED_UP: "Ritirato",
};

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "outline",
  CONFIRMED: "default",
  COMPLETED: "secondary",
  PICKED_UP: "secondary",
};

const allStatuses: OrderStatus[] = ["PENDING", "CONFIRMED", "COMPLETED", "PICKED_UP"];

export function OrderDetailDialog({
  open,
  onOpenChange,
  orderId,
  onOrderUpdated,
}: OrderDetailDialogProps) {
  const [order, setOrder] = useState<OrderDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (open && orderId) {
      loadOrder(orderId);
    } else {
      setOrder(null);
    }
  }, [open, orderId]);

  async function loadOrder(id: number) {
    setIsLoading(true);
    try {
      const data = await getOrderById(id);
      setOrder(data);
    } catch (error) {
      toast.error("Errore nel caricamento dell'ordine");
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStatusChange(newStatus: string) {
    if (!order) return;
    setIsUpdating(true);
    try {
      await updateOrderStatus(order.id, newStatus as OrderStatus);
      setOrder({ ...order, status: newStatus as OrderStatus });
      toast.success("Stato ordine aggiornato");
      onOrderUpdated();
    } catch (error) {
      toast.error("Errore nell'aggiornamento dello stato");
    } finally {
      setIsUpdating(false);
    }
  }

  function formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardListIcon className="h-5 w-5" />
            {order ? `Ordine #${order.displayCode}` : "Dettaglio Ordine"}
          </DialogTitle>
          <DialogDescription>
            {order
              ? `Cliente: ${order.customer} — Tavolo: ${order.table}`
              : "Caricamento..."}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : order ? (
          <div className="flex flex-col gap-6">
            {/* Order info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Stato</p>
                <Select
                  value={order.status}
                  onValueChange={handleStatusChange}
                  disabled={isUpdating}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {allStatuses.map((s) => (
                      <SelectItem key={s} value={s}>
                        {statusLabels[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Metodo di pagamento</p>
                <p className="text-sm font-medium">
                  {order.paymentMethod === "CASH"
                    ? "Contanti"
                    : order.paymentMethod === "CARD"
                    ? "Carta"
                    : "-"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Creato il</p>
                <p className="text-sm font-medium">{formatDate(order.createdAt)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Confermato il</p>
                <p className="text-sm font-medium">{formatDate(order.confirmedAt)}</p>
              </div>
              {order.ticketNumber && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">N° Scontrino</p>
                  <p className="text-sm font-medium">{order.ticketNumber}</p>
                </div>
              )}
            </div>

            <Separator />

            {/* Categorized items */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Articoli ordinati</h4>
              {order.categorizedItems.map((catGroup) => (
                <div key={catGroup.category.id} className="space-y-2">
                  <Badge variant="outline">{catGroup.category.name}</Badge>
                  <div className="rounded-lg border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="px-3 py-2 text-left font-medium">Articolo</th>
                          <th className="px-3 py-2 text-center font-medium w-16">Qtà</th>
                          <th className="px-3 py-2 text-right font-medium w-24">Prezzo</th>
                          <th className="px-3 py-2 text-right font-medium w-24">Totale</th>
                        </tr>
                      </thead>
                      <tbody>
                        {catGroup.items.map((item) => (
                          <tr key={item.id} className="border-b last:border-0">
                            <td className="px-3 py-2">
                              <span className="font-medium">{item.food.name}</span>
                              {item.notes && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {item.notes}
                                </p>
                              )}
                              {item.food.ingredients && item.food.ingredients.length > 0 && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {item.food.ingredients
                                    .map((i) => i.name)
                                    .join(", ")}
                                </p>
                              )}
                            </td>
                            <td className="px-3 py-2 text-center">{item.quantity}</td>
                            <td className="px-3 py-2 text-right">
                              €{item.unitPrice.toFixed(2)}
                            </td>
                            <td className="px-3 py-2 text-right font-medium">
                              €{item.total.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotale</span>
                <span className="font-medium">€{order.subTotal}</span>
              </div>
              {order.discount != null && order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sconto</span>
                  <span className="font-medium text-green-600">
                    -€{order.discount.toFixed(2)}
                  </span>
                </div>
              )}
              {order.surcharge != null && order.surcharge > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Maggiorazione</span>
                  <span className="font-medium">
                    +€{order.surcharge.toFixed(2)}
                  </span>
                </div>
              )}
              {order.total && (
                <div className="flex justify-between text-base font-semibold pt-2 border-t">
                  <span>Totale</span>
                  <span>€{order.total}</span>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
