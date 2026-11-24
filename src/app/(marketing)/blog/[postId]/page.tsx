import { notFound, redirect } from "next/navigation";
import { mockBlogPosts } from "../mockBlogPosts";

export const instant = false;

// Generate on BUILD:
export async function generateStaticParams() {
  
  // TODO: select posts from database:
  const items =  mockBlogPosts.slice(0,4)

  return items.map((item) => ({ postId: String(item.id) }));
}

/**
 * Strona Posta
 */
export default async function PostPage(props: PageProps<"/blog/[postId]">) {
  const { postId } = await props.params;

  const post = mockBlogPosts.find((p) => p.id == Number(postId));

    if(postId == '500') throw new Error('Server Error')
    if(postId == '404') notFound()
    if(postId == '301') redirect('products','replace')

  if (!post) {
    notFound(); // never!
  }

  return (
    <div>
      <h3 className="text-2xl">Post {postId}</h3>

      <div className="grid gap-2" key={post.id}>
        <h3 className="text-xl">
          <a href={`/blog/${post.id}/`}>{post.title}</a>
        </h3>
      </div>
    </div>
  );
}
