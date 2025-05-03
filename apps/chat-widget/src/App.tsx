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

  // Initialize connection with the backend
  useEffect(() => {
    const initSession = async () => {
      try {
        setIsLoading(true);

        // Try to get existing sessionId from localStorage
        const savedSessionId = localStorage.getItem("chatSessionId");
        console.log("Saved sessionId from localStorage:", savedSessionId);

        let newSessionId = savedSessionId;

        // Only make API call if no session ID exists in localStorage
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

          console.log("New session ID from server:", newSessionId);

          // Save the new session ID to localStorage
          if (newSessionId) {
            localStorage.setItem("chatSessionId", newSessionId);
          } else {
            console.error("Failed to save session ID: newSessionId is null");
          }
          console.log("Saved new sessionId to localStorage");

          // If we have history from the response, use it
          if (data.history && Array.isArray(data.history)) {
            setMessages(data.history);
          }
        } else {
          console.log("Using existing session ID from localStorage");
        }

        // Set the session ID
        setSessionId(newSessionId);

        // Connect to socket.io server
        const newSocket = io(WS_BACKEND_URL, {
          transports: ["websocket"], // Ensure WebSocket transport is used
        });

        newSocket.on("connect", () => {
          console.log(`✅ Connected to server with Socket ID: ${newSocket.id}`);

          // Emit authenticate event after connection using the session ID
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

          // Clear invalid sessionId from localStorage
          localStorage.removeItem("chatSessionId");
          localStorage.removeItem(`chatMessages-${newSessionId}`);

          setIsLoading(false);
        });

        // Handle incoming messages
        newSocket.on("message:receive", (messageData) => {
          console.log(`📥 Message received from server:`, messageData);
          // Format the incoming message
          const botMessage: Message = {
            id: messageData.id || `msg-${Date.now()}`,
            text: messageData.message,
            sender: messageData.isUserMessage ? "user" : "bot",
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
          if (newSessionId) {
            newSocket.emit("authenticate", { sessionId: newSessionId });
          }
        });

        setSocket(newSocket);

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
