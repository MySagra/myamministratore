import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { CategoriesContent } from "@/components/dashboard/categories/categories-content";
import { getCategories } from "@/actions/categories";
import { Category } from "@/lib/api-types";

export default async function CategoriesPage() {
  let categories: Category[] = [];
  try {
    categories = await getCategories();
  } catch (error) {
    categories = [];
  }

  return (
    <>
      <DashboardHeader title="Categorie" />
      <CategoriesContent initialCategories={categories} />
    </>
  );
}
