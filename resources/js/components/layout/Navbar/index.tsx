import { usePage } from "@inertiajs/react";
import { useState } from "react";

import { AuthModal } from "./AuthModal";
import { Logo } from "./Logo";
import { NavLinks } from "./NavLinks";
import { UserActions } from "./UserActions";

import '../../../../css/navbar.css';

export default function Navbar() {
    const { auth, flash } = usePage<{
        auth: { user: any },
        flash: { showModal?: boolean }
    }>().props;

    const isLoggedIn = !!auth.user;

    const [modalActive, setModalActive] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <header className="header">
                <div className="container header-inner">

                    <div className="header-left">
                        <Logo />
                    </div>

                    {/* CENTER NAV */}
                    <div className="header-center">
                        <NavLinks />
                    </div>

                    {/* RIGHT ACTIONS */}
                    <div className="header-right">

                        <UserActions
                            isLoggedIn={isLoggedIn}
                            user={auth.user}
                            onLoginClick={() => setModalActive(true)}
                        />

                        {/* Burger */}
                        <button
                            className={`burger ${menuOpen ? 'active' : ''}`}
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>

                    </div>
                </div>
            </header>

            {/* Mobile menu */}
            <div className={`mobile-menu ${menuOpen ? 'active' : ''}`}>

                {/* CLOSE BUTTON */}
                <button
                    className="mobile-close"
                    onClick={() => setMenuOpen(false)}
                >
                    ✕
                </button>

                <div className="mobile-menu-content">

                    <NavLinks />

                    {/* <UserActions
                        isLoggedIn={isLoggedIn}
                        user={auth.user}
                        onLoginClick={() => {
                            setModalActive(true);
                            setMenuOpen(false);
                        }}
                    /> */}
                    <UserActions
                        mobile
                        isLoggedIn={isLoggedIn}
                        user={auth.user}
                        onLoginClick={() => {
                            setModalActive(true);
                        }}
                        onItemClick={() => {
                            setMenuOpen(false);
                        }}
                    />

                </div>
            </div>

            {/* Overlay */}
            <div
                className={`mobile-overlay ${menuOpen ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
            />

            <AuthModal
                active={modalActive}
                setActive={setModalActive}
                flashShowModal={flash.showModal}
            />
        </>
    );
}
