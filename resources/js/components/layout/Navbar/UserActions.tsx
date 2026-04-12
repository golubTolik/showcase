import { Link } from "@inertiajs/react";
import { CreditCardIcon, LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";
import { route } from "ziggy-js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import BookMarks from '../../../../assets/icons/Bookmarks.svg';
import ShoppingCart from '../../../../assets/icons/ShoppingCart.svg';
import UserCircle from '../../../../assets/icons/UserCircle.svg';

interface UserActionsProps {
  isLoggedIn: boolean;
  user?: { name: string };
  onLoginClick: () => void;
}

const UserProfileDropdown = ({ user }: { user: { name: string } }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button className="icon-btn text-[14px] font-[Gabriela]">
        <img src={UserCircle} alt="User" />
        <p>{user.name}</p>
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="z-200" style={{ padding: "4px", backgroundColor: "#fefaf5" }}>
      <DropdownMenuItem className="pl-1 pr-1" style={{ padding: "4px 6px" }}>
        <UserIcon /> Профиль
      </DropdownMenuItem>
      <DropdownMenuItem style={{ padding: "4px 6px" }}>
        <CreditCardIcon /> Billing
      </DropdownMenuItem>
      <DropdownMenuItem style={{ padding: "4px 6px" }}>
        <SettingsIcon /> Settings
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <Link href={route('logout')} method="post" as="button" style={{ width: "100%" }}>
        <DropdownMenuItem variant="destructive" style={{ padding: "4px 6px" }}>
          <LogOutIcon /> Выйти
        </DropdownMenuItem>
      </Link>
    </DropdownMenuContent>
  </DropdownMenu>
);

export const UserActions = ({ isLoggedIn, user, onLoginClick }: UserActionsProps) => (
  <div className="header-user">
    {/* Избранное */}
    <Link href={isLoggedIn ? '/favorites' : ''} onClick={(e) => !isLoggedIn && e.preventDefault()}>
      <button className={`icon-btn text-[14px] font-[Gabriela] flex items-center ${!isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!isLoggedIn}>
        <img src={BookMarks} alt="Bookmarks" className="w-4 h-4" />
        <p>Избранное</p>
      </button>
    </Link>

    {/* Корзина */}
    <Link href={route('cart.index')}>
      <button className="icon-btn text-[14px] font-[Gabriela]">
        <img src={ShoppingCart} alt="Cart" />
        <p>Корзина</p>
      </button>
    </Link>

    {/* Вход / Профиль */}
    {isLoggedIn && user ? (
      <UserProfileDropdown user={user} />
        ) : (
        <button className="icon-btn text-[14px] font-[Gabriela]" onClick={onLoginClick}>
            <img src={UserCircle} alt="Login" />
            <p>Войти</p>
        </button>
    )}
  </div>
);
