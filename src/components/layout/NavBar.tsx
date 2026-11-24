import { Input } from "@/components/ui/input";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavLink } from "../NavLink";

type Props = {
  title?: string;
};

export default function NavBar({ title = "Home" }: Props) {
  return (
    <nav className="flex px-5 items-center justify-between gap-4 font-sans bg-accent py-5">
      {title && <Link href="/">{title}</Link>}

      <Input
        type="search"
        placeholder="Szukaj"
        aria-label="Szukaj wspisów"
        className="h-8 w-44"
      />

      <div className="flex items-center gap-3">
        <NavLink href="/products">Sklep</NavLink>
        <NavLink href="/blog">Blog</NavLink>
        <NavLink href="/about">O nas</NavLink>
        <NavLink href="/contact">Kontakt</NavLink>
      </div>
    </nav>
  );
}
