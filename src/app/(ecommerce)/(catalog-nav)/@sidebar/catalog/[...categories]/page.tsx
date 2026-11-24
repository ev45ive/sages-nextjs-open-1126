import { Suspense } from "react";
import { CategoryNav } from "../../../catalog/CategoryNav";

export default function CatalogSidebar() {
  return (
    <Suspense
      fallback={<p className="text-sm text-muted-foreground">Ładowanie kategorii…</p>}
    >
      <CategoryNav />
    </Suspense>
  );
}
