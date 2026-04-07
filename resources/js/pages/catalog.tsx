import React, { useState, useMemo } from "react";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/Navbar";
import type { Category } from "@/types/index";
import { buildCategoryTree } from "@/utils/categoryUtils";

interface CategoryMenuProps {
  categories: Category[];
}
interface Product {
  id: number;
  name: string;
  price: number;
  brand: string;
  category_id: number;
  image: string;
}

const mockProducts: Product[] = [
  // Ноутбуки
  { id: 1, name: "MacBook Pro 14", price: 1999, brand: "Apple", category_id: 2, image: "/placeholder.png" },
  { id: 2, name: "Dell XPS 13", price: 1499, brand: "Dell", category_id: 2, image: "/placeholder.png" },
  // Смартфоны
  { id: 3, name: "iPhone 15 Pro", price: 1099, brand: "Apple", category_id: 3, image: "/placeholder.png" },
  { id: 4, name: "Samsung Galaxy S24", price: 999, brand: "Samsung", category_id: 3, image: "/placeholder.png" },
  // Наушники
  { id: 5, name: "Sony WH-1000XM5", price: 399, brand: "Sony", category_id: 4, image: "/placeholder.png" },
  { id: 6, name: "AirPods Pro 2", price: 249, brand: "Apple", category_id: 4, image: "/placeholder.png" },
  // Мужская одежда
  { id: 7, name: "Nike Air Max", price: 120, brand: "Nike", category_id: 8, image: "/placeholder.png" },
  { id: 8, name: "Adidas Ultraboost", price: 180, brand: "Adidas", category_id: 8, image: "/placeholder.png" },
  { id: 9, name: "Футболка хлопок", price: 25, brand: "Uniqlo", category_id: 9, image: "/placeholder.png" },
  // Женская одежда
  { id: 10, name: "Платье летнее", price: 60, brand: "Zara", category_id: 10, image: "/placeholder.png" },
  { id: 11, name: "Платье вечернее", price: 150, brand: "H&M", category_id: 10, image: "/placeholder.png" },
];

// Вспомогательная функция: получить все ID категории + всех её подкатегорий (рекурсивно)
function getAllCategoryIds(
  rootId: number,
  childrenMap: Map<number, Category[]>
): number[] {
  const result = [rootId];
  const children = childrenMap.get(rootId) || [];

  for (const child of children) {
    result.push(...getAllCategoryIds(child.id, childrenMap));
  }

  return result;
}

// Получить уникальные бренды из списка товаров
function getAvailableBrands(products: Product[]): string[] {
  return Array.from(new Set(products.map(p => p.brand))).sort();
}

// Фильтр товаров по категориям, цене и брендам
function filterProducts(
  products: Product[],
  allowedCategoryIds: number[],
  priceMin: number,
  priceMax: number,
  selectedBrands: string[]
): Product[] {
  return products.filter(p => {

    if (!allowedCategoryIds.includes(p.category_id)) return false;

    if (p.price < priceMin || p.price > priceMax) return false;

    if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false;

    return true;
  });
}

export default function Catalog({ categories }: CategoryMenuProps) {
  // Построение дерева категорий (корневые и карта детей)
  const { roots, childrenMap } = buildCategoryTree(categories);

  // Состояния
  const [selectedRootCategory, setSelectedRootCategory] = useState<Category | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | null>(null);
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(10000);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  // Получить подкатегории выбранной родительской категории (только прямые потомки)
  const currentSubcategories = useMemo(() => {

    if (!selectedRootCategory) return [];

    return childrenMap.get(selectedRootCategory.id) || [];
  }, [selectedRootCategory, childrenMap]);

  // Определить, какие ID категорий участвуют в выборке товаров
  const allowedCategoryIds = useMemo(() => {
    if (!selectedRootCategory) return [];
    // Если выбрана подкатегория – показываем товары только этой подкатегории + её потомков

    if (selectedSubcategoryId !== null) {
      return getAllCategoryIds(selectedSubcategoryId, childrenMap);
    }
    // Иначе – вся ветка от корня

    return getAllCategoryIds(selectedRootCategory.id, childrenMap);
  }, [selectedRootCategory, selectedSubcategoryId, childrenMap]);

  // Товары, соответствующие выбранной категории (без дополнительных фильтров)
  const categoryProducts = useMemo(() => {

    if (allowedCategoryIds.length === 0) return [];

    return mockProducts.filter(p => allowedCategoryIds.includes(p.category_id));
  }, [allowedCategoryIds]);

  // Доступные бренды и диапазон цен для этих товаров (для отображения в фильтрах)
  const availableBrands = useMemo(() => getAvailableBrands(categoryProducts), [categoryProducts]);
  const priceBounds = useMemo(() => {

    if (categoryProducts.length === 0) return { min: 0, max: 1000 };

    const prices = categoryProducts.map(p => p.price);

    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [categoryProducts]);

  // Сброс цены и брендов при смене категории
  React.useEffect(() => {
    setPriceMin(priceBounds.min);
    setPriceMax(priceBounds.max);
    setSelectedBrands([]);
  }, [priceBounds.min, priceBounds.max]);

  // Итоговые отфильтрованные товары
  const filteredProducts = useMemo(() => {
    return filterProducts(mockProducts, allowedCategoryIds, priceMin, priceMax, selectedBrands);
  }, [allowedCategoryIds, priceMin, priceMax, selectedBrands]);

  // Обработчики
  const handleRootCategoryClick = (cat: Category) => {
    setSelectedRootCategory(cat);
    setSelectedSubcategoryId(null);
    // Сброс фильтров (min/max будут сброшены в useEffect)
  };

  const handleSubcategoryClick = (subId: number | null) => {
    setSelectedSubcategoryId(subId);
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const handlePriceChange = (min: number, max: number) => {
    setPriceMin(min);
    setPriceMax(max);
  };

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Грид родительских категорий */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Категории</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {roots.map(cat => (
              <div
                key={cat.id}
                onClick={() => handleRootCategoryClick(cat)}
                className={`cursor-pointer rounded-lg border p-4 text-center transition-all hover:shadow-lg ${
                  selectedRootCategory?.id === cat.id
                    ? "border-[#B18B72] bg-[#f1e3d7] shadow-md"
                    : "border-[#f2e3d6] bg-white"
                }`}
              >
                <div className="font-semibold">{cat.name}</div>
              </div>
            ))}
          </div>
        </div>

        {selectedRootCategory ? (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Левая панель фильтров */}
            <aside className="w-full md:w-72 flex-shrink-0 space-y-6">
              <div className="bg-white rounded-lg border p-4">
                <h3 className="font-semibold text-lg mb-3">Цена</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>от {priceMin} ₽</span>
                    <span>до {priceMax} ₽</span>
                  </div>
                  <input
                    type="range"
                    min={priceBounds.min}
                    max={priceBounds.max}
                    value={priceMin}
                    onChange={(e) => setPriceMin(Number(e.target.value))}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min={priceBounds.min}
                    max={priceBounds.max}
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={priceMin}
                      onChange={(e) => setPriceMin(Number(e.target.value))}
                      className="w-24 border rounded px-2 py-1 text-sm"
                    />
                    <input
                      type="number"
                      value={priceMax}
                      onChange={(e) => setPriceMax(Number(e.target.value))}
                      className="w-24 border rounded px-2 py-1 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border p-4">
                <h3 className="font-semibold text-lg mb-3">Бренды</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {availableBrands.map(brand => (
                    <label key={brand} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="rounded"
                      />
                      <span className="text-sm">{brand}</span>
                    </label>
                  ))}
                  {availableBrands.length === 0 && (
                    <div className="text-sm text-gray-400">Нет брендов</div>
                  )}
                </div>
              </div>
            </aside>

            {/* Правая часть: подкатегории + товары */}
            <div className="flex-1">
              {/* Горизонтальный список подкатегорий */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 border-b pb-2">
                  <button
                    onClick={() => handleSubcategoryClick(null)}
                    className={`px-3 py-1 rounded-full text-sm transition ${
                      selectedSubcategoryId === null
                        ? "bg-[#B18B72] text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    Все товары
                  </button>
                  {currentSubcategories.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => handleSubcategoryClick(sub.id)}
                      className={`px-3 py-1 rounded-full text-sm transition ${
                        selectedSubcategoryId === sub.id
                          ? "bg-[#B18B72] text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Список товаров: Grid */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  Товары не найдены
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                      <div className="h-48 bg-gray-100 flex items-center justify-center">
                        {/* Заглушка изображения */}
                        <span className="text-gray-400">🖼️ {product.name}</span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <p className="text-gray-500 text-sm">Бренд: {product.brand}</p>
                        <p className="text-xl font-bold mt-2">{product.price} ₽</p>
                        <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                          В корзину
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            Выберите категорию, чтобы увидеть товары
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
