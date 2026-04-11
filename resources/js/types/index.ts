export type * from './auth';
// import type { PageProps as InertiaPageProps } from '@inertiajs/core';

// export interface PageProps extends InertiaPageProps {
//     flash: {
//         success?: string;
//         error?: string;
//     };

// }
// export interface Category {
//   id: number;
//   name: string;
//   img: string;
//   parent_id: number | null;
// }
// types/index.ts

// ----- Таблица categories -----
export interface Category {
  id: number;
  name: string;
  img: string | null;       // может быть null, если картинки нет
  parent_id: number | null; // null для корневых категорий
  created_at: string;       // дата в ISO или любом формате, который приходит с бэка
  updated_at: string;
}

// ----- Таблица products -----
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: string;           // например 'active', 'inactive', 'draft'
  category_id: number;
  created_at: string;
  updated_at: string;
}

// ----- Таблица product_images -----
export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  sort_order: number;       // порядок отображения
  created_at: string;
  updated_at: string;
}

// ----- Таблица attributes -----
export interface Attribute {
  id: number;
  name: string;             // например "Бренд", "Цвет", "Размер"
  created_at: string;
  updated_at: string;
}

// ----- Таблица attribute_values (связь продукта со значением атрибута) -----
export interface ProductAttributeValue {
  id: number;
  product_id: number;
  attribute_value_id: number;  // ссылка на таблицу attribute_value
  created_at: string;
  updated_at: string;
}

// Рекомендуемая таблица для значений атрибутов (например, "Apple", "Красный", "S")
export interface AttributeValue {
  id: number;
  attribute_id: number;        // к какому атрибуту относится (Brand, Color...)
  value: string;
  created_at: string;
  updated_at: string;
}

// Если вы хотите использовать единый интерфейс для значения атрибута, которое приходит
// уже с именем атрибута (например, при JOIN), можно определить расширенный тип:
export interface AttributeValueWithAttr extends ProductAttributeValue {
  attribute: Attribute;
  value: string;               // из AttributeValueOption
}

// Для удобства в компонентах часто используют тип товара с вложенными изображениями и атрибутами
export interface ProductWithDetails extends Product {
  images: ProductImage[];
  attributeValues: AttributeValueWithAttr[];
}
