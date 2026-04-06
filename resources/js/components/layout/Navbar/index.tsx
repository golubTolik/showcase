import { usePage } from "@inertiajs/react";
import { useState } from "react";
import type { Category } from "@/types/index";
import { AuthModal } from "./AuthModal";
import { Logo } from "./Logo";
import { NavLinks } from "./NavLinks";
import { UserActions } from "./UserActions";

import '../../../../css/navbar.css';

interface NavbarProps {
  categories: Category[];
}

export default function Navbar({ categories }: NavbarProps) {
  const { auth, flash } = usePage<{ auth: { user: any }, flash: { showModal?: boolean } }>().props;
  const isLoggedIn = !!auth.user;
  const [modalActive, setModalActive] = useState(false);

  return (
    <header className="header">
      <div className="container header-inner">
        <Logo />
        <NavLinks categories={categories} />
        <UserActions
          isLoggedIn={isLoggedIn}
          user={auth.user}
          onLoginClick={() => setModalActive(true)}
        />
      </div>
      <AuthModal
        active={modalActive}
        setActive={setModalActive}
        flashShowModal={flash.showModal}
      />
    </header>
  );
}
