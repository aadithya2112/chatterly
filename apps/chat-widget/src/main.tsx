import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { HTTP_BACKEND_URL } from "./config";

// Function to initialize the widget
const initChatWidget = () => {
  // Get configuration from window object
  const config = (window as any).ChatWidgetConfig || {};

  // Validate required configuration
  if (!config.apiKey) {
    console.error(
      "Chat Widget Error: apiKey is required in window.ChatWidgetConfig"
    );
    return;
  }

  // Create container for the widget
  const widgetContainer = document.createElement("div");
  widgetContainer.id = "chat-widget-container";
  document.body.appendChild(widgetContainer);

  // Render React component with the configuration
  const root = createRoot(widgetContainer);
  root.render(
    <React.StrictMode>
      {/* HTTP_BACKEND_URL set in config.ts */}
      <App apiKey={config.apiKey} serverUrl={HTTP_BACKEND_URL} />
    </React.StrictMode>
  );
};

if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  setTimeout(initChatWidget, 1);
} else {
  document.addEventListener("DOMContentLoaded", initChatWidget);
}

export { initChatWidget };
