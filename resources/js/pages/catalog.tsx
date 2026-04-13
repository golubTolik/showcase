import { Link, router, usePage } from '@inertiajs/react';
import React, { useState, useMemo, useEffect, useRef } from "react";
import { route } from "ziggy-js";
import Alert from '@/components/layout/alert';
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
    selectedCategoryId?: number | null;
}

// Преобразует product_attribute_values в простой массив

function getAttributeValues(product: ProductWithDetails) {
    if (!product.product_attribute_values) {
        return [];
}

  return product.product_attribute_values
    .map(pav => {
      const attrValues = pav.attribute_value;

      if (!attrValues || !attrValues.attribute) {
        return null;
    }

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
        if (!allowedCategoryIds.includes(p.category_id)) {
            return false;
        }

        if (p.price < priceMin || p.price > priceMax) {
            return false;
        }

        const attrs = getAttributeValues(p);

        for (const [attrId, selectedValueIds] of selectedAttributeFilters.entries()) {
            const productAttrValues = attrs.filter(av => av.attribute?.id === attrId);
            const productValueIds = productAttrValues.map(av => av.attribute_value_id);
        const hasAnySelected = selectedValueIds.size === 0 || productValueIds.some(id => selectedValueIds.has(id));

        if (!hasAnySelected){
            return false;
        }
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
            if (!av.attribute) {
                continue;
            }

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

const STORAGE_KEYS = {
    ROOT_CATEGORY: 'catalog_root_category_id',
    SUB_CATEGORY: 'catalog_subcategory_id',
    PRICE_MIN: 'catalog_price_min',
    PRICE_MAX: 'catalog_price_max',
    ATTRIBUTE_FILTERS: 'catalog_attribute_filters',
    };

    function saveAttributeFilters(filters: Map<number, Set<number>>) {
    const obj: Record<number, number[]> = {};

    for (const [attrId, set] of filters.entries()) {
        obj[attrId] = Array.from(set);
    }

    localStorage.setItem(STORAGE_KEYS.ATTRIBUTE_FILTERS, JSON.stringify(obj));
}

    function loadAttributeFilters(): Map<number, Set<number>> {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTRIBUTE_FILTERS);

    if (!raw) {
        return new Map();
    }

    try {
        const obj = JSON.parse(raw) as Record<number, number[]>;
        const map = new Map<number, Set<number>>();

        for (const [attrId, arr] of Object.entries(obj)) {
        map.set(Number(attrId), new Set(arr));
        }

        return map;
    } catch {
        return new Map();
    }
}

export default function Catalog({ categories, products, selectedCategoryId }: CatalogProps) {
    const { flash } = usePage().props as { flash?: { success?: string; error?: string; info?: string }};

    const { roots, childrenMap } = buildCategoryTree(categories);

    const [selectedRootCategory, setSelectedRootCategory] = useState<Category | null>(() => {
        // сначала из переданного параметра
        if (selectedCategoryId) {
            const found = categories.find(c => c.id === Number(selectedCategoryId));

            if (found) {
                return found;
            }
        }
        // потом из localStorage

        const savedId = localStorage.getItem(STORAGE_KEYS.ROOT_CATEGORY);

        if (savedId) {
            return categories.find(c => c.id === Number(savedId)) || null;
        }

        return null;
    });


    // Инициализация состояний из localStorage
    // const [selectedRootCategory, setSelectedRootCategory] = useState<Category | null>(() => {
    //     const savedId = localStorage.getItem(STORAGE_KEYS.ROOT_CATEGORY);

    //     if (savedId) {
    //         const found = categories.find(c => c.id === Number(savedId));

    //         if (found) {
    //             return found;
    //         }
    //     }

    //     return null;
    // });

    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | null>(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.SUB_CATEGORY);

        return saved ? Number(saved) : null;
    });

    const [priceMin, setPriceMin] = useState<number>(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.PRICE_MIN);

        return saved ? Number(saved) : 0;
    });

    const [priceMax, setPriceMax] = useState<number>(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.PRICE_MAX);

        return saved ? Number(saved) : 100000;
    });

    const [selectedAttributeFilters, setSelectedAttributeFilters] = useState<Map<number, Set<number>>>(() => {
        return loadAttributeFilters();
    });

    const isFirstRender = useRef(true);

    // Сохранение в localStorage
    useEffect(() => {
        if (isFirstRender.current) {
            return;
        }

        if (selectedRootCategory) {
            localStorage.setItem(STORAGE_KEYS.ROOT_CATEGORY, String(selectedRootCategory.id));
        } else {
            localStorage.removeItem(STORAGE_KEYS.ROOT_CATEGORY);
        }
    }, [selectedRootCategory]);

    useEffect(() => {
        if (isFirstRender.current) {
            return;
        }

        if (selectedSubcategoryId !== null) {
            localStorage.setItem(STORAGE_KEYS.SUB_CATEGORY, String(selectedSubcategoryId));
        } else {
            localStorage.removeItem(STORAGE_KEYS.SUB_CATEGORY);
        }
    }, [selectedSubcategoryId]);

    useEffect(() => {
        if (isFirstRender.current) {
            return;
        }

        localStorage.setItem(STORAGE_KEYS.PRICE_MIN, String(priceMin));
        localStorage.setItem(STORAGE_KEYS.PRICE_MAX, String(priceMax));
    }, [priceMin, priceMax]);

    useEffect(() => {
        if (isFirstRender.current) {
            return;
        }

        saveAttributeFilters(selectedAttributeFilters);
    }, [selectedAttributeFilters]);

    // const [selectedRootCategory, setSelectedRootCategory] = useState<Category | null>(null);
    // const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | null>(null);
    // const [priceMin, setPriceMin] = useState<number>(0);
    // const [priceMax, setPriceMax] = useState<number>(100000);
    // const [selectedAttributeFilters, setSelectedAttributeFilters] = useState<Map<number, Set<number>>>(new Map());

    const currentSubcategories = useMemo(() => {
        if (!selectedRootCategory) {
            return [];
        }

        return childrenMap.get(selectedRootCategory.id) || [];
    }, [selectedRootCategory, childrenMap]);

    const allowedCategoryIds = useMemo(() => {
        if (!selectedRootCategory) {
            return [];
        }

        if (selectedSubcategoryId !== null) {
            return getAllCategoryIds(selectedSubcategoryId, childrenMap);
        }

        return getAllCategoryIds(selectedRootCategory.id, childrenMap);
    }, [selectedRootCategory, selectedSubcategoryId, childrenMap]);

    const categoryProducts = useMemo(() => {
        if (allowedCategoryIds.length === 0) {
            return [];
        }

        return products.filter(p => allowedCategoryIds.includes(p.category_id));
    }, [allowedCategoryIds, products]);
    console.log('categoryProducts:', categoryProducts);
        console.log('first product attrs:', categoryProducts[0] ? getAttributeValues(categoryProducts[0]) : []);

    const availableAttributes = useMemo(() => {
        return getAvailableAttributeOptions(categoryProducts);
    }, [categoryProducts]);

    const priceBounds = useMemo(() => {
        if (categoryProducts.length === 0) {
            return { min: 0, max: 1000 };
        }

        const prices = categoryProducts.map(p => p.price);

        return { min: Math.min(...prices), max: Math.max(...prices) };
    }, [categoryProducts]);

    useEffect(() => {
        setPriceMin(priceBounds.min);
        setPriceMax(priceBounds.max);
        setSelectedAttributeFilters(new Map());
    }, [priceBounds.min, priceBounds.max, selectedRootCategory, selectedSubcategoryId]);

    const filteredProducts = useMemo(() => {
        if (allowedCategoryIds.length === 0) {
            return [];
        }

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

            if (currentSet.size === 0) {
                newMap.delete(attrId);
            } else{
                newMap.set(attrId, currentSet);
            }
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

    // Функция добавления в корзину (1 шт.)
    const handleAddToCart = (productId: number, productName: string) => {
        router.post(route('cart.store'), {
        product_id: productId,
        quantity: 1,
        }, {
        preserveScroll: true,
        onSuccess: () => {
            // Опционально: показать уведомление (можно через alert или временное сообщение)
            console.log(`${productName} добавлен в корзину`);
            // Если хотите временное всплывающее сообщение – реализуйте через состояние
        },
        onError: (errors) => {
            console.error('Ошибка добавления:', errors);
            alert('Не удалось добавить товар в корзину');
        }
        });
    };

    return (
        <>
        <Navbar />

        <Alert flash={flash} autoCloseDelay={5000} />

        <main className="container mx-auto! px-4! py-8! min-h-screen">
            {/* Грид родительских категорий */}
            <div className="mb-10!">
            <h2 className="text-2xl  mb-4! mt-4! font-[Gabriela]">Категории</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {roots.map(cat => (
                <div
                    key={cat.id}
                    onClick={() => handleRootCategoryClick(cat)}
                    className={`cursor-pointer rounded-lg border p-4! text-center transition-all hover:shadow-lg ${
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
                <aside className="w-full md:w-72 shrink-0 space-y-6">
                <div className="bg-white rounded-lg border p-4! mb-4!">
                    <h3 className="font-semibold text-lg mb-3!">Цена</h3>
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
                        className="w-24 border rounded px-2! py-1! text-sm"
                        />
                        <input
                        type="number"
                        value={priceMax}
                        onChange={(e) => setPriceMax(Number(e.target.value))}
                        className="w-24 border rounded px-2! py-1! text-sm"
                        />
                    </div>
                    </div>
                </div>
                    {availableAttributes.size === 0 ? (
                        <div className="bg-white rounded-lg border p-4!">
                            <p className="text-gray-500">Нет доступных фильтров</p>
                        </div>
                        ) : (
                        Array.from(availableAttributes.entries()).map(([attrId, { attribute, options }]) => (
                            <div key={attrId} className="bg-white rounded-lg border p-4!">
                            <h3 className="font-semibold text-lg mb-3!">{attribute.name}</h3>
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
                <div className="mb-6!">
                    <div className="flex flex-wrap gap-2 border-b pb-2!">
                    <button
                        onClick={() => handleSubcategoryClick(null)}
                        className={`px-3! py-1! rounded-full text-sm transition ${
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
                        className={`px-3! py-1! rounded-full text-sm transition ${
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
                    <div className="text-center py-12! text-gray-500">Товары не найдены</div>
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
                            <div className="product-info px-5! pt-4.5! pb-5.5!">
                                <div className="product-title text-xl font-semibold mb-2">
                                {product.name}
                                </div>
                                <div className="product-desc text-sm text-[#7c6957] mb-4! leading-relaxed">
                                {product.description}
                                </div>
                                <div className="price-row flex justify-between items-baseline mt-2!">
                                <div>
                                    <span className="price font-bold text-[1.4rem] text-[#b4632e]">
                                    {product.price} ₽
                                    </span>
                                </div>
                                <button
                                    className="btn-cart bg-[#f3ede7] border-none py-2! px-4! rounded-full font-medium cursor-pointer transition-colors duration-200 text-sm hover:bg-[#e7d9ce] hover:text-[#a35f34]"
                                    data-id={product.id}
                                    data-name={product.name}
                                    onClick={() => handleAddToCart(product.id, product.name)}
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
