export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: string;
}

export interface ChatWidgetConfig {
  apiKey: string;
  serverUrl?: string;
}
