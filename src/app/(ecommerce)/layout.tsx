import NavBar from "@/components/layout/NavBar";
import { Suspense } from "react";
import { CategoryNav } from "./catalog/CategoryNav";

export default async function MarketingLayout({ children }: LayoutProps<"/">) {
  //   const { slug } = await props.params;

  return (
    <>
      <NavBar title="Shop" />
      <div className="grid md:grid-cols-[minmax(300px,30%)_1fr] my-5 gap-5 bg-background font-sans container mx-auto">
        <aside className="border-r pr-6">
          <Suspense
            fallback={
              <p className="text-sm text-muted-foreground">
                Ładowanie kategorii…
              </p>
            }
          >
            <CategoryNav />
          </Suspense>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </>
  );
}
