import { Input } from "@/components/ui/input";
import Link from "next/link";
import { NavLink } from "../NavLink";
import { BlogFilter } from "@/app/(marketing)/blog/components/BlogFilter";

type Props = {
  title?: string;
};

export default function NavBar({ title = "Home" }: Props) {
  return (
    <nav className="flex px-5 items-center justify-between gap-4 font-sans bg-accent py-5">
      {title && <Link href="/">{title}</Link>}

      <BlogFilter placeholder="Szukaj" className="h-8 w-44" />

      <div className="flex items-center gap-3">
        <NavLink href="/products">Sklep</NavLink>
        <NavLink href="/blog">Blog</NavLink>
        <NavLink href="/about">O nas</NavLink>
        <NavLink href="/contact">Kontakt</NavLink>
      </div>
    </nav>
  );
}
