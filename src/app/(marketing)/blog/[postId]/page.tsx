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
import {
  BlogPostCommentForm,
  BlogPostComments,
} from "../components/BlogPostComments";
import * as CommentsStore from "@/services/CommentsStore";
import { BlogPost } from "@/services/model";
import { refresh, revalidatePath } from "next/cache";

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

  getBlogPostById(postId); // Start Prefetch

  return (
    <article className="mx-auto grid min-w-2xl max-w-3xl gap-8 py-10">
      <Suspense fallback={<PostHeaderSkeleton />}>
        <PostHeader postId={postId} />
      </Suspense>

      <Suspense fallback={<PostImagesSkeleton />}>
        <PostImages postId={postId} />
      </Suspense>

      <Suspense fallback={<PostContentSkeleton />}>
        <PostContent postId={postId} />
      </Suspense>

      <Suspense fallback={<PostCommentsSkeleton />}>
        <BlogPostCommentsServer postId={postId} />
      </Suspense>
    </article>
  );
}

export async function BlogPostCommentsServer({ postId }: { postId: string }) {
  const comments = await getBlogPostComments(postId);

  // Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server".
  // (comments as any)[0].tajne = function () {
  //   "ups..";
  // };

  // Server Actions must be async functions.

  async function createNewComment(
    draft: Omit<BlogPost["comments"][number], "user">,
  ) {
    "use server"; // Expose this as POST /blog/[postId]

    CommentsStore.addExtraComment(postId, { ...draft, user: "test123" });

    console.log("Dodaje nowy comment: " + draft.comment);

    return { message: "Sukces!" };
  }

  async function createNewCommentForm(data: FormData) {
    "use server";

    const draft = {
      comment: data.get("comment")?.toString() ?? "",
      // postId: data.get("postId"),
    };

    CommentsStore.addExtraComment(postId, { ...draft, user: "test123" });

    refresh(); // Refresh server page caches
    revalidatePath(`blog/${postId}`, "page");

    return { message: "Sukces!" };
  }

  return (
    <div className="grid gap-5">
      <BlogPostComments postId={postId} comments={comments} />

      {/* <BlogPostCommentForm postId={postId} onSave={createNewComment} /> */}
      <BlogPostCommentForm postId={postId} onSaveForm={createNewCommentForm} />
    </div>
  );
}
