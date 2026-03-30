import { Link } from "@inertiajs/react";
import React from "react";
import '../../../css/navbar.css';

import BookMarks from '../../../assets/icons/Bookmarks.svg';
import Logo from '../../../assets/icons/logo1.svg';
import ShoppingCart from '../../../assets/icons/ShoppingCart.svg';
import UserCircle from '../../../assets/icons/UserCircle.svg';

export default function Navbar() {
    return (
        <>
            <header className="header">
            <div className="container header-inner">
                <div className="logo">
                    <img src={Logo}></img>
                        Рукотворье
                    <span></span>
                </div>
                <div className="nav-links">
                    <a href="#">Главная</a>
                    <a href="#">Каталог</a>
                    <a href="#">О нас</a>
                    <a href="#">Контакты</a>
                </div>
                <div className="header-user">
                    <button className="user-btn">Вход</button>
                    <button className="icon-btn"><img src={BookMarks}></img></button>
                    <button className="icon-btn"><img src={ShoppingCart}></img></button>
                    <button className="icon-btn"><img src={UserCircle}></img></button>
                </div>
            </div>
            </header>
        </>
    );
}
