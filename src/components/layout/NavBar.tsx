import { Input } from "@/components/ui/input";
import Link from "next/link";

type Props = {
  title?: string;
};

export default function NavBar({ title = "" }: Props) {
  return (
    <nav className="flex px-5 items-center justify-between gap-4 font-sans bg-accent py-5">
      {title && <a href="/">{title}</a>}

      <Input
        type="search"
        placeholder="Szukaj"
        aria-label="Szukaj wspisów"
        className="h-8 w-44"
      />

      <div className="flex items-center gap-3">
        <Link href="/shop">Sklep</Link>
        <Link href="/blog">Blog</Link>
        <Link href="/about">O nas</Link>
        <Link href="/contact">Kontakt</Link>
      </div>
    </nav>
  );
}
