import { Link } from "@inertiajs/react";
import React from "react";
import '../../../css/footer.css';
import Logo from '../../../assets/icons/logo1_light.svg'

export default function Footer() {
    return (
        <>
            <footer className="footer">
            <div className="container">
                <div className="footer-inner">
                <div className="footer-col">
                    <div className="logo">
                        <img src={Logo}></img>
                        <span className="logo-text">Рукотворье</span>
                    </div>
                    <p>Интернет‑витрина товаров для дома: текстиль, декор, посуда и уютные мелочи, которые делают пространство по‑настоящему вашим.</p>
                </div>
                <div className="footer-col">
                    <h4>Покупателям</h4>
                    <ul>
                        <Link ><li><a href="#">Доставка и оплата</a></li></Link>
                        <Link><li><a href="#">Возврат</a></li></Link>
                        <Link><li><a href="#">Оптовикам</a></li></Link>
                        <Link><li><a href="#">Подарочные сертификаты</a></li></Link>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>О компании</h4>
                    <ul>
                        <Link><li><a href="#">О нас</a></li></Link>
                        <Link><li><a href="#">Контакты</a></li></Link>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>Контакты</h4>
                    <ul>
                    <li>+7(999)123-45-67</li>
                    <li>rychki@mail.ru</li>
                    <li>Адрес....</li>
                    </ul>
                </div>
                </div>
                <div className="copyright">
                © 2026 Рукотворье. Интернет‑витрина товаров для дома и кухни.
                </div>
            </div>
            </footer>
        </>
    );
}
