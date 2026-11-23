import NavBar from "@/components/layout/NavBar";

export default async function MarketingLayout(props: LayoutProps<"/">) {
  //   const { slug } = await props.params;

  return (
    <>
      <NavBar title="Shop" />
      <div className="grid my-5 gap-5 bg-background font-sans container mx-auto">
        {props.children}
      </div>
    </>
  );
}
