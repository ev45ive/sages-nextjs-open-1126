import NavBar from "@/components/layout/NavBar";
import { mockBlogPosts } from "./mockBlogPosts";

export const instant = false;

// mockBlogPosts.filter(p =>p.title.toLowerCase().contains(query.toLowerCase())).map()

/**
 * Lista postów na blogu
 * http://localhost:3000/blog/
 */
export default async function BlogPostListPage(props: PageProps<"/blog">) {
  const { query = "" } = await props.searchParams;

  // let filtered = query as string

  // let filtered = String(query ?? '')
  if (typeof query !== "string") {
    throw new Error("Invalid query");
  }

  return (
    <div className="grid my-5 gap-5 bg-background font-sans container mx-auto">
      <NavBar title="Blog Posts" />

      {/* .grid.grid-cols-2.gap-5>.grid.gap-2*2>h3.text-xl{Title $$} */}
      <div className="grid md:grid-cols-2 gap-5">
        {mockBlogPosts
          .filter((p) =>
            p.title.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
          )
          .map((p) => (
            <div className="grid gap-2" key={p.id}>
              <h3 className="text-xl">
                <a href={`/blog/${p.id}/`}>{p.title}</a>
              </h3>
            </div>
          ))}
      </div>
    </div>
  );
}
