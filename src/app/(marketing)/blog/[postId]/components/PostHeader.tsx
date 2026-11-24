import { Badge } from "@/components/ui/badge";
import { getBlogPostById } from "@/services/BlogAPI";
import { PostMeta } from "./PostMeta";
import { PostMetaSkeleton } from "./PostSkeletons";
import { Suspense } from "react";

export async function PostHeader({ postId }: { postId: string }) {
  const post = await getBlogPostById(postId);

  return (
    <header className="grid gap-4">
      <div className="flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>
      <h1 className="font-heading text-4xl font-bold">{post.title}</h1>
      <Suspense fallback={<PostMetaSkeleton />}>
        <PostMeta postId={postId} />
      </Suspense>
    </header>
  );
}
