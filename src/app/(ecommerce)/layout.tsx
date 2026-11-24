import NavBar from "@/components/layout/NavBar";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function MarketingLayout({ children }: LayoutProps<"/">) {
  //   const { slug } = await props.params;

  return (
    <>
      <Suspense fallback={<Skeleton className="h-8 w-44" />}>
        <NavBar title="Shop">
          {/* <BlogFilter placeholder="Szukaj" className="h-8 w-44" /> */}
        </NavBar>
      </Suspense>

      <div className="grid my-5 gap-5 bg-background font-sans container mx-auto">
        {children}
      </div>
    </>
  );
}
