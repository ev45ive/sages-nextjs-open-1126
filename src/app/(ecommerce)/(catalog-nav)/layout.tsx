import { ReactNode } from "react";

// sidebar to slot @sidebar: każda sekcja (katalog, produkt) dostarcza własny panel bocznego
export default async function MarketingLayout({
  children,
  sidebar,
}: {
  children: ReactNode;
  sidebar: ReactNode;
}) {
  return (
    <>
      <div className="grid md:grid-cols-[minmax(200px,30%)_1fr] my-5 gap-5 bg-background font-sans container mx-auto">
        <aside className="border-r pr-6">{sidebar}</aside>
        <div className="min-w-0">{children}</div>
      </div>
    </>
  );
}
