"use client";

import { cn } from "cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps } from "react";

export function NavLink({ className, ...props }: ComponentProps<typeof Link>) {
  const pathname = usePathname(); // hooks : DependecyInjection

  const isActive = pathname.includes(props.href.toString());

  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      className={`transition-colors ${cn(
        isActive
          ? "bg-muted font-medium text-foreground"
          : "text-muted-foreground hover:text-foreground",
        className,
      )}`}
      {...props}
    />
  );
}
