import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getBlogPostAuthor, getBlogPostLikes } from "@/services/BlogAPI";

export async function PostMeta({ postId }: { postId: string }) {
  const [author, likes] = await Promise.all([
    getBlogPostAuthor(postId),
    getBlogPostLikes(postId),
  ]);

  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src={author.avatar} alt={author.name} />
        <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <span className="text-muted-foreground">{author.name}</span>
      <span className="text-muted-foreground">· {likes} likes</span>
    </div>
  );
}
