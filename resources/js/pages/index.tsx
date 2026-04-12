import { Link } from "@inertiajs/react";
import React from "react";
import '../../css/index.css';
import { route } from "ziggy-js";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/Navbar";
import Subscribe from "@/components/subs/subscribe";
import type { Category } from '@/types/index';
import MainImg from '../../assets/img/mainImg.png';




export default function Index({categories} : {categories: Category[]}) {

    return (
        <>
            {/* <Navbar categories={categories}></Navbar> */}
            <Navbar></Navbar>

            <main>
            {/* <!-- Hero --> */}
                <section className="hero">

                    <div className="container hero-grid">
                    <div className="hero-text">
                        <h1>Где каждая деталь —<br></br> на своем месте</h1>
                        <p>Уют начинается с деталей. Качественные, красивые и практичные вещи для дома и кухни.</p>
                        <Link href={route('catalog')}><button className="btn-primary" id="exploreBtn">Смотреть каталог</button></Link>
                    </div>
                    <div className="hero-image">
                        {/* <!-- уютная интерьерная картинка (svg-заглушка либо эмодзи-стиль, но используем реальное изображение из открытых источников? используем плейсхолдер но стильный) */}
                        {/* лучше data:image/svg? но для атмосферы вставим красивый svg с домом и текстилем --> */}
                        <img src={MainImg} alt="Теплый домашний декор"></img>
                    </div>
                    </div>
                </section>

                <div className="container">
                    {/* <!-- Категории товаров --> */}
                    <div className="section-title">Категории</div>
                    <div className="categories-grid" id="categoriesGrid">
                        {categories.map((element) => (
                            <div className="category-card ">
                                <div key={element.id} className="category-item">
                                    <div className="category-emoji">{element.img}</div>
                                    <h3>{element.name}</h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* <!-- Популярные товары --> */}
                    <div className="section-title">Популярное</div>
                    <div className="products-grid" id="productsGrid">
                        <div className="product-card">
                            <img className="product-img" src="" alt=""></img>
                            <div className="product-info">
                            <div className="product-title">.title</div>
                            <div className="product-desc">.desc</div>
                            <div className="price-row">
                                <div>
                                <span className="price">.price ₽</span>
                                <div className="m-0 mt-2">
                                    <span className="old-price mt-4">.oldPrice ₽</span>
                                </div>

                                </div>
                                <button className="btn-cart add-to-cart" data-id="" data-name="">В корзину</button>
                            </div>
                            </div>
                        </div>
                    </div>

                    <Subscribe></Subscribe>
                </div>
            </main>

            <Footer></Footer>
        </>
    );
}
