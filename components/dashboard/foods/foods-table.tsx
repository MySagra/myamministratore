"use client";

import { useState, useMemo, useEffect } from "react";
import { Food } from "@/lib/api-types";
import { toggleFoodAvailability } from "@/actions/foods";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { PencilIcon, ArrowUpIcon, ArrowDownIcon, ArrowUpDownIcon } from "lucide-react";
import { toast } from "sonner";

interface FoodsTableProps {
  foods: Food[];
  onEdit: (food: Food) => void;
  onToggle: (updated: Food) => void;
}

type SortColumn = "name" | "category" | "price" | "available" | null;
type SortDirection = "asc" | "desc";

export function FoodsTable({ foods, onEdit, onToggle }: FoodsTableProps) {
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  useEffect(() => {
    const savedColumn = localStorage.getItem("foods-table-sort-column");
    const savedDirection = localStorage.getItem("foods-table-sort-direction");
    if (savedColumn) {
      setSortColumn(savedColumn as SortColumn);
    }
    if (savedDirection) {
      setSortDirection(savedDirection as SortDirection);
    }
  }, []);

  useEffect(() => {
    if (sortColumn) {
      localStorage.setItem("foods-table-sort-column", sortColumn);
    } else {
      localStorage.removeItem("foods-table-sort-column");
    }
    localStorage.setItem("foods-table-sort-direction", sortDirection);
  }, [sortColumn, sortDirection]);

  function handleSort(column: SortColumn) {
    if (sortColumn === column) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortColumn(null);
        setSortDirection("asc");
      }
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  }

  const sortedFoods = useMemo(() => {
    if (!sortColumn) return foods;

    return [...foods].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortColumn) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "category":
          aValue = a.category?.name?.toLowerCase() || "";
          bValue = b.category?.name?.toLowerCase() || "";
          break;
        case "price":
          aValue = a.price;
          bValue = b.price;
          break;
        case "available":
          aValue = a.available ? 1 : 0;
          bValue = b.available ? 1 : 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [foods, sortColumn, sortDirection]);

  async function handleToggle(food: Food) {
    setTogglingId(food.id);
    try {
      const updated = await toggleFoodAvailability(food.id, !food.available);
      onToggle(updated);
      toast.success(
        `"${food.name}" ${updated.available ? "abilitato" : "disabilitato"}`
      );
    } catch (error) {
      toast.error("Errore durante l'aggiornamento");
    } finally {
      setTogglingId(null);
    }
  }

  function formatPrice(price: number): string {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  }

  function SortIcon({ column }: { column: SortColumn }) {
    if (sortColumn !== column) {
      return <ArrowUpDownIcon className="h-4 w-4 ml-1 opacity-30" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUpIcon className="h-4 w-4 ml-1" />
    ) : (
      <ArrowDownIcon className="h-4 w-4 ml-1" />
    );
  }

  if (sortedFoods.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed p-8">
        <p className="text-muted-foreground text-sm">Nessun cibo trovato</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>
              <button
                onClick={() => handleSort("name")}
                className="flex items-center hover:text-foreground transition-colors font-medium"
              >
                Nome
                <SortIcon column="name" />
              </button>
            </TableHead>
            <TableHead>
              <button
                onClick={() => handleSort("category")}
                className="flex items-center hover:text-foreground transition-colors font-medium"
              >
                Categoria
                <SortIcon column="category" />
              </button>
            </TableHead>
            <TableHead className="w-28">
              <button
                onClick={() => handleSort("price")}
                className="flex items-center ml-auto hover:text-foreground transition-colors font-medium"
              >
                Prezzo
                <SortIcon column="price" />
              </button>
            </TableHead>
            <TableHead className="w-32">
              <button
                onClick={() => handleSort("available")}
                className="flex items-center mx-auto hover:text-foreground transition-colors font-medium"
              >
                Disponibile
                <SortIcon column="available" />
              </button>
            </TableHead>
            <TableHead className="w-24 text-right">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedFoods.map((food) => (
            <TableRow key={food.id}>
              <TableCell>
                <div>
                  <span className="font-medium">{food.name}</span>
                  {food.description && (
                    <p className="text-xs text-muted-foreground truncate max-w-xs">
                      {food.description}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {food.category?.name || "—"}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatPrice(food.price)}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center">
                  <Checkbox
                    checked={food.available}
                    disabled={togglingId === food.id}
                    onCheckedChange={() => handleToggle(food)}
                  />
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(food)}
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
