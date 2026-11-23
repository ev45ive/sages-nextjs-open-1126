import NavBar from "@/components/layout/NavBar";


export default async function BlogLayout(props: LayoutProps<"/blog">) {
//   const { slug } = await props.params;

  return (
    <div className="grid my-5 gap-5 bg-background font-sans container mx-auto">
      <NavBar title="Blog" />

      {props.children}
    </div>
  );
}