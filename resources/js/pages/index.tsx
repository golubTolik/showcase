import { Link } from "@inertiajs/react";
import React from "react";
import '../../css/index.css';
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import MainImg from '../../assets/img/mainImg.png';


export default function Index() {
    return (
        <>
           <Navbar></Navbar>

            <main>
            {/* <!-- Hero --> */}
            <section className="hero">
                <div className="container hero-grid">
                <div className="hero-text">
                    <h1>Где каждая деталь —<br></br> на своем месте</h1>
                    <p>Уют начинается с деталей. Качественные, красивые и практичные вещи для дома и кухни.</p>
                    <button className="btn-primary" id="exploreBtn">Смотреть каталог</button>
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
                    <div className="category-card">
                        <div className="category-emoji">emoji</div>
                        <h3>cat.name</h3>
                    </div>
                    <div className="category-card">
                        <div className="category-emoji">emoji</div>
                        <h3>cat.name</h3>
                    </div>
                    <div className="category-card">
                        <div className="category-emoji">emoji</div>
                        <h3>cat.name</h3>
                    </div>
                    <div className="category-card">
                        <div className="category-emoji">emoji</div>
                        <h3>cat.name</h3>
                    </div>
                    <div className="category-card">
                        <div className="category-emoji">emoji</div>
                        <h3>cat.name</h3>
                    </div>
                    <div className="category-card">
                        <div className="category-emoji">emoji</div>
                        <h3>cat.name</h3>
                    </div>
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
                {/* Подписка  */}
                <div className="section-title">Подписка</div>
                <div className="subscribe">
                    <div className="subscribe-grid">
                        <div className="text-zone">
                            <h1>Подпишитесь и получите подарок</h1>
                            <p>Скидка 10% на первый заказ и наша подборка «5 простых способов сделать дом уютнее» — бесплатно для новых подписчиков.</p>
                        </div>
                        <div className="input-zone">
                            <input type="email" placeholder="Ваш E-mail" className="input-main"></input>
                            <label>
                                <input type="checkbox" className="input-rule"></input>
                                <span>Я согласен на обработку персональных данных</span>
                            </label>
                             <div>
                                <button>Подписаться</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            </main>

            <Footer></Footer>
        </>
    );
}
