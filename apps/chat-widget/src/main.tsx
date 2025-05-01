import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Function to initialize the widget
const initChatWidget = () => {
  // Create container for the widget
  const widgetContainer = document.createElement("div");
  widgetContainer.id = "chat-widget-container";
  document.body.appendChild(widgetContainer);

  // Render React component
  const root = createRoot(widgetContainer);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// Auto-initialize when script loads
initChatWidget();

// Also export in case someone wants to initialize manually
export { initChatWidget };
