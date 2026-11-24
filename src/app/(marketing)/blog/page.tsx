import NavBar from "@/components/layout/NavBar";
import { mockBlogPosts } from "./mockBlogPosts";
import Link from "next/link";

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

  const filteredPosts = mockBlogPosts.filter((p) =>
    p.title.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
  );

  return (
    <>
      {/* .grid.grid-cols-2.gap-5>.grid.gap-2*2>h3.text-xl{Title $$} */}
      <div className="grid md:grid-cols-2 gap-5">
        <input/>
        {filteredPosts.map((p) => (
          <div className="grid gap-2" key={p.id}>
            <h3 className="text-xl">
              <Link href={`/blog/${p.id}/`}>{p.title}</Link>
            </h3>
          </div>
        ))}
      </div>
    </>
  );
}
