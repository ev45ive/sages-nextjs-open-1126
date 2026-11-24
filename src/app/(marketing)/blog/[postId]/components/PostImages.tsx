import Image from "next/image";
import { getBlogPostById } from "@/services/BlogAPI";

export async function PostImages({ postId }: { postId: string }) {
  const post = await getBlogPostById(postId);

  if (post.images.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {post.images.map((src, index) => (
        <div
          key={src}
          className="relative aspect-2/1 overflow-hidden rounded-xl bg-muted"
        >
          <Image
            src={src}
            alt={`${post.title} - image ${index + 1}`}
            fill
            sizes="(min-width: 768px) 376px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
