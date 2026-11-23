type Props = {
  title?: string;
};

export default function NavBar({ title = "" }: Props) {
  return (
    <nav className="flex px-5 items-center justify-between gap-4 font-sans bg-accent py-5">
      {title && <a href="/">{title}</a>}

      <div className="flex items-center gap-3">
        <a href="/shop">Sklep</a>
        <a href="/blog">Blog</a>
        <a href="/about">O nas</a>
        <a href="/contact">Kontakt</a>
      </div>
    </nav>
  );
}
