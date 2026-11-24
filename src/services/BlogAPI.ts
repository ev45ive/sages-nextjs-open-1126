import { notFound, redirect } from "next/navigation";
import { delay } from "@/lib/delay";
import posts from "../../public/postsdata.json";
import { BlogPost } from "./model";
import { connection } from "next/server";
import { cacheLife, cacheTag } from "next/cache";
import { getExtraComments } from "./CommentsStore";

function findPost(id: number | string): BlogPost {
  const post: BlogPost | undefined = posts.find((p) => p.id == Number(id));
  if (!post) notFound();
  return post;
}

export async function getBlogPosts({
  filter = "",
}: {
  filter?: string;
} = {}): Promise<BlogPost[]> {
  await connection();
  await delay(500, 200);

  return posts.filter((p) =>
    p.title.toLocaleLowerCase().includes(filter.toLocaleLowerCase()),
  );
}

export async function getBlogPostById(id: number | string): Promise<BlogPost> {
  "use cache";
  cacheLife("minutes");
  console.log("LOADING POST DATA id: " + id);

  // await connection();
  await delay(500, 500);

  if (id == "500") throw new Error("Server Error");
  if (id == "404") notFound();
  if (id == "301") redirect("products", "replace");

  return findPost(id);
}

export async function getBlogPostComments(id: number | string) {
  "use cache";

  cacheLife("seconds");
  cacheTag(
    "blog/posts/all/comments", 
    `blog/posts/${id}/comments` // TODO: TagsMap.blog.posts(id).comments()
  );

  console.log("LOADING POST COMMENTS DATA id: " + id);

  await delay(3_000, 1_000);

  return getExtraComments(String(id));
}

export async function getBlogPostAuthor(id: number | string) {
  await delay(1_000, 1_000);

  return findPost(id).author;
}

const thisLikesMapWillBeLost = new Map<BlogPost["id"], number>([]);

export async function getBlogPostLikes(id: number | string): Promise<number> {
  "use cache";

  // cacheLife("seconds");
  cacheLife({
    stale: 30, // fetch from server
    revalidate: 60, // serve stale, rebuild in background
    expire: 120, // rebuild fresh on request (loading...)
  });

  console.log("LOADING POST LIKES DATA id: " + id);
  await delay(300, 300);

  const likes = thisLikesMapWillBeLost.get(Number(id)) ?? 1;
  if (likes) {
    thisLikesMapWillBeLost.set(Number(id), likes + 1);
  }

  return likes;

  // return (Number(id) * 37) % 100;
}
