import { notFound, redirect } from "next/navigation";
import { mockBlogPosts } from "../mockBlogPosts";
import { delay } from "@/lib/delay";
import Link from "next/link";

// export const instant = false;

// Generate on BUILD:
export async function generateStaticParams() {
  // TODO: select posts from database:
  const items = mockBlogPosts.slice(0, 4);

  return items.map((item) => ({ postId: String(item.id) }));
}

/**
 * Strona Posta
 */
export default async function PostPage(props: PageProps<"/blog/[postId]">) {
  const { postId } = await props.params;

  await delay(1_000, 1_000);

  const post = mockBlogPosts.find((p) => p.id == Number(postId));

  if (postId == "500") throw new Error("Server Error");
  if (postId == "404") notFound();
  if (postId == "301") redirect("products", "replace");
  // if (postId == "429" && Math.random() > 0.1)
  //   throw new Error("Too many requests" + Math.random());

  if (!post) {
    notFound(); // never!
  }

  return (
    <div>
      <h3 className="text-2xl">Post {postId}</h3>

      <div className="grid gap-2" key={post.id}>
        <h3 className="text-xl">
          <Link href={`/blog/${post.id}/`}>{post.title}</Link>
        </h3>
      </div>
    </div>
  );
}
