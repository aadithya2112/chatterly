import { useState, useEffect } from "react";
import ChatBubble from "./components/ChatBubble";
import ChatWindow from "./components/ChatWindow";
import { Message } from "./types";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasNewMessages, setHasNewMessages] = useState(false);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Add a welcome message
      const initialMessage: Message = {
        id: "1",
        text: "👋 Hi there! How can I help you today? I'm here to answer your questions and provide assistance.",
        sender: "bot",
        timestamp: new Date().toISOString(),
      };
      setMessages([initialMessage]);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));

    // If chat is closed and there's a new message from the bot, show notification
    if (
      !isOpen &&
      messages.length > 0 &&
      messages[messages.length - 1].sender === "bot"
    ) {
      setHasNewMessages(true);
    }
  }, [messages, isOpen]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, userMessage]);

    // Simulate bot response after a short delay
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `You said: "${text}". This is a simulated response.`,
        sender: "bot",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1500);
  };

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
          connected={true} // For simplicity, we'll assume always connected in this version
        />
      ) : (
        <ChatBubble onClick={toggleChat} hasNewMessages={hasNewMessages} />
      )}
    </>
  );
}

export default App;
