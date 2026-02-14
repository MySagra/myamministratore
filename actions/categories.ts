"use server";

import { fetchApi } from "@/lib/api";
import { API_ENDPOINTS, Category } from "@/lib/api-types";
import { revalidatePath } from "next/cache";

export async function getCategories(): Promise<Category[]> {
  return fetchApi<Category[]>(API_ENDPOINTS.CATEGORIES.ALL);
}

export async function getCategoryById(id: string): Promise<Category> {
  return fetchApi<Category>(API_ENDPOINTS.CATEGORIES.BY_ID(id));
}

export async function createCategory(data: {
  name: string;
  available: boolean;
  position?: number;
  printerId?: string | null;
}): Promise<Category> {
  const result = await fetchApi<Category>(API_ENDPOINTS.CATEGORIES.ALL, {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidatePath("/dashboard/categories");
  return result;
}

export async function updateCategory(
  id: string,
  data: {
    name?: string;
    available?: boolean;
    position?: number;
    printerId?: string | null;
  }
): Promise<Category> {
  const result = await fetchApi<Category>(API_ENDPOINTS.CATEGORIES.BY_ID(id), {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  revalidatePath("/dashboard/categories");
  return result;
}

export async function reorderCategories(
  positions: { id: string; position: number }[]
): Promise<Category[]> {
  const results: Category[] = [];
  for (const { id, position } of positions) {
    const result = await fetchApi<Category>(
      API_ENDPOINTS.CATEGORIES.BY_ID(id),
      {
        method: "PATCH",
        body: JSON.stringify({ position }),
      }
    );
    results.push(result);
  }
  revalidatePath("/dashboard/categories");
  return results;
}

export async function toggleCategoryAvailability(
  id: string,
  available: boolean
): Promise<Category> {
  const result = await fetchApi<Category>(API_ENDPOINTS.CATEGORIES.BY_ID(id), {
    method: "PATCH",
    body: JSON.stringify({ available }),
  });
  revalidatePath("/dashboard/categories");
  return result;
}

export async function deleteCategory(id: string): Promise<void> {
  await fetchApi(API_ENDPOINTS.CATEGORIES.BY_ID(id), {
    method: "DELETE",
  });
  revalidatePath("/dashboard/categories");
}
