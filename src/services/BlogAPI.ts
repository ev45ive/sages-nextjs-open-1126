import { notFound } from "next/navigation";
import { delay } from "@/lib/delay";
import posts from "../../public/postsdata.json";
import { BlogPost } from "./model";

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
  await delay(1_000, 1_000);

  return posts.filter((p) =>
    p.title.toLocaleLowerCase().includes(filter.toLocaleLowerCase()),
  );
}

export async function getBlogPostById(id: number | string): Promise<BlogPost> {
  await delay(500, 500);

  return findPost(id);
}

export async function getBlogPostComments(id: number | string) {
  await delay(1_000, 1_000);

  return findPost(id).comments;
}

export async function getBlogPostAuthor(id: number | string) {
  await delay(1_000, 1_000);

  return findPost(id).author;
}

export async function getBlogPostLikes(id: number | string): Promise<number> {
  await delay(300, 300);

  return (Number(id) * 37) % 100;
}
