import { Link } from '@inertiajs/react';
import React, { useState, useMemo, useEffect } from "react";
import { route } from "ziggy-js";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/Navbar";
import type { Category } from "@/types";
import { buildCategoryTree } from "@/utils/categoryUtils";


// Тип товара с деталями – соответствует структуре от сервера
interface ProductWithDetails {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: string;
  category_id: number;
  created_at: string;
  updated_at: string;
  images: {
    id: number;
    product_id: number;
    image_url: string;
    sort_order: number;
  }[];
  product_attribute_values: {
    id: number;
    product_id: number;
    attribute_value_id: number;
    attribute_value: {
      id: number;
      value: string;
      attribute_id: number;
      attribute: {
        id: number;
        name: string;
      };
    };
  }[];
}

interface CatalogProps {
  categories: Category[];
  products: ProductWithDetails[];
}

// Преобразует product_attribute_values в простой массив

function getAttributeValues(product: ProductWithDetails) {
  if (!product.product_attribute_values) return [];
  return product.product_attribute_values
    .map(pav => {
      const attrValues = pav.attribute_value;
      if (!attrValues || !attrValues.attribute) return null;
      return {
        id: pav.id,
        attribute_value_id: pav.attribute_value_id,
        attribute: attrValues.attribute,
        value: attrValues.value,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
}

// Рекурсивно собирает все id категории и её подкатегорий
function getAllCategoryIds(rootId: number, childrenMap: Map<number, Category[]>): number[] {
  const result = [rootId];
  const children = childrenMap.get(rootId) || [];
  for (const child of children) {
    result.push(...getAllCategoryIds(child.id, childrenMap));
  }
  return result;
}

// Фильтр товаров по цене и атрибутам
function filterProducts(
  products: ProductWithDetails[],
  allowedCategoryIds: number[],
  priceMin: number,
  priceMax: number,
  selectedAttributeFilters: Map<number, Set<number>>
): ProductWithDetails[] {
  return products.filter(p => {
    if (!allowedCategoryIds.includes(p.category_id)) return false;
    if (p.price < priceMin || p.price > priceMax) return false;

    const attrs = getAttributeValues(p);
    for (const [attrId, selectedValueIds] of selectedAttributeFilters.entries()) {
        const productAttrValues = attrs.filter(av => av.attribute?.id === attrId);
        const productValueIds = productAttrValues.map(av => av.attribute_value_id);
      const hasAnySelected = selectedValueIds.size === 0 || productValueIds.some(id => selectedValueIds.has(id));
      if (!hasAnySelected) return false;
    }
    return true;
  });
}

// Получает доступные атрибуты и их значения из набора товаров
function getAvailableAttributeOptions(products: ProductWithDetails[]): Map<number, { attribute: { id: number; name: string }; options: { id: number; value: string }[] }> {
  const attrMap = new Map<number, { attribute: { id: number; name: string }; options: Set<number> }>();

  for (const product of products) {
    const attrs = getAttributeValues(product);
    for (const av of attrs) {
        if (!av.attribute) continue;
        if (!attrMap.has(av.attribute.id)) {
            attrMap.set(av.attribute.id, {
            attribute: av.attribute,
            options: new Set()
            });
        }
        attrMap.get(av.attribute.id)!.options.add(av.attribute_value_id);
    }
  }

  const result = new Map();
  for (const [attrId, { attribute, options }] of attrMap.entries()) {
    const valueMap = new Map<number, string>();
    for (const product of products) {
      const attrs = getAttributeValues(product);
      for (const av of attrs) {
        if (av.attribute.id === attrId && !valueMap.has(av.attribute_value_id)) {
          valueMap.set(av.attribute_value_id, av.value);
        }
      }
    }
    const fullOptions = Array.from(options).map(optId => ({
      id: optId,
      value: valueMap.get(optId) || ""
    }));
    result.set(attrId, { attribute, options: fullOptions });
  }
  return result;
}

export default function Catalog({ categories, products }: CatalogProps) {
  const { roots, childrenMap } = buildCategoryTree(categories);

  const [selectedRootCategory, setSelectedRootCategory] = useState<Category | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | null>(null);
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(100000);
  const [selectedAttributeFilters, setSelectedAttributeFilters] = useState<Map<number, Set<number>>>(new Map());

  const currentSubcategories = useMemo(() => {
    if (!selectedRootCategory) return [];
    return childrenMap.get(selectedRootCategory.id) || [];
  }, [selectedRootCategory, childrenMap]);

  const allowedCategoryIds = useMemo(() => {
    if (!selectedRootCategory) return [];
    if (selectedSubcategoryId !== null) {
      return getAllCategoryIds(selectedSubcategoryId, childrenMap);
    }
    return getAllCategoryIds(selectedRootCategory.id, childrenMap);
  }, [selectedRootCategory, selectedSubcategoryId, childrenMap]);

  const categoryProducts = useMemo(() => {
    if (allowedCategoryIds.length === 0) return [];
    return products.filter(p => allowedCategoryIds.includes(p.category_id));
  }, [allowedCategoryIds, products]);
  console.log('categoryProducts:', categoryProducts);
    console.log('first product attrs:', categoryProducts[0] ? getAttributeValues(categoryProducts[0]) : []);

  const availableAttributes = useMemo(() => {
    return getAvailableAttributeOptions(categoryProducts);
  }, [categoryProducts]);

  const priceBounds = useMemo(() => {
    if (categoryProducts.length === 0) return { min: 0, max: 1000 };
    const prices = categoryProducts.map(p => p.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [categoryProducts]);

  useEffect(() => {
    setPriceMin(priceBounds.min);
    setPriceMax(priceBounds.max);
    setSelectedAttributeFilters(new Map());
  }, [priceBounds.min, priceBounds.max, selectedRootCategory, selectedSubcategoryId]);

  const filteredProducts = useMemo(() => {
    if (allowedCategoryIds.length === 0) return [];
    return filterProducts(products, allowedCategoryIds, priceMin, priceMax, selectedAttributeFilters);
  }, [products, allowedCategoryIds, priceMin, priceMax, selectedAttributeFilters]);

  const handleRootCategoryClick = (cat: Category) => {
    setSelectedRootCategory(cat);
    setSelectedSubcategoryId(null);
  };

  const handleSubcategoryClick = (subId: number | null) => {
    setSelectedSubcategoryId(subId);
  };

  const toggleAttributeOption = (attrId: number, optionId: number) => {
    setSelectedAttributeFilters(prev => {
      const newMap = new Map(prev);
      const currentSet = newMap.get(attrId) || new Set<number>();
      if (currentSet.has(optionId)) {
        currentSet.delete(optionId);
        if (currentSet.size === 0) newMap.delete(attrId);
        else newMap.set(attrId, currentSet);
      } else {
        currentSet.add(optionId);
        newMap.set(attrId, currentSet);
      }
      return newMap;
    });
  };

  const isOptionSelected = (attrId: number, optionId: number): boolean => {
    return selectedAttributeFilters.get(attrId)?.has(optionId) || false;
  };

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8 min-h-[100vh]">
        {/* Грид родительских категорий */}
        <div className="!mb-10">
          <h2 className="text-2xl font-bold !mb-4 !mt-4 font-[Gabriela]">Категории</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {roots.map(cat => (
              <div
                key={cat.id}
                onClick={() => handleRootCategoryClick(cat)}
                className={`cursor-pointer rounded-lg border !p-4 text-center transition-all hover:shadow-lg ${
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
              <div className="bg-white rounded-lg border !p-4">
                <h3 className="font-semibold text-lg !mb-3">Цена</h3>
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
                {availableAttributes.size === 0 ? (
                    <div className="bg-white rounded-lg border p-4">
                        <p className="text-gray-500">Нет доступных фильтров</p>
                    </div>
                    ) : (
                    Array.from(availableAttributes.entries()).map(([attrId, { attribute, options }]) => (
                        <div key={attrId} className="bg-white rounded-lg border !p-4">
                        <h3 className="font-semibold text-lg !mb-3">{attribute.name}</h3>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {options.map(opt => (
                            <label key={opt.id} className="flex items-center gap-2">
                                <input
                                type="checkbox"
                                checked={isOptionSelected(attrId, opt.id)}
                                onChange={() => toggleAttributeOption(attrId, opt.id)}
                                className="rounded"
                                />
                                <span className="text-sm">{opt.value}</span>
                            </label>
                            ))}
                            {options.length === 0 && (
                            <div className="text-sm text-gray-400">Нет значений</div>
                            )}
                        </div>
                        </div>
                    ))
                )}
            </aside>

            {/* Правая часть: подкатегории + товары */}
            <div className="flex-1">
              <div className="!mb-6">
                <div className="flex flex-wrap gap-2 border-b !pb-2">
                  <button
                    onClick={() => handleSubcategoryClick(null)}
                    className={`!px-3 !py-1 rounded-full text-sm transition ${
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
                      className={`!px-3 !py-1 rounded-full text-sm transition ${
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

              {filteredProducts.length === 0 ? (
                <div className="text-center !py-12 text-gray-500">Товары не найдены</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => {

                    return (
                      <div
                        key={product.id}
                        className="product-card bg-white rounded-3xl overflow-hidden transition-all duration-200 shadow-[0_8px_18px_rgba(0,0,0,0.03)] border border-[#f1e3d7] hover:-translate-y-1 hover:shadow-[0_20px_30px_-12px_rgba(82,45,18,0.12)] hover:border-[#e2cfbe]"
                      >

                          <div className="product-img-wrapper w-full aspect-square bg-[#faf0e6] flex items-center justify-center overflow-hidden">
                            <Link href={route('products.show', { product: product.id })}>
                            {product.images[0] ? (
                              <img
                                src={product.images[0].image_url}
                                alt={product.name}
                                className="product-img w-full h-full object-cover block"
                              />
                            ) : (
                              <div className="product-img-placeholder text-[#aa8e76] text-sm text-center p-4 bg-[#faf0e6] w-full h-full flex items-center justify-center">
                                🖼️ {product.name}
                              </div>
                            )}
                            </Link>
                          </div>
                          <div className="product-info !px-5 pt-[18px] pb-[22px]">
                            <div className="product-title text-xl font-semibold mb-2">
                              {product.name}
                            </div>
                            <div className="product-desc text-sm text-[#7c6957] !mb-4 leading-relaxed">
                              {product.description}
                            </div>
                            <div className="price-row flex justify-between items-baseline !mt-2">
                              <div>
                                <span className="price font-bold text-[1.4rem] text-[#b4632e]">
                                  {product.price} ₽
                                </span>
                              </div>
                              <button
                                className="btn-cart bg-[#f3ede7] border-none !py-2 !px-4 rounded-full font-medium cursor-pointer transition-colors duration-200 text-sm hover:bg-[#e7d9ce] hover:text-[#a35f34]"
                                data-id={product.id}
                                data-name={product.name}
                                onClick={(e) => {
                                  e.preventDefault();
                                  // логика добавления в корзину
                                }}
                              >
                                В корзину
                              </button>
                            </div>
                          </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">Выберите категорию, чтобы увидеть товары</div>
        )}
      </main>
      <Footer />
    </>
  );
}
