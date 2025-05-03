import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface ConversationMetaCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  subtext?: string;
  badge?: ReactNode;
}

export function ConversationMetaCard({
  icon,
  title,
  value,
  subtext,
  badge,
}: ConversationMetaCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 bg-muted/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10">
                {icon}
              </div>
              <h3 className="font-medium text-sm">{title}</h3>
            </div>
            {badge}
          </div>
        </div>
        <div className="p-4">
          <p className="font-medium break-all">{value}</p>
          {subtext && (
            <p className="text-sm text-muted-foreground mt-1">{subtext}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
