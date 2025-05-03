import type React from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
  badge?: string;
  className?: string;
}

export function DashboardHeader({
  heading,
  text,
  children,
  badge,
  className,
}: DashboardHeaderProps) {
  return (
    <div className={cn("space-y-2 mb-8", className)}>
      <div className="flex items-center justify-between">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{heading}</h1>
            {badge && (
              <Badge variant="outline" className="ml-2">
                {badge}
              </Badge>
            )}
          </div>
          {text && (
            <p className="text-muted-foreground text-sm md:text-base max-w-[750px]">
              {text}
            </p>
          )}
        </div>
        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
      <Separator className="my-2" />
    </div>
  );
}
