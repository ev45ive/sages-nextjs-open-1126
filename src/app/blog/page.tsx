import { mockBlogPosts } from "./mockBlogPosts";

export const instant = false;

mockBlogPosts

/**
 * Lista postów na blogu
 */
export default async function BlogPostListPage(props: PageProps<"/blog">) {
  const { query } = await props.searchParams;


  return (
    <div className="w-4xl max-w-full md:max-w-[90%] py-5 mx-auto">
      <h1 className="text-2xl">Blog Posts</h1>

      {/* .grid.grid-cols-2.gap-5>.grid.gap-2*2>h3.text-xl{Title $$} */}
      <div className="grid grid-cols-2 gap-5">
        <div className="grid gap-2">
            <h3 className="text-xl">Title 01</h3>
        </div>
        <div className="grid gap-2">
            <h3 className="text-xl">Title 02</h3>
        </div>
      </div>
    </div>
  );
}
