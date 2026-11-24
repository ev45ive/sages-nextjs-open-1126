import NavBar from "@/components/layout/NavBar";
import { BlogFilter } from "./blog/components/BlogFilter";

export default async function MarketingLayout(props: LayoutProps<"/">) {
  //   const { slug } = await props.params;

  return (
    <>
      <NavBar title="Home">
        <BlogFilter placeholder="Szukaj" className="h-8 w-44" />
      </NavBar>
      
      <div className="grid my-5 gap-5 bg-background font-sans container mx-auto">
        {props.children}
      </div>
    </>
  );
}
