import { Link } from "@inertiajs/react";
import { usePage } from '@inertiajs/react';
import React, { useState } from "react";
import '../../../css/navbar.css';
import Auth from "@/components/user/auth";
import BookMarks from '../../../assets/icons/Bookmarks.svg';
import Logo from '../../../assets/icons/logo1.svg';
import ShoppingCart from '../../../assets/icons/ShoppingCart.svg';
import UserCircle from '../../../assets/icons/UserCircle.svg';
import ModalWindow from "../modal/modalWindow"
import Reg from "../user/reg";

export default function Navbar() {
    const { auth } = usePage().props;
    const isLoggedIn = !!auth.user;

    const [modalActive, setModalActive] = useState(false);
    const [formType, setFormType] = useState('auth');

    return (
        <>
            <header className="header">
            <div className="container header-inner">
                <div className="logo">
                    <Link href={'/'} className="flex items-center">
                        <img src={Logo}></img>
                        Рукотворье
                    </Link>
                </div>
                <div className="nav-links">
                    <Link href={'/'}>Главная</Link>
                    <Link href={''}>Каталог</Link>
                    <Link href={''}>О нас</Link>
                    <Link href={''}>Контакты</Link>
                </div>
                <div className="header-user">
                    <Link
                        href={isLoggedIn ? '/favorites' : '#'}
                        onClick={(e) => !isLoggedIn && e.preventDefault()}
                        >
                        <button
                            className={`icon-btn text-[14px] font-[Gabriela] flex items-center  ${
                                !isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={!isLoggedIn}
                        >
                            <img src={BookMarks} alt="Bookmarks" className="w-4 h-4" />
                            <p>Избранное</p>
                        </button>
                    </Link>
                    <Link href={''}><button className="icon-btn text-[14px] font-[Gabriela]"><img src={ShoppingCart}></img><p>Корзина</p></button></Link>
                    <Link href={''}><button className="icon-btn text-[14px] font-[Gabriela]"><img src={UserCircle}></img><p>Войти</p></button></Link>
                    <button onClick={()=>setModalActive(true)}>Open</button>
                    <ModalWindow active={modalActive} setActive={setModalActive}>
                        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', justifyContent: "center" }}>
                            <button className={formType == 'auth' ? "check-btn active" : "check-btn"} onClick={() => setFormType('auth')}>Вход</button>
                            <button className={formType == 'reg' ? "check-btn active" : "check-btn"} onClick={() => setFormType('reg')}>Регистрация</button>
                        </div>
                        {formType === 'auth' ? <Auth /> : <Reg />}
                    </ModalWindow>
                </div>

            </div>
            </header>
        </>
    );
}
