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

        <main className="container mx-auto! px-4! py-6! md:py-8 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

                {/* Галерея */}
                <div>
                    <div className="mb-3! md:mb-4! rounded-xl overflow-hidden bg-gray-100">
                        <img
                            src={asset(selectedImage)}
                            alt={product.name}
                            className="w-full aspect-square object-cover"
                        />
                    </div>

                    {product.images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-1!">
                            {product.images.map((img) => (
                                <button
                                    key={img.id}
                                    onClick={() => setSelectedImage(img.image_url)}
                                    className={`
                                        shrink-0
                                        w-16 h-16
                                        md:w-20 md:h-20
                                        rounded-md
                                        overflow-hidden
                                        border-2
                                        ${
                                            selectedImage === img.image_url
                                                ? 'border-[#b4632e]'
                                                : 'border-transparent'
                                        }
                                    `}
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

                {/* Информация */}
                <div>

                    {/* Название */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-5!">

                        <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                            {product.name}
                        </h1>

                        <button
                            onClick={toggleFavorite}
                            className={`
                                w-full sm:w-auto
                                flex justify-center items-center gap-2
                                px-4! py-2!
                                rounded-full border
                                transition
                                ${
                                    isFavorite
                                        ? 'bg-red-50 border-[#b4632e] text-[#b4632e]'
                                        : 'bg-white border-gray-300 hover:border-[#b4632e]'
                                }
                            `}
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

                            {isFavorite
                                ? 'В избранном'
                                : 'В избранное'}
                        </button>
                    </div>

                    {/* Цена */}
                    <div className="bg-white shadow rounded-xl p-4! md:p-6! mb-6!">

                        <div className="flex flex-col sm:flex-row sm:items-end gap-2 mb-5!">
                            <span className="text-3xl md:text-4xl font-bold text-[#b4632e]">
                                {product.price.toLocaleString()} ₽
                            </span>

                            <span
                                className={`
                                    text-sm
                                    ${
                                        product.stock > 0
                                            ? 'text-gray-500'
                                            : 'text-red-500'
                                    }
                                `}
                            >
                                {product.stock > 0
                                    ? `В наличии (${product.stock} шт.)`
                                    : 'Нет в наличии'}
                            </span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">

                            <div className="flex border rounded-md w-fit">

                                <button
                                    onClick={() =>
                                        handleQuantityChange(
                                            Math.max(1, quantity - 1)
                                        )
                                    }
                                    className="px-4! py-2!"
                                >
                                    −
                                </button>

                                <span className="min-w-14 text-center py-2!">
                                    {quantity}
                                </span>

                                <button
                                    onClick={() =>
                                        handleQuantityChange(
                                            Math.min(
                                                product.stock,
                                                quantity + 1
                                            )
                                        )
                                    }
                                    disabled={quantity >= product.stock}
                                    className="px-4! py-2!"
                                >
                                    +
                                </button>

                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={processing || product.stock === 0}
                                className="
                                    w-full sm:w-auto
                                    px-6! py-3!
                                    rounded-md
                                    bg-[#b4632e]
                                    text-white
                                    disabled:bg-gray-400
                                "
                            >
                                {processing
                                    ? 'Добавление...'
                                    : 'В корзину'}
                            </button>

                        </div>

                        {addedToCart && (
                            <div className="mt-3! text-sm text-green-600">
                                ✓ Товар добавлен
                            </div>
                        )}

                    </div>

                    {/* Характеристики */}
                    {quickAttributes.length > 0 && (
                        <div className="border-t pt-4">

                            <h3 className="mb-3! font-medium">
                                Краткие характеристики
                            </h3>

                            <div className="space-y-3">

                                {quickAttributes.map((attr) => (
                                    <div
                                        key={attr.id}
                                        className="
                                            flex
                                            flex-col
                                            sm:flex-row
                                            sm:justify-between
                                            gap-1
                                        "
                                    >
                                        <span className="text-gray-500">
                                            {attr.attribute.name}
                                        </span>

                                        <span className="font-medium">
                                            {attr.value}
                                        </span>

                                    </div>
                                ))}

                            </div>

                        </div>
                    )}

                </div>
            </div>

            {/* Табы */}
            <div className="mt-10!">

                <div className="flex overflow-x-auto gap-6 border-b">

                    <button
                        onClick={() =>
                            setActiveTab('characteristics')
                        }
                        className={`pb-3! whitespace-nowrap ${ activeTab === 'characteristics' ? 'text-[#b4632e] border-b-2 border-[#b4632e]' : 'text-gray-500 hover:text-gray-700' }`}
                    >
                        Характеристики
                    </button>

                    {product.description && (
                        <button
                            onClick={() =>
                                setActiveTab('description')
                            }
                            className={`pb-3! whitespace-nowrap ${ activeTab === 'description' ? 'text-[#b4632e] border-b-2 border-[#b4632e]' : 'text-gray-500 hover:text-gray-700' }`}
                        >
                            Описание
                        </button>
                    )}

                </div>

                {activeTab === 'characteristics' && (
                    <div className="overflow-x-auto">

                        <table className="w-full min-w-125 text-sm">

                            <tbody>
                                {attributes.map((attr) => (
                                    <tr key={attr.id}>
                                        <td className="py-3! w-1/3">
                                            {attr.attribute.name}
                                        </td>

                                        <td>
                                            {attr.value}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>

                    </div>
                )}

                {activeTab === 'description' && (
                    <div className="prose max-w-none py-6!">
                        {product.description}
                    </div>
                )}

            </div>
        </main>
        <Footer />
        </>
    );
}
