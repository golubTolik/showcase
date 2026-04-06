import { Link } from "@inertiajs/react";
import type { Category } from "@/types/index";
import { CategoryMenu } from "./CategoryMenu";


interface NavLinksProps {
  categories: Category[];
}

export const NavLinks = ({ categories }: NavLinksProps) => (
  <div className="nav-links">
    <Link href="/">Главная</Link>
    <CategoryMenu categories={categories} />
    <Link href="">О нас</Link>
    <Link href="">Контакты</Link>
  </div>
);
