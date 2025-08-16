import { useState, useEffect, useCallback } from "react";
import ChatBubble from "./components/ChatBubble";
import ChatWindow from "./components/ChatWindow";
import { Message } from "./types";

import { HTTP_BACKEND_URL } from "./config";

interface AppProps {
  apiKey: string;
  serverUrl: string;
}

function App({ apiKey, serverUrl }: AppProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [connected, setConnected] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  // Removed unused isLoading state

  // Load messages from localStorage when sessionId is available
  useEffect(() => {
    if (sessionId) {
      const savedMessages = localStorage.getItem(`chatMessages-${sessionId}`);
      if (savedMessages) {
        try {
          const parsedMessages = JSON.parse(savedMessages);
          if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
            console.log(
              `📚 Loaded ${parsedMessages.length} messages from localStorage`
            );
            setMessages(parsedMessages);
            return; // Skip adding welcome message if we loaded messages
          }
        } catch (error) {
          console.error("Error parsing saved messages:", error);
        }
      }

      // Add a welcome message if no messages were loaded
      const initialMessage: Message = {
        id: "welcome",
        text: "👋 Hi there! How can I help you today?",
        sender: "bot",
        timestamp: new Date().toISOString(),
      };
      setMessages([initialMessage]);
    }
  }, [sessionId]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (sessionId && messages.length > 0) {
      localStorage.setItem(
        `chatMessages-${sessionId}`,
        JSON.stringify(messages)
      );
      console.log(`💾 Saved ${messages.length} messages to localStorage`);
    }
  }, [messages, sessionId]);

  // Initialize connection with the backend (HTTP)
  useEffect(() => {
    const initSession = async () => {
      try {
        // Removed setIsLoading (no longer used)
        // Try to get existing sessionId from localStorage
        const savedSessionId = localStorage.getItem("chatSessionId");
        let newSessionId = savedSessionId;
        if (!savedSessionId) {
          // Make request to backend to validate API key and create new session
          const response = await fetch(`${serverUrl}/widget/init`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              apiKey,
              sessionId: undefined,
            }),
          });
          if (!response.ok) {
            throw new Error("Failed to initialize session");
          }
          const data = await response.json();
          newSessionId = data.sessionId;
          if (newSessionId) {
            localStorage.setItem("chatSessionId", newSessionId);
          }
          if (data.history && Array.isArray(data.history)) {
            setMessages(data.history);
          }
        }
        setSessionId(newSessionId);
        setConnected(true);
        // Removed setIsLoading (no longer used)
      } catch (error) {
        console.error("Failed to initialize chat widget:", error);
        setConnected(false);
        setMessages([
          {
            id: "error",
            text: "Sorry, we're having trouble connecting. Please try again later.",
            sender: "bot",
            timestamp: new Date().toISOString(),
          },
        ]);
        // Removed setIsLoading (no longer used)
      }
    };
    initSession();
  }, [apiKey, serverUrl]);

  useEffect(() => {
    // If chat is closed and there's a new message from the bot, show notification
    if (
      !isOpen &&
      messages.length > 0 &&
      messages[messages.length - 1].sender === "bot"
    ) {
      setHasNewMessages(true);
    }
  }, [messages, isOpen]);

  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || !connected || !sessionId) {
        console.warn("Cannot send message: missing connection or sessionId");
        return;
      }

      // Add user message to UI
      const userMessage: Message = {
        id: Date.now().toString(),
        text,
        sender: "user",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // Authenticate and get conversationId if not already
      let convId = conversationId;
      if (!convId) {
        try {
          const response = await fetch(`${HTTP_BACKEND_URL}/authenticate`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ sessionId }),
          });
          if (!response.ok) {
            throw new Error("Authentication failed");
          }
          const data = await response.json();
          convId = data.conversationId;
          setConversationId(convId);
        } catch (error) {
          setMessages((prev) => [
            ...prev,
            {
              id: `auth-error-${Date.now()}`,
              text: "Authentication failed. Please refresh and try again.",
              sender: "bot",
              timestamp: new Date().toISOString(),
            },
          ]);
          setConnected(false);
          return;
        }
      }

      // Send message to backend
      try {
        const response = await fetch(`${HTTP_BACKEND_URL}/message`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: text, conversationId: convId }),
        });
        if (!response.ok) {
          throw new Error("Error sending message");
        }
        const data = await response.json();
        // Add bot response to UI
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            text: data.message,
            sender: "bot",
            timestamp: new Date().toISOString(),
          },
        ]);
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            text: "Sorry, there was an error processing your message.",
            sender: "bot",
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    },
    [connected, sessionId, conversationId]
  );

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasNewMessages(false); // Clear notification when opening chat
    }
  };

  return (
    <>
      {isOpen ? (
        <ChatWindow
          messages={messages}
          onClose={toggleChat}
          onSendMessage={handleSendMessage}
          connected={connected}
        />
      ) : (
        <ChatBubble onClick={toggleChat} hasNewMessages={hasNewMessages} />
      )}
    </>
  );
}

export default App;
