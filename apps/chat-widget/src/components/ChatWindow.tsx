import { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { Message } from "../types";

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const typing = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
`;

const WindowContainer = styled.div<{ isExpanded: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: ${(props) => (props.isExpanded ? "450px" : "350px")};
  height: ${(props) => (props.isExpanded ? "600px" : "500px")};
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 9999;
  overflow: hidden;
  border: 1px solid #e8e8e8;
  animation: ${slideIn} 0.3s ease-out;
  font-family: "Segoe UI", "Roboto", sans-serif;
  transition:
    width 0.3s ease,
    height 0.3s ease;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #4285f4 0%, #0f9d58 100%);
  color: white;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const OnlineIndicator = styled.div`
  width: 10px;
  height: 10px;
  background-color: #0f9d58;
  border-radius: 50%;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
  margin-right: 4px;
`;

const HeaderButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HeaderButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

const CloseButton = styled(HeaderButton)``;

const ExpandButton = styled(HeaderButton)``;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 18px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
  background-color: #f9f9fb;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`;

const MessageGroup = styled.div<{ isUser: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.isUser ? "row-reverse" : "row")};
  align-items: flex-start;
  gap: 10px;
  width: 100%;
  animation: ${fadeIn} 0.3s ease-out;
`;

const Avatar = styled.div<{ isUser: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${(props) =>
    props.isUser
      ? "linear-gradient(135deg, #6a89cc, #4a69bd)"
      : "linear-gradient(135deg, #4285f4, #34a853)"};
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
`;

const MessageContent = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 80%;
`;

const MessageBubble = styled.div<{ isUser: boolean }>`
  padding: 12px 16px;
  border-radius: ${(props) =>
    props.isUser ? "18px 18px 0 18px" : "18px 18px 18px 0"};
  background-color: ${(props) => (props.isUser ? "white" : "#4285f4")};
  color: ${(props) => (props.isUser ? "#333" : "white")};
  box-shadow: ${(props) =>
    props.isUser
      ? "0 2px 8px rgba(0, 0, 0, 0.05)"
      : "0 2px 8px rgba(66, 133, 244, 0.2)"};
  word-wrap: break-word;
  border: ${(props) => (props.isUser ? "1px solid #e1e1e1" : "none")};
`;

const Timestamp = styled.div`
  font-size: 11px;
  color: #999;
  margin-top: 4px;
  text-align: right;
`;

const TypingIndicator = styled.div`
  display: flex;
  padding: 12px 16px;
  border-radius: 18px 18px 18px 0;
  background-color: #e1e1e1;
  width: fit-content;
  margin-top: 8px;
  margin-left: 42px;
`;

const TypingDot = styled.div`
  width: 8px;
  height: 8px;
  margin: 0 2px;
  border-radius: 50%;
  background-color: #888;
  display: inline-block;
  animation: ${typing} 1s infinite;

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.4s;
  }
`;

const InputArea = styled.div`
  display: flex;
  padding: 16px;
  border-top: 1px solid #eaeaea;
  background-color: white;
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e1e1e1;
  border-radius: 24px;
  outline: none;
  font-size: 14px;
  background-color: #f5f5f5;
  color: #333; /* Explicitly set text color to dark */
  transition: all 0.2s;

  &::placeholder {
    color: #999;
  }

  &:focus {
    border-color: #4285f4;
    box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.2);
    background-color: white;
  }
`;

const SendButton = styled.button`
  margin-left: 10px;
  width: 40px;
  height: 40px;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #3367d6;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Status = styled.div<{ connected: boolean }>`
  font-size: 12px;
  color: ${(props) => (props.connected ? "#0f9d58" : "#ea4335")};
  padding: 6px 18px;
  background-color: ${(props) => (props.connected ? "#e6f4ea" : "#fce8e6")};
  display: flex;
  align-items: center;
  gap: 5px;

  &:before {
    content: "";
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${(props) => (props.connected ? "#0f9d58" : "#ea4335")};
  }
`;

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

interface ChatWindowProps {
  messages: Message[];
  onClose: () => void;
  onSendMessage: (text: string) => void;
  connected: boolean;
}

const ChatWindow = ({
  messages,
  onClose,
  onSendMessage,
  connected,
}: ChatWindowProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Load expanded state from localStorage
  useEffect(() => {
    const savedExpandState = localStorage.getItem("chatExpanded");
    if (savedExpandState) {
      setIsExpanded(savedExpandState === "true");
    }
  }, []);

  // Save expanded state to localStorage
  useEffect(() => {
    localStorage.setItem("chatExpanded", isExpanded.toString());
  }, [isExpanded]);

  // Simulate typing indicator when bot is about to respond
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender === "user") {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <WindowContainer isExpanded={isExpanded}>
      <Header>
        <Title>
          <OnlineIndicator />
          Chat Assistant
        </Title>
        <HeaderButtons>
          <ExpandButton
            onClick={toggleExpand}
            title={isExpanded ? "Collapse window" : "Expand window"}
          >
            {isExpanded ? "⊖" : "⊕"}
          </ExpandButton>
          <CloseButton onClick={onClose} title="Close chat">
            ✕
          </CloseButton>
        </HeaderButtons>
      </Header>

      <Status connected={connected}>
        {connected ? "Connected" : "Reconnecting..."}
      </Status>

      <MessagesContainer>
        {messages.map((message) => (
          <MessageGroup key={message.id} isUser={message.sender === "user"}>
            <Avatar isUser={message.sender === "user"}>
              {message.sender === "user" ? "U" : "A"}
            </Avatar>
            <MessageContent>
              <MessageBubble isUser={message.sender === "user"}>
                {message.text}
              </MessageBubble>
              <Timestamp>{formatTime(message.timestamp)}</Timestamp>
            </MessageContent>
          </MessageGroup>
        ))}

        {isTyping && (
          <TypingIndicator>
            <TypingDot />
            <TypingDot />
            <TypingDot />
          </TypingIndicator>
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <InputArea>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
        />
        <SendButton onClick={handleSend} title="Send message">
          {/* Replaced SVG with a simpler, more reliable send icon */}
          <span style={{ fontSize: "20px" }}>➤</span>
        </SendButton>
      </InputArea>
    </WindowContainer>
  );
};

export default ChatWindow;
