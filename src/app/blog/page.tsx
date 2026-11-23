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
    <div className="grid gap-5 w-4xl max-w-full md:max-w-[90%] py-5 mx-auto">
      <h1 className="text-2xl mb-5">Blog Posts</h1>

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
