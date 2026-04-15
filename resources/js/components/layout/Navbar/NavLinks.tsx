import { Link } from "@inertiajs/react";
// import type { Category } from "@/types/index";
// import { CategoryMenu } from "./CategoryMenu";


// interface NavLinksProps {
//   categories: Category[];
// }
// { categories }: NavLinksProps
export const NavLinks = () => (
  <div className="nav-links">
    <Link href="/">Главная</Link>
    {/* <CategoryMenu categories={categories}/> */}
    <Link href="/catalog">Каталог</Link>
    <Link href="/about">О нас</Link>
    <Link href="/contacts">Контакты</Link>
  </div>
);
