import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WidgetDetails } from "@/lib/types";
// import type { WidgetDetails } from "../widget-details-page";

interface ActivityChartProps {
  widget: WidgetDetails;
}

export function ActivityChart({ widget }: ActivityChartProps) {
  // Generate sample data for the chart
  const getDailyActivityData = () => {
    // This would be better with real data, but for now let's simulate activity
    return [
      { day: "Mon", conversations: 5, users: 3 },
      { day: "Tue", conversations: 8, users: 4 },
      { day: "Wed", conversations: 12, users: 7 },
      { day: "Thu", conversations: 10, users: 5 },
      { day: "Fri", conversations: 15, users: 8 },
      { day: "Sat", conversations: 7, users: 4 },
      { day: "Sun", conversations: 6, users: 3 },
    ];
  };

  const activityData = getDailyActivityData();
  const maxValue = Math.max(
    ...activityData.map((d) => Math.max(d.conversations, d.users))
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Overview</CardTitle>
        <CardDescription>
          User engagement and conversations over the past week
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground mb-1">
            <span>Activity (Last 7 days)</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <span>Conversations</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-violet-500"></div>
                <span>Users</span>
              </div>
            </div>
          </div>
          <div className="flex h-40 items-end gap-2">
            {activityData.map((data, i) => (
              <div key={i} className="flex flex-1 flex-col gap-1">
                <div className="relative flex h-full flex-col justify-end gap-1">
                  <div
                    className="w-full bg-blue-500 rounded-sm transition-all duration-500"
                    style={{
                      height: `${(data.conversations / maxValue) * 100}%`,
                    }}
                  ></div>
                  <div
                    className="w-full bg-violet-500 rounded-sm transition-all duration-500"
                    style={{ height: `${(data.users / maxValue) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-center">{data.day}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
