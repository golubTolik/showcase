import type { Category } from "@/types/index";

export function buildCategoryTree(categories: Category[]) {
  const roots: Category[] = [];
  const childrenMap = new Map<number, Category[]>();

  // Сначала группируем по parent_id
  for (const cat of categories) {
    if (cat.parent_id === null) {
      roots.push(cat);
    } else {
      const existing = childrenMap.get(cat.parent_id) || [];
      existing.push(cat);
      childrenMap.set(cat.parent_id, existing);
    }
  }

  return { roots, childrenMap };
}
