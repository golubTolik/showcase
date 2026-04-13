import { useForm, router, usePage  } from '@inertiajs/react';
import { useState } from 'react';
import { route } from "ziggy-js";
import Alert from '@/components/layout/alert';
import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/Navbar';
import { asset } from '@/utils/helper';

// Типы
interface ProductImage {
    id: number;
    image_url: string;
    sort_order: number;
}

interface AttributeValue {
    id: number;
    value: string;
    attribute: {
        id: number;
        name: string;
    };
}

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    status: string;
    images: ProductImage[];
    product_attribute_values: {
        id: number;
        attribute_value: AttributeValue;
    }[];
}

interface ShowProps {
    product: Product;
    favoriteProductIds: number[];
}

export default function Show({ product, favoriteProductIds }: ShowProps) {
    const { flash } = usePage().props as { flash?: { success?: string; error?: string; info?: string }};

    const [selectedImage, setSelectedImage] = useState<string>(
        product.images[0]?.image_url || ''
    );
    //   const [isFavorite, setIsFavorite] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const [activeTab, setActiveTab] = useState<'characteristics' | 'description'>('characteristics');

    // Используем useForm, но будем обновлять поле quantity через setData
    const { post, processing, setData } = useForm({
        quantity: quantity,
        product_id: product.id,
    });

    // Общая функция изменения количества
    const handleQuantityChange = (newQuantity: number) => {
        setQuantity(newQuantity);
        setData('quantity', newQuantity); // синхронизируем форму
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        post(route('cart.store'), {
        preserveScroll: true,
        onSuccess: () => {
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 2000);
        },
        });
    };

    //   const toggleFavorite = () => {
    //     setIsFavorite(!isFavorite);
    //   };

    const attributes = product.product_attribute_values.map((pav) => pav.attribute_value);
    const quickAttributes = attributes.slice(0, 4);

        const [isFavorite, setIsFavorite] = useState(favoriteProductIds.includes(product.id));
        // const [favoriteId, setFavoriteId] = useState<number | null>(null);

        const toggleFavorite = () => {
            if (isFavorite) {
                router.delete(route('favorites.destroyByProduct', product.id), {
                    preserveScroll: true,
                    onSuccess: () => setIsFavorite(false),
                });
            } else {
                router.post(route('favorites.store'), { product_id: product.id }, {
                    preserveScroll: true,
                    onSuccess: () => setIsFavorite(true),
                });
            }
        };

    return (
        <>
        <Navbar />

        <Alert flash={flash} autoCloseDelay={5000} />

        <main className="container mx-auto! px-4! py-8! max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Левая колонка – галерея */}
            <div>
                <div className="mb-4! rounded-xl overflow-hidden bg-gray-100">
                <img
                    src={asset(selectedImage)}
                    alt={product.name}
                    className="w-full h-auto object-cover aspect-square"
                />
                </div>
                {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                    {product.images.map((img) => (
                    <button
                        key={img.id}
                        onClick={() => setSelectedImage(img.image_url)}
                        className={`shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                        selectedImage === img.image_url
                            ? 'border-[#b4632e]'
                            : 'border-transparent'
                        }`}
                    >
                        <img
                        src={asset(img.image_url)}
                        alt=""
                        className="w-full h-full object-cover"
                        />
                    </button>
                    ))}
                </div>
                )}
            </div>

            {/* Правая колонка – информация */}
                <div className=''>
                    {/* Строка: название + избранное */}
                    <div className="flex justify-between items-start mb-4!">
                        <h1 className="text-3xl font-bold">{product.name}</h1>
                        <button
                            onClick={toggleFavorite}
                            className={`flex cursor-pointer items-center gap-2 px-4! py-2! rounded-full border transition ${
                            isFavorite
                                ? 'bg-red-50 border-[#b4632e] text-[#b4632e]'
                                : 'bg-white border-gray-300 text-gray-700 hover:border-[#b4632e] hover:text-[#b4632e]'
                            }`}
                        >
                            <svg
                            className="w-5 h-5"
                            fill={isFavorite ? 'currentColor' : 'none'}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                            </svg>
                            {isFavorite ? 'В избранном' : 'В избранное'}
                        </button>
                    </div>

                    {/* Блок: цена, наличие, количество, корзина */}
                    <div className="bg-white shadow-md rounded-lg p-4! mb-6!">
                        <div className="flex items-baseline gap-4 mb-4!">
                            <span className="text-3xl font-bold text-[#b4632e]">
                            {product.price.toLocaleString()} ₽
                            </span>
                            <span
                            className={`text-sm ${
                                product.stock > 0 ? 'text-gray-500' : 'text-red-500'
                            }`}
                            >
                            {product.stock > 0 ? `В наличии (${product.stock} шт.)` : 'Нет в наличии'}
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                            <div className="flex border rounded-md">
                                <button
                                onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
                                className="px-3 py-1 border-r hover:bg-gray-100"
                                >
                                -
                                </button>
                                <span className="px-4! py-1! min-w-12 text-center">{quantity}</span>
                                <button
                                onClick={() => handleQuantityChange(Math.min(product.stock, quantity + 1))}
                                className="px-3 py-1 border-l hover:bg-gray-100"
                                disabled={quantity >= product.stock}
                                >
                                +
                                </button>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                disabled={processing || product.stock === 0}
                                className="bg-[#b4632e] text-white px-6! py-2! rounded-md hover:bg-[#9a4f24] transition disabled:bg-gray-400"
                            >
                                {processing ? 'Добавление...' : 'В корзину'}
                            </button>
                            </div>
                        </div>
                        {addedToCart && (
                            <div className="text-green-600 text-sm mt-2!">✓ Товар добавлен в корзину</div>
                        )}
                    </div>

                    {/* Быстрые характеристики (первые 4) */}
                    {quickAttributes.length > 0 && (
                    <div className="border-t pt-4! mt-4!">
                        <h3 className="font-medium text-gray-700 mb-2!">Краткие характеристики</h3>
                        <div className="grid grid-cols-1 gap-y-1 text-sm">
                        {quickAttributes.map((attr) => (
                            <div key={attr.id} className="flex justify-between">
                                <span className="text-gray-500">{attr.attribute.name}:</span>
                                <span className="border-b border-gray-200 w-full"></span>
                                <span className="font-medium">{attr.value}</span>
                            </div>
                        ))}
                        </div>
                    </div>
                    )}
                </div>
            </div>

            {/* Вкладки с полными характеристиками и описанием */}
            <div className="mt-12! pt-6!">
            <div className="flex gap-6 border-b mb-4!">
                <button
                onClick={() => setActiveTab('characteristics')}
                className={`pb-2! text-lg font-medium transition ${
                    activeTab === 'characteristics'
                    ? 'text-[#b4632e] border-b-2 border-[#b4632e]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                >
                Характеристики
                </button>
                {product.description && (
                <button
                    onClick={() => setActiveTab('description')}
                    className={`pb-2! text-lg font-medium transition ${
                    activeTab === 'description'
                        ? 'text-[#b4632e] border-b-2 border-[#b4632e]'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Описание
                </button>
                )}
            </div>

            {activeTab === 'characteristics' && attributes.length > 0 && (
                <div className="rounded-lg p-6!">
                <table className="w-full text-sm">
                    <tbody>
                    {attributes.map((attr) => (
                        <tr key={attr.id} className="border-b last:border-0">
                        <td className="py-3! font-medium w-1/3 text-gray-600">
                            {attr.attribute.name}
                        </td>
                        <td className="py-3! text-gray-800">{attr.value}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            )}

            {activeTab === 'description' && product.description && (
                <div className="p-6! prose max-w-none text-gray-700">
                {product.description}
                </div>
            )}
            </div>
        </main>
        <Footer />
        </>
    );
}
