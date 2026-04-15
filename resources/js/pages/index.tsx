import { Link, usePage, router } from "@inertiajs/react";
import React from "react";
import '../../css/index.css';
import { route } from "ziggy-js";
import Alert from '@/components/layout/alert';
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/Navbar";
import Subscribe from "@/components/subs/subscribe";
import type { Category } from '@/types/index';
import { asset } from '@/utils/helper';
import MainImg from '../../assets/img/mainImg.png';

interface PopularProduct {
    id: number;
    name: string;
    description: string;
    price: number;
    old_price?: number | null;
    image_url?: string | null;
}

interface IndexProps {
    categories: Category[];
    popularProducts: PopularProduct[];
}

export default function Index({ categories, popularProducts }: IndexProps) {
    const { flash } = usePage().props as { flash?: { success?: string; error?: string; info?: string }};

    const handleAddToCart = (productId: number, productName: string) => {
        router.post(route('cart.store'), {
            product_id: productId,
            quantity: 1,
        }, {
            preserveScroll: true,
            onSuccess: () => console.log(`${productName} добавлен в корзину`),
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
            <main>
                <section className="hero">
                    <div className="container hero-grid">
                        <div className="hero-text">
                            <h1>Где каждая деталь —<br /> на своем месте</h1>
                            <p>Уют начинается с деталей. Качественные, красивые и практичные вещи для дома и кухни.</p>
                            <Link href={route('catalog')}><button className="btn-primary" id="exploreBtn">Смотреть каталог</button></Link>
                        </div>
                        <div className="hero-image">
                            <img src={MainImg} alt="Теплый домашний декор" />
                        </div>
                    </div>
                </section>

                <div className="container">
                    {/* Категории товаров – 6 случайных родительских */}
                    <div className="section-title">Категории</div>
                    <div className="categories-grid" id="categoriesGrid">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={route('catalog', { category: category.id })} // передаём ID категории
                                className="category-card"
                            >
                                <div className="category-item">
                                    <div className="category-emoji">
                                        {category.img ? <img src={asset(category.img)} alt={category.name} /> : '📦'}
                                    </div>
                                    <h3>{category.name}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Популярные товары (без изменений) */}
                    <div className="section-title">Популярное</div>
                    <div className="products-grid" id="productsGrid">
                        {popularProducts.map((product) => (
                            <div key={product.id} className="product-card">
                                <Link href={route('products.show', product.id)}>
                                    <img
                                        className="product-img"
                                        src={asset(product.image_url ?? '')}
                                        alt={product.name}
                                    />
                                </Link>
                                <div className="product-info">
                                    <Link href={route('products.show', product.id)}>
                                        <div className="product-title">{product.name}</div>
                                    </Link>
                                    {/* <div className="product-desc">{product.description}</div> */}
                                    <div className="price-row">
                                        <div>
                                            <span className="price">{product.price.toLocaleString()} ₽</span>
                                            {product.old_price && (
                                                <div className="m-0 mt-2">
                                                    <span className="old-price mt-4">{product.old_price.toLocaleString()} ₽</span>
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            className="btn-cart add-to-cart"
                                            data-id={product.id}
                                            data-name={product.name}
                                            onClick={() => handleAddToCart(product.id, product.name)}
                                        >
                                            В корзину
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Subscribe />
                </div>
            </main>
            <Footer />
        </>
    );
}
