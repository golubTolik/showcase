import { Link } from "@inertiajs/react";
import { usePage } from '@inertiajs/react';
import {
  CreditCardIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react"
import React, { useState } from "react";
import { useEffect } from 'react';
import '../../../css/navbar.css';
import { route } from 'ziggy-js';
// import { useRoute } from 'ziggy-js';
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import Auth from "@/components/user/auth";
// import  {  route  }  from  '../../../../vendor/tightenco/ziggy';


import BookMarks from '../../../assets/icons/Bookmarks.svg';
import Logo from '../../../assets/icons/logo1.svg';
import ShoppingCart from '../../../assets/icons/ShoppingCart.svg';
import UserCircle from '../../../assets/icons/UserCircle.svg';
import ModalWindow from "../modal/modalWindow"
import Reg from "../user/reg";
// import { start } from "repl";

export default function Navbar() {
    // const route = useRoute();
    const { auth } = usePage().props;
    const isLoggedIn = !!auth.user;
    const { flash } = usePage<{ flash: { showModal?: boolean } }>().props;

    const [modalActive, setModalActive] = useState(false);

    useEffect(() => {
        if (flash.showModal !== undefined) {
            setModalActive(flash.showModal);
        }
    }, [flash.showModal]);

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
                    {/* <Link href={''}>Каталог</Link> */}
                    <HoverCard openDelay={10} closeDelay={100}>
                        <HoverCardTrigger asChild>
                            <Link href={''}>Каталог</Link>
                        </HoverCardTrigger>
                        <HoverCardContent className="z-200 flex w-64 flex-col gap-0.5" style={{ padding: "10px 10px", backgroundColor: "#fefaf5" }}>
                            <div className="font-semibold">@nextjs</div>
                            <div>The React Framework – created and maintained by @vercel.</div>
                            <div className="mt-1 text-xs text-muted-foreground">
                            Joined December 2021
                            </div>
                        </HoverCardContent>
                    </HoverCard>
                    <Link href={''}>О нас</Link>
                    <Link href={''}>Контакты</Link>
                </div>
                <div className="header-user">
                    <Link
                        href={isLoggedIn ? '/favorites' : ''}
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

                    {isLoggedIn
                    ?   <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="icon-btn text-[14px] font-[Gabriela]">
                                    <img src={UserCircle}></img>
                                    <p>
                                        {isLoggedIn ? auth.user.name : 'Войти'}
                                    </p>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="z-200" style={{ padding:"4px", backgroundColor: "#fefaf5"}}>
                                <DropdownMenuItem className="pl-1 pr-1" style={{ padding:"4px 6px"}}>
                                    <UserIcon />
                                    Профиль
                                </DropdownMenuItem>
                                <DropdownMenuItem style={{ padding:"4px 6px"}}>
                                    <CreditCardIcon />
                                    Billing
                                </DropdownMenuItem >
                                <DropdownMenuItem style={{ padding:"4px 6px"}}>
                                    <SettingsIcon />
                                    Settings
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        style={{ width:"100%"}}
                                    >
                                        <DropdownMenuItem variant="destructive" style={{ padding:"4px 6px"}}>
                                            <LogOutIcon />
                                            Выйти
                                        </DropdownMenuItem>
                                    </Link>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    :   <button className="icon-btn text-[14px] font-[Gabriela]" onClick={()=>setModalActive(true)}>
                            <img src={UserCircle}></img>
                            <p>
                                Войти
                            </p>
                        </button>
                    }

                    <ModalWindow active={modalActive} setActive={setModalActive}>
                        <div style={{ display: 'flex', gap: '20px', justifyContent: "center", alignItems: "start"}}>
                            <button className={formType == 'auth' ? "check-btn active" : "check-btn"} onClick={() => setFormType('auth')}>Вход</button>
                            <button className={formType == 'reg' ? "check-btn active" : "check-btn"} onClick={() => setFormType('reg')}>Регистрация</button>
                        </div>
                        {formType === 'auth' ? <Auth/> : <Reg/>}
                    </ModalWindow>
                </div>

            </div>
            </header>
        </>
    );
}
