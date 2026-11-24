import { Suspense } from "react";
import { CategoryNav } from "../../../catalog/CategoryNav";

export default function ProductSidebar() {
  return (
    <div className="grid gap-6">
      <Suspense
        fallback={<p className="text-sm text-muted-foreground">Ładowanie kategorii…</p>}
      >
        <CategoryNav />
      </Suspense>

      <section className="grid gap-2 rounded-md border bg-card p-3 text-sm text-card-foreground">
        <h2 className="font-medium">Przykładowy blok</h2>
        <p className="text-muted-foreground">Dodatkowa treść panelu produktu.</p>
      </section>
    </div>
  );
}
