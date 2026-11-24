import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import postdata from "../../../../../public/postsdata.json";
import {
  getBlogPostAuthor,
  getBlogPostById,
  getBlogPostComments,
  getBlogPostLikes,
} from "@/services/BlogAPI";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReactNode, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// export const instant = false;

// Generate on BUILD:
export async function generateStaticParams() {
  return postdata.map((post) => ({ postId: String(post.id) }));
}

/**
 * Strona Posta
 */
export default async function PostPage(props: PageProps<"/blog/[postId]">) {
  const { postId } = await props.params;

  const [post] = await Promise.all([getBlogPostById(postId)]);

  return (
    <article className="mx-auto grid max-w-3xl gap-8 py-10">
      <header className="grid gap-4">
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <h1 className="font-heading text-4xl font-bold">{post.title}</h1>

        {/* Still waterfall - async parent waits for async children  */}
        {/* <UserAvatar postId={postId} /> */}

        <Suspense
          fallback={
            <Skeleton className="h-8 w-full">{/* Loading User... */}</Skeleton>
          }
        >
          <PostAuthorAvatar postId={postId}>
            {/* <PostLikes postId={postId} /> */}

            <Suspense fallback={<Skeleton>Loading Likes...</Skeleton>}>
              <PostLikes postId={postId} />
            </Suspense>
          </PostAuthorAvatar>
        </Suspense>
      </header>

      <p className="text-lg leading-relaxed">{post.body}</p>

      {post.images.length > 0 && (
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
      )}

      <Suspense fallback={<BlogPostCommentsSkeleton />}>
        {" "}
        <BlogPostComments postId={postId} />
      </Suspense>
    </article>
  );
}

async function PostLikes({ postId }: { postId: string }) {
  const likes = await getBlogPostLikes(postId);
  return <span>· {likes} likes</span>;
}

async function PostAuthorAvatar({
  postId,
  children,
}: {
  children?: ReactNode;
  postId: string;
}) {
  const author = await getBlogPostAuthor(postId);
  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src={author.avatar} alt={author.name} />
        <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <span className="text-muted-foreground">{author.name}</span>
      {children && <span className="text-muted-foreground">{children}</span>}
    </div>
  );
}

async function BlogPostComments({ postId }: { postId: string }) {
  const comments = await getBlogPostComments(postId);

  return (
    <section className="grid gap-4">
      <h2 className="text-2xl font-semibold">Comments ({comments.length})</h2>
      {comments.map((c, index) => (
        <Card key={index} size="sm">
          <CardHeader>
            <CardTitle>{c.user}</CardTitle>
            <CardDescription>{c.comment}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </section>
  );
}
async function BlogPostCommentsSkeleton({}) {
  return (
    <>
      <Skeleton className="h-8 w-48" />
      {Array.from({ length: 2 }, (_, index) => (
        <Card key={index} size="sm">
          <CardHeader>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
        </Card>
      ))}
    </>
  );
}
