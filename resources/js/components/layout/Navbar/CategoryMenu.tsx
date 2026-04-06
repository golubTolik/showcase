import { Link } from "@inertiajs/react";
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
      <HoverCardContent className="z-200 flex w-64 flex-col gap-0.5" style={{ padding: "10px 10px", backgroundColor: "#fefaf5" }}>
        {roots.map((rootCat) => {
          const subcategories = childrenMap.get(rootCat.id) || [];
          
          return (
            <HoverCard key={rootCat.id} openDelay={200} closeDelay={100}>
              <HoverCardTrigger asChild>
                <div className="cursor-pointer px-3 py-2 rounded-md hover:bg-gray-100 transition-colors">
                  {rootCat.name}
                </div>
              </HoverCardTrigger>
              <HoverCardContent side="right" align="start" sideOffset={8} className="z-250 flex w-64 flex-col gap-0.5" style={{ padding: "10px 10px", backgroundColor: "#fefaf5" }}>
                <div className="font-semibold mb-1">{rootCat.name}</div>
                <div className="flex flex-col gap-1">
                  {subcategories.length > 0 ? (
                    subcategories.map((sub) => (
                      <div key={sub.id} className="text-sm text-gray-700 hover:text-gray-900 cursor-pointer">
                        {sub.name}
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-400">Нет подкатегорий</div>
                  )}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">{subcategories.length} подкатегорий</div>
              </HoverCardContent>
            </HoverCard>
          );
        })}
      </HoverCardContent>
    </HoverCard>
  );
};
