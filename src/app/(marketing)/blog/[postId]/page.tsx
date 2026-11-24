import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { mockBlogPosts } from "../mockBlogPosts";
import { delay } from "@/lib/delay";

import postdata from "../../../../../public/postsdata.json";
import { BlogPost } from "@/services/model";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

  const post: BlogPost | undefined = postdata.find(
    (p) => p.id == Number(postId),
  );

  if (!post) {
    notFound(); // never!
  }

  if (postId == "500") throw new Error("Server Error");
  if (postId == "404") notFound();
  if (postId == "301") redirect("products", "replace");
  // if (postId == "429" && Math.random() > 0.1)
  //   throw new Error("Too many requests" + Math.random());

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
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-muted-foreground">{post.author.name}</span>
        </div>
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

      <section className="grid gap-4">
        <h2 className="text-2xl font-semibold">
          Comments ({post.comments.length})
        </h2>
        {post.comments.map((c, index) => (
          <Card key={index} size="sm">
            <CardHeader>
              <CardTitle>{c.user}</CardTitle>
              <CardDescription>{c.comment}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>
    </article>
  );
}
