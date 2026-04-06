import { Link } from "@inertiajs/react";
import LogoIcon from '../../../../assets/icons/logo1.svg';

export const Logo = () => (
  <div className="logo">
    <Link href="/" className="flex items-center">
      <img src={LogoIcon} alt="Logo" />
      Рукотворье
    </Link>
  </div>
);
