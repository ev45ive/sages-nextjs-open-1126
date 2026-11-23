import { notFound } from "next/navigation";
import { mockBlogPosts } from "../mockBlogPosts";

export const instant = false;

/**
 * Strona Posta
 */
export default async function PostPage(props: PageProps<"/blog/[postId]">) {
  const { postId } = await props.params;

  const post = mockBlogPosts.find((p) => p.id == Number(postId));

  // if(!post) throw new Error('Not found')

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
