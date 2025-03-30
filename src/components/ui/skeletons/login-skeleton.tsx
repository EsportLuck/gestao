import { Skeleton } from "../skeleton";

export function LoginSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px] mx-auto" />
        <Skeleton className="h-4 w-[200px] mx-auto" />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-[100px]" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-[100px]" />
        </div>

        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
