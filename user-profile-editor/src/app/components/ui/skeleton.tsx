// app/components/ui/skeleton.tsx
import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  rounded?: boolean | string;
}

export function Skeleton({
  className,
  width,
  height,
  rounded = false,
  ...props
}: SkeletonProps) {
  const roundedClass = typeof rounded === 'string' 
    ? `rounded-${rounded}` 
    : rounded ? "rounded-full" : "rounded-md";

  return (
    <div
      className={twMerge(
        "animate-pulse bg-gray-200",
        roundedClass,
        className
      )}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
      }}
      {...props}
    />
  );
}

export function ProfileFormSkeleton() {
  return (
    <div className="space-y-6 p-6 max-w-2xl mx-auto">
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>
      
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      
      <div className="space-y-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-32 w-full" />
      </div>
      
      <Skeleton className="h-10 w-24" />
    </div>
  );
}