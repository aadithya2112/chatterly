import { Button } from "@/components/ui/button";
import { DashboardShell } from "@/components/dashboard-shell";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function ConversationErrorState() {
  return (
    <DashboardShell>
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-full">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold">Conversation Not Found</h2>
        <p className="text-muted-foreground text-center max-w-md">
          This conversation might have been deleted or you don't have permission
          to view it.
        </p>
        <Button asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Dashboard
          </Link>
        </Button>
      </div>
    </DashboardShell>
  );
}
