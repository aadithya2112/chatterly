export type WidgetDetails = {
  id: string;
  name: string;
  domain: string;
  apiKey: string;
  createdAt: string;
  stats: {
    totalUsers: number;
    totalConversations: number;
    todayUsers: number;
    todayConversations: number;
  };
  recentUsers: {
    id: string;
    email: string | null;
    name: string | null;
    createdAt: string;
  }[];
  recentConversations: {
    id: string;
    startedAt: string;
    endedAt: string | null;
    messageCount: number;
    user: {
      id: string;
      name: string;
      email: string | null;
    };
  }[];
};
