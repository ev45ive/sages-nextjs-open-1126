import { Skeleton } from "@/components/ui/skeleton";

export default function BlogListLoading() {
  return (
    <ul className="grid grid-cols-1 gap-5 py-10 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, i) => (
        <li key={i} className="grid overflow-hidden rounded-xl border bg-card">
          <Skeleton className="aspect-2/1 w-full rounded-none" />
          <div className="px-4 pb-4">
            <Skeleton className="h-7 w-3/4" />
          </div>
        </li>
      ))}
    </ul>
  );
}
