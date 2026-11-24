import { getBlogPostById } from "@/services/BlogAPI";

export async function PostContent({ postId }: { postId: string }) {
  const post = await getBlogPostById(postId); // Fetch POST

  return <p className="text-lg leading-relaxed">{post.body}</p>;
}
