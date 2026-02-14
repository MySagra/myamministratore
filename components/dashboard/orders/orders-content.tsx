"use client";

import { useState } from "react";
import { OrderListResponse, OrderStatus, PaginatedOrders } from "@/lib/api-types";
import { OrdersToolbar } from "./orders-toolbar";
import { OrdersTable } from "./orders-table";
import { OrderDetailDialog } from "./order-detail-dialog";
import { getOrders } from "@/actions/orders";
import { toast } from "sonner";

interface OrdersContentProps {
  initialData: PaginatedOrders;
}

export function OrdersContent({ initialData }: OrdersContentProps) {
  const [orders, setOrders] = useState<OrderListResponse[]>(
    initialData?.orders ?? []
  );
  const [pagination, setPagination] = useState(initialData?.pagination ?? {
    currentPage: 1,
    totalOrdersPages: 0,
    totalOrdersItems: 0,
    itemsPerPage: 20,
    hasNextPage: false,
    hasPrevPage: false,
    nextPage: null,
    prevPage: null,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function loadOrders(params: {
    search?: string;
    status?: string;
    page?: number;
  }) {
    setIsLoading(true);
    try {
      const statusArr =
        params.status && params.status !== "all"
          ? [params.status as OrderStatus]
          : undefined;

      const data = await getOrders({
        search: params.search || undefined,
        status: statusArr,
        page: params.page || 1,
        limit: 20,
      });

      setOrders(data.orders);
      setPagination(data.pagination);
    } catch (error) {
      toast.error("Errore nel caricamento degli ordini");
    } finally {
      setIsLoading(false);
    }
  }

  function handleSearch(query: string) {
    setSearchQuery(query);
    loadOrders({ search: query, status: statusFilter });
  }

  function handleStatusFilter(status: string) {
    setStatusFilter(status);
    loadOrders({ search: searchQuery, status });
  }

  function handlePageChange(page: number) {
    loadOrders({ search: searchQuery, status: statusFilter, page });
  }

  function handleViewDetail(order: OrderListResponse) {
    setSelectedOrderId(parseInt(order.id));
    setDetailOpen(true);
  }

  function handleOrderUpdated() {
    loadOrders({ search: searchQuery, status: statusFilter, page: pagination.currentPage });
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <OrdersToolbar
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilter}
      />
      <OrdersTable
        orders={orders}
        pagination={pagination}
        isLoading={isLoading}
        onViewDetail={handleViewDetail}
        onPageChange={handlePageChange}
      />
      <OrderDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        orderId={selectedOrderId}
        onOrderUpdated={handleOrderUpdated}
      />
    </div>
  );
}
