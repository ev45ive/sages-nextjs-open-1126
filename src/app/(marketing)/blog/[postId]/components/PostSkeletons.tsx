import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PostMetaSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="size-8 rounded-full" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

export function PostHeaderSkeleton() {
  return (
    <header className="grid gap-4">
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="h-10 w-3/4" />
      <PostMetaSkeleton />
    </header>
  );
}

export function PostContentSkeleton() {
  return (
    <div className="grid gap-2">
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-2/3" />
    </div>
  );
}

export function PostImagesSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Array.from({ length: 2 }, (_, index) => (
        <Skeleton key={index} className="aspect-2/1 rounded-xl" />
      ))}
    </div>
  );
}

export function PostCommentsSkeleton() {
  return (
    <section className="grid gap-4">
      <Skeleton className="h-8 w-48" />
      {Array.from({ length: 2 }, (_, index) => (
        <Card key={index} size="sm">
          <CardHeader>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
        </Card>
      ))}
    </section>
  );
}
