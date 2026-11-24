import Image from "next/image";
import Link from "next/link";
import { getBlogPosts } from "@/services/BlogAPI";

/**
 * Lista postów na blogu
 * http://localhost:3000/blog/
 */
export default async function BlogPostListPage(props: PageProps<"/blog">) {
  const { query = "" } = await props.searchParams;

  if (typeof query !== "string") {
    throw new Error("Invalid query");
  }

  const filteredPosts = await getBlogPosts({ filter: query });

  return (
    <ul className="grid grid-cols-1 gap-5 py-10 sm:grid-cols-2 lg:grid-cols-3">
      {filteredPosts.map((post) => (
        <li
          key={post.id}
          className="grid overflow-hidden rounded-xl border bg-card"
        >
          <Link
            href={`/blog/${post.id}`}
            className="relative block aspect-2/1 overflow-hidden bg-muted"
          >
            {post.images[0] && (
              <Image
                src={post.images[0]}
                alt={post.title}
                fill
                sizes="(min-width: 1024px) 336px, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            )}
          </Link>
          <h2 className="px-4 pb-4 text-lg font-semibold">
            <Link href={`/blog/${post.id}`} className="hover:underline">
              {post.title}
            </Link>
          </h2>
        </li>
      ))}
    </ul>
  );
}
