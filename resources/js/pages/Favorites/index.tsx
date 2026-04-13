import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { route } from "ziggy-js";
import Alert from '@/components/layout/alert';
import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/Navbar';
import { asset } from '@/utils/helper';

interface FavoriteItem {
    id: number;
    product_id: number;
    name: string;
    price: number;
    image: string | null;
    description: string;
}

interface Props {
    favorites: FavoriteItem[];
}

export default function FavoritesIndex({ favorites }: Props) {
    const { flash } = usePage().props as { flash?: { success?: string; error?: string; info?: string }};

    const [items, setItems] = useState(favorites);
    const [removingId, setRemovingId] = useState<number | null>(null);

    const removeFromFavorites = (favoriteId: number) => {
        setRemovingId(favoriteId);
        router.delete(route('favorites.destroy', { favorite: favoriteId }), {
            preserveScroll: true,
            onSuccess: () => {
                setItems(prev => prev.filter(item => item.id !== favoriteId));
                setRemovingId(null);
            },
            onError: () => setRemovingId(null),
        });
    };

    const addToCart = (productId: number, productName: string) => {
        router.post(route('cart.store'), {
            product_id: productId,
            quantity: 1,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                alert(`${productName} добавлен в корзину`);
            },
            onError: () => alert('Ошибка добавления в корзину'),
        });
    };

    return (
        <>
            <Navbar />

            <Alert flash={flash} autoCloseDelay={5000} />

            <main className="container mx-auto! px-4! py-8! max-w-6xl min-h-[100vh]">
                <h1 className="text-2xl mb-6! font-[Gabriela]">Избранное</h1>

                {items.length === 0 ? (
                    <div className="text-center py-12!">
                        <p className="text-gray-500 mb-4!">В избранном пока нет товаров</p>
                        <Link href={route('catalog')} className="text-[#b4632e] hover:underline">
                            Перейти в каталог
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="product-card bg-white rounded-3xl overflow-hidden transition-all duration-200 shadow-[0_8px_18px_rgba(0,0,0,0.03)] border border-[#f1e3d7] hover:-translate-y-1 hover:shadow-[0_20px_30px_-12px_rgba(82,45,18,0.12)] hover:border-[#e2cfbe] relative"
                            >
                                {/* Кнопка удаления из избранного (крестик) */}
                                <button
                                    onClick={() => removeFromFavorites(item.id)}
                                    disabled={removingId === item.id}
                                    className="cursor-pointer absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-[#b4632e] text-[#b4632e] flex items-center justify-center hover:bg-red-300 transition disabled:opacity-50"
                                    aria-label="Удалить из избранного"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill={'currentColor'}
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
                                </button>

                                <div className="product-img-wrapper w-full aspect-square bg-[#faf0e6] flex items-center justify-center overflow-hidden">
                                    <Link href={route('products.show', { product: item.product_id })}>
                                        {item.image ? (
                                            <img
                                                src={asset(item.image)}
                                                alt={item.name}
                                                className="product-img w-full h-full object-cover block"
                                            />
                                        ) : (
                                            <div className="product-img-placeholder text-[#aa8e76] text-sm text-center p-4! bg-[#faf0e6] w-full h-full flex items-center justify-center">
                                                🖼️ {item.name}
                                            </div>
                                        )}
                                    </Link>
                                </div>

                                <div className="product-info !px-5 pt-[18px] pb-[22px]">
                                    <Link href={route('products.show', { product: item.product_id })}>
                                        <div className="product-title text-xl font-semibold mb-2">
                                            {item.name}
                                        </div>
                                    </Link>

                                        <div className="product-desc text-sm text-[#7c6957] !mb-4 leading-relaxed">
                                            {item.description}
                                        </div>

                                    <div className="price-row flex justify-between items-baseline !mt-2">
                                        <div>
                                            <span className="price font-bold text-[1.4rem] text-[#b4632e]">
                                                {item.price.toLocaleString()} ₽
                                            </span>
                                        </div>
                                        <button
                                            className="btn-cart bg-[#f3ede7] border-none py-2! px-4! rounded-full font-medium cursor-pointer transition-colors duration-200 text-sm hover:bg-[#e7d9ce] hover:text-[#a35f34]"
                                            data-id={item.product_id}
                                            data-name={item.name}
                                            onClick={() => addToCart(item.product_id, item.name)}
                                        >
                                            В корзину
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}
