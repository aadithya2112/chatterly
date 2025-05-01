import styled, { keyframes } from "styled-components";

const bounceIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(66, 133, 244, 0.6); }
  70% { box-shadow: 0 0 0 10px rgba(66, 133, 244, 0); }
  100% { box-shadow: 0 0 0 0 rgba(66, 133, 244, 0); }
`;

const BubbleContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
  animation: ${bounceIn} 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const BubbleIcon = styled.div`
  font-size: 28px;
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  width: 20px;
  height: 20px;
  background-color: #ea4335;
  border-radius: 50%;
  color: white;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  animation: ${pulse} 2s infinite;
`;

interface ChatBubbleProps {
  onClick: () => void;
  hasNewMessages?: boolean;
}

const ChatBubble = ({ onClick, hasNewMessages = false }: ChatBubbleProps) => {
  return (
    <BubbleContainer onClick={onClick}>
      <BubbleIcon>💬</BubbleIcon>
      {hasNewMessages && <NotificationBadge>1</NotificationBadge>}
    </BubbleContainer>
  );
};

export default ChatBubble;
