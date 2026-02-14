import { getOrders } from "@/actions/orders";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { OrdersContent } from "@/components/dashboard/orders/orders-content";
import { PaginatedOrders } from "@/lib/api-types";

export default async function OrdersPage() {
  let ordersData: PaginatedOrders = {
    orders: [],
    pagination: {
      currentPage: 1,
      totalOrdersPages: 0,
      totalOrdersItems: 0,
      itemsPerPage: 20,
      hasNextPage: false,
      hasPrevPage: false,
      nextPage: null,
      prevPage: null,
    },
  };

  try {
    ordersData = await getOrders({ page: 1, limit: 20 });
  } catch (error) {
    // fallback to empty
  }

  return (
    <>
      <DashboardHeader title="Ordini" />
      <OrdersContent initialData={ordersData} />
    </>
  );
}
