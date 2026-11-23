"use client";

import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  useRouter,
  useParams,
  usePathname,
  useSearchParams,
} from "next/navigation";

type Props = {
  title?: string;
};

export default function NavBar({ title = "" }: Props) {
  //   const router = useRouter()
  //   useParams
  //     useSearchParams

  if (typeof window === "undefined") {
    console.log("NavBar Server"); // Prerended
  } else {
    console.log("NavBar Client"); // Hydrated
  }

  const pathname = usePathname();

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
        <Link
          href="/products"
          className={
            pathname.includes("/products") ? "text-primary underline" : ""
          }
        >
          Sklep
        </Link>
        <Link
          href="/blog"
          className={pathname.includes("/blog") ? "text-primary underline" : ""}
        >
          Blog
        </Link>
        <Link href="/about">O nas</Link>
        <Link href="/contact">Kontakt</Link>
      </div>
    </nav>
  );
}
