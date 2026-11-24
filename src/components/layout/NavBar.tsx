import Link from "next/link";
import { NavLink } from "../NavLink";
import { PropsWithChildren } from "react";
import { ModeToggle } from "../mode-toggle";
import { CartBadge } from "../CartBadge";

export default function NavBar({
  title = "Home",
  children,
}: PropsWithChildren<{ title?: string }>) {
  return (
    <nav className="flex px-5 items-center justify-between gap-4 font-sans bg-accent py-5">
      {title && <Link href="/">{title}</Link>}

      {children}

      <div className="flex items-center gap-3">
        <NavLink href="/catalog">Sklep</NavLink>
        <NavLink href="/blog">Blog</NavLink>
        <NavLink href="/about">O nas</NavLink>
        <NavLink href="/contact">Kontakt</NavLink>
      </div>

      <div className="flex items-center gap-3">
        {/* <ModeToggle /> */}
        <CartBadge />
        <Link href="/account/orders" className="rounded-md px-3 py-1.5">
          Konto
        </Link>
        <Link href="/login" className="rounded-md px-3 py-1.5">
          Zaloguj
        </Link>
      </div>
    </nav>
  );
}
