import { Link } from "@inertiajs/react";
// import { useState } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import type { Category } from "@/types/index";
import { buildCategoryTree } from "@/utils/categoryUtils";

interface CategoryMenuProps {
  categories: Category[];
}

export const CategoryMenu = ({ categories }: CategoryMenuProps) => {
  const { roots, childrenMap } = buildCategoryTree(categories);

  return (
    <HoverCard openDelay={10} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Link href="">Каталог</Link>
      </HoverCardTrigger>
      <HoverCardContent className="z-200 flex min-w-[150px] flex-col gap-0.5" style={{ padding: "10px 10px", backgroundColor: "#fefaf5" }}>
        {roots.map((rootCat) => {
          const subcategories = childrenMap.get(rootCat.id) || [];

          return (

            <div className="relative group">
                <div className="cursor-pointer px-3 py-2 rounded-md hover:bg-gray-100">
                    {rootCat.name}
                </div>

                <div className="absolute left-full top-0 ml-2 hidden group-hover:block bg-white shadow-lg rounded-md p-3 min-w-[220px] border">
                    <div className="flex flex-col gap-1">
                        {subcategories.length > 0 ? (
                            subcategories.map((sub) => (
                                <div
                                    key={sub.id}
                                    className="text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-2 py-1 rounded cursor-pointer transition-colors"
                                >
                                    {sub.name}
                                </div>
                            ))
                        ) : (
                            <div className="text-sm text-gray-400 px-2 py-1">
                                Нет подкатегорий
                            </div>
                        )}
                    </div>
                </div>
            </div>

          );
        })}
      </HoverCardContent>
    </HoverCard>
  );
};
