import { Suspense } from "react";
import postdata from "../../../../../public/postsdata.json";
import { getBlogPostById, getBlogPostComments } from "@/services/BlogAPI";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PostHeader } from "./components/PostHeader";
import { PostContent } from "./components/PostContent";
import { PostImages } from "./components/PostImages";
import {
  PostCommentsSkeleton,
  PostContentSkeleton,
  PostHeaderSkeleton,
  PostImagesSkeleton,
} from "./components/PostSkeletons";

// export const instant = false;

// Generate on BUILD:
export async function generateStaticParams() {
  return postdata.map((post) => ({ postId: String(post.id) }));
}

/**
 * Strona Posta
 */
export default function PostPage(props: PageProps<"/blog/[postId]">) {
  // const { postId } = await props.params;

  return (
    <>
      <Suspense>
        <BlogPost params={props.params} />
      </Suspense>
    </>
  );
}

async function BlogPost(props: { params: Promise<{ postId: string }> }) {
  const { postId } = await props.params;

  // notFound() guard before streaming starts, so a missing post returns 404
  // await getBlogPostById(postId);

  return (
    <article className="mx-auto grid max-w-3xl gap-8 py-10">
      <Suspense fallback={<PostHeaderSkeleton />}>
        <PostHeader postId={postId} />
      </Suspense>

      <Suspense fallback={<PostContentSkeleton />}>
        <PostContent postId={postId} />
      </Suspense>

      <Suspense fallback={<PostImagesSkeleton />}>
        <PostImages postId={postId} />
      </Suspense>

      <Suspense fallback={<PostCommentsSkeleton />}>
        <BlogPostComments postId={postId} />
      </Suspense>
    </article>
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
