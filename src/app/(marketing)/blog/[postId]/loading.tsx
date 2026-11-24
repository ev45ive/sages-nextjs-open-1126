import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader } from "@/components/ui/card";

// Mirrors the layout of page.tsx so the content doesn't shift when it loads
export default function Loading() {
  return (
    <article className="mx-auto grid max-w-3xl gap-8 py-10">
      <header className="grid gap-4">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="h-10 w-3/4" />
        <div className="flex items-center gap-3">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </header>

      <div className="grid gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="aspect-2/1 w-full rounded-xl" />
        <Skeleton className="aspect-2/1 w-full rounded-xl" />
      </div>

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
    </article>
  );
}
