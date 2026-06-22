import { Link } from "@inertiajs/react";
import {
    CreditCardIcon,
    LogOutIcon,
    SettingsIcon,
    UserIcon,
} from "lucide-react";

import { route } from "ziggy-js";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import BookMarks from "../../../../assets/icons/Bookmarks.svg";
import ShoppingCart from "../../../../assets/icons/ShoppingCart.svg";
import UserCircle from "../../../../assets/icons/UserCircle.svg";

interface UserActionsProps {
    isLoggedIn: boolean;
    user?: {
        name: string;
        role: string;
    };
    onLoginClick: () => void;

    mobile?: boolean;
    onItemClick?: () => void;
}

const MobileUserActions = ({
    isLoggedIn,
    user,
    onLoginClick,
    onItemClick,
}: UserActionsProps) => (
    <div className="flex flex-col">

        <Link
            href={isLoggedIn ? "/favorites" : ""}
            onClick={(e) => {
                if (!isLoggedIn) {
                    e.preventDefault();
                    onLoginClick();
                }
                
                onItemClick?.();
            }}
            className="mobile-link"
        >
            <img src={BookMarks} />
            Избранное
        </Link>

        <Link
            href={route("cart.index")}
            className="mobile-link"
            onClick={onItemClick}
        >
            <img src={ShoppingCart} />
            Корзина
        </Link>

        {isLoggedIn && user ? (
            <>
                <Link
                    href={route("profile.edit")}
                    className="mobile-link"
                    onClick={onItemClick}
                >
                    <UserIcon size={18} />
                    Профиль
                </Link>

                <Link
                    href={route("orders.index")}
                    className="mobile-link"
                    onClick={onItemClick}
                >
                    <CreditCardIcon size={18} />
                    Заказы
                </Link>

                {user.role === "admin" && (
                    <Link
                        href={route("admin.orders.index")}
                        className="mobile-link"
                        onClick={onItemClick}
                    >
                        <SettingsIcon size={18} />
                        Админ-панель
                    </Link>
                )}

                <Link
                    href={route("logout")}
                    method="post"
                    as="button"
                    className="mobile-link"
                >
                    <LogOutIcon size={18} />
                    Выйти
                </Link>
            </>
        ) : (
            <button
                className="mobile-link"
                onClick={() => {
                    onLoginClick();
                    onItemClick?.();
                }}
            >
                <img src={UserCircle} />
                Войти
            </button>
        )}
    </div>
);

const DesktopUserActions = ({
    isLoggedIn,
    user,
    onLoginClick,
}: UserActionsProps) => (
    <div className="header-user">

        <Link
            href={isLoggedIn ? "/favorites" : ""}
            onClick={(e) =>
                !isLoggedIn &&
                e.preventDefault()
            }
        >
            <button
                className={`icon-btn text-[14px] font-[Gabriela]
                ${
                    !isLoggedIn
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                }`}
            >
                <img src={BookMarks} />
                <p>Избранное</p>
            </button>
        </Link>

        <Link href={route("cart.index")}>
            <button className="icon-btn text-[14px] font-[Gabriela]">
                <img src={ShoppingCart} />
                <p>Корзина</p>
            </button>
        </Link>

        {isLoggedIn && user ? (
            <DropdownMenu>

                <DropdownMenuTrigger asChild>
                    <button className="icon-btn text-[14px] font-[Gabriela]">
                        <img src={UserCircle} />
                        <p>{user.name}</p>
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    style={{
                        background: "#fefaf5",
                    }}
                >

                    <DropdownMenuItem>
                        <Link
                            href={route("profile.edit")}
                            className="flex items-center gap-2 w-full"
                        >
                            <UserIcon /> Профиль
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                        <Link
                            href={route("orders.index")}
                            className="flex items-center gap-2 w-full"
                        >
                            <CreditCardIcon /> Заказы
                        </Link>
                    </DropdownMenuItem>

                    {user.role === "admin" && (
                        <DropdownMenuItem>
                            <Link
                                href={route("admin.orders.index")}
                                className="flex items-center gap-2 w-full"
                            >
                                <SettingsIcon /> Админ-панель
                            </Link>
                        </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />

                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        style={{ width: "100%" }}
                    >
                        <DropdownMenuItem>
                            <LogOutIcon /> Выйти
                        </DropdownMenuItem>
                    </Link>

                </DropdownMenuContent>

            </DropdownMenu>
        ) : (
            <button
                className="icon-btn"
                onClick={onLoginClick}
            >
                <img src={UserCircle} />
                <p>Войти</p>
            </button>
        )}

    </div>
);

export const UserActions = (
    props: UserActionsProps
) =>
    props.mobile
        ? <MobileUserActions {...props} />
        : <DesktopUserActions {...props} />;
