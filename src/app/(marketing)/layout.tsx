import NavBar from "@/components/layout/NavBar";
import { BlogFilter } from "./blog/components/BlogFilter";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function MarketingLayout(props: LayoutProps<"/">) {
  //   const { slug } = await props.params;

  return (
    <>
      <NavBar title="Home">
        <Suspense fallback={<Skeleton className="h-8 w-44" />}>
          <BlogFilter placeholder="Szukaj" className="h-8 w-44" />
        </Suspense>
      </NavBar>

      <div className="grid my-5 gap-5 bg-background font-sans container mx-auto">
        {props.children}
      </div>
    </>
  );
}
