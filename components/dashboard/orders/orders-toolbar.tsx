"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchIcon } from "lucide-react";

interface OrdersToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
}

export function OrdersToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: OrdersToolbarProps) {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="relative flex-1 max-w-sm">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cerca ordini (cliente, tavolo, codice)..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Tutti gli stati" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tutti gli stati</SelectItem>
          <SelectItem value="PENDING">In attesa</SelectItem>
          <SelectItem value="CONFIRMED">Confermato</SelectItem>
          <SelectItem value="COMPLETED">Completato</SelectItem>
          <SelectItem value="PICKED_UP">Ritirato</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
