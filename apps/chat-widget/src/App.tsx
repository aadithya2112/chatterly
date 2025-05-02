import { useState, useEffect, useCallback } from "react";
import ChatBubble from "./components/ChatBubble";
import ChatWindow from "./components/ChatWindow";
import { Message } from "./types";
import { io, Socket } from "socket.io-client";
import { WS_BACKEND_URL } from "./config";

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
  const [socket, setSocket] = useState<Socket | null>(null);
  const [_, setIsLoading] = useState(true);
  // Initialize connection with the backend
  useEffect(() => {
    // Step 1: Initialize session with backend
    const initSession = async () => {
      try {
        setIsLoading(true);

        // Try to get existing sessionId from localStorage
        const savedSessionId = localStorage.getItem("chatSessionId");

        // Make request to backend to validate API key and get/create session
        const response = await fetch(`${serverUrl}/widget/init`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            apiKey,
            sessionId: savedSessionId || undefined,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to initialize session");
        }

        const data = await response.json();
        const newSessionId = data.sessionId;

        // Save the session ID
        setSessionId(newSessionId);
        localStorage.setItem("chatSessionId", newSessionId);

        // Connect to socket.io server
        const newSocket = io(WS_BACKEND_URL, {
          transports: ["websocket"], // Ensure WebSocket transport is used
        });

        newSocket.on("connect", () => {
          console.log(`✅ Connected to server with Socket ID: ${newSocket.id}`);

          // Emit authenticate event after connection
          newSocket.emit("authenticate", {
            sessionId: newSessionId,
          });
        });

        // Handle authentication success
        newSocket.on("authenticated", (authData) => {
          console.log("✅ Authentication successful:", authData);
          setConnected(true);

          // Save the conversationId for subsequent messages
          setConversationId(authData.conversationId);
          console.log(
            `📌 Conversation started with ID: ${authData.conversationId}`
          );

          setIsLoading(false);
        });

        // Handle authentication failure
        newSocket.on("unauthorized", (errorData) => {
          console.error("❌ Authentication failed:", errorData);
          setConnected(false);

          // Add an error message
          const errorMessage: Message = {
            id: "auth-error",
            text: "Authentication failed. Please refresh the page and try again.",
            sender: "bot",
            timestamp: new Date().toISOString(),
          };
          setMessages([errorMessage]);

          setIsLoading(false);
        });

        // Handle incoming messages
        newSocket.on("message:receive", (messageData) => {
          console.log(`📥 Message received from server:`, messageData);
          // messageData is of this format
          // {
          //   message: "Okay, I'm ready. How can I help you?\n",
          //   conversationId: "cma6zez0c00012rbu2p1ieymk",
          //   isUserMessage: false,
          // };
          // Format the incoming message
          const botMessage: Message = {
            id: messageData.id || `msg-${Date.now()}`,
            text: messageData.message, // Updated to use message instead of content
            sender: messageData.isUserMessage ? "user" : "bot", // Use isUserMessage to determine sender
            timestamp: messageData.timestamp || new Date().toISOString(),
          };

          setMessages((prev) => [...prev, botMessage]);
        });

        // Handle message errors
        newSocket.on("message:error", (errorData) => {
          console.error("❌ Error from server:", errorData);

          // Optionally add an error message to the chat
          const errorMessage: Message = {
            id: `error-${Date.now()}`,
            text: "Sorry, there was an error processing your message.",
            sender: "bot",
            timestamp: new Date().toISOString(),
          };

          setMessages((prev) => [...prev, errorMessage]);
        });

        // Handle disconnect
        newSocket.on("disconnect", (reason) => {
          console.warn(`⚠️ Disconnected from server: ${reason}`);
          setConnected(false);
        });

        // Handle reconnection attempts
        newSocket.on("reconnect_attempt", (attempt) => {
          console.log(`🔄 Reconnection attempt #${attempt}`);
        });

        // Handle successful reconnection
        newSocket.on("reconnect", (attempt) => {
          console.log(
            `✅ Successfully reconnected after ${attempt} attempt(s)`
          );

          // Re-authenticate after reconnection
          if (sessionId) {
            newSocket.emit("authenticate", { sessionId });
          }
        });

        setSocket(newSocket);

        // Load conversation history (if provided by your API)
        if (data.history && Array.isArray(data.history)) {
          setMessages(data.history);
        } else {
          // Add a welcome message if no history
          const initialMessage: Message = {
            id: "welcome",
            text: "👋 Hi there! How can I help you today?",
            sender: "bot",
            timestamp: new Date().toISOString(),
          };
          setMessages([initialMessage]);
        }

        return newSocket;
      } catch (error) {
        console.error("Failed to initialize chat widget:", error);
        // Add a fallback welcome message
        const errorMessage: Message = {
          id: "error",
          text: "Sorry, we're having trouble connecting. Please try again later.",
          sender: "bot",
          timestamp: new Date().toISOString(),
        };
        setMessages([errorMessage]);
        setIsLoading(false);
        return null;
      }
    };

    const socketPromise = initSession();

    // Cleanup function
    return () => {
      socketPromise.then((socket) => {
        if (socket) socket.disconnect();
      });
    };
  }, [apiKey, serverUrl]); // Reconnect if these values change

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
    (text: string) => {
      if (!text.trim() || !connected || !socket || !conversationId) {
        console.warn(
          "Cannot send message: missing connection or conversationId"
        );
        return;
      }

      // Create a pending message to show immediately
      const userMessage: Message = {
        id: Date.now().toString(),
        text,
        sender: "user",
        timestamp: new Date().toISOString(),
      };

      // Add to UI
      setMessages((prev) => [...prev, userMessage]);

      console.log(`📤 Sending message: "${text}"`);

      // Send to server via socket.io using the message:send event
      socket.emit("message:send", {
        content: text,
        conversationId, // Use the conversationId from authenticated event
      });
    },
    [connected, socket, conversationId]
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
