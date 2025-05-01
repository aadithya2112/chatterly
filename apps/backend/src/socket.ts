import { Server, Socket } from "socket.io";
import { prismaClient as prisma } from "@repo/db/client";
import { fetchGeminiResponse } from "./gemini";

export function initializeSocket(io: Server): void {
  io.on("connection", (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Handle authentication
    socket.on("authenticate", (data) => handleAuthentication(socket, data));

    // Handle message sending
    socket.on("message:send", (data) => handleMessageSend(socket, data));

    // Handle client disconnection
    socket.on("disconnect", (reason) => {
      console.log(`Client disconnected: ${socket.id} (Reason: ${reason})`);
    });
  });
}

async function handleAuthentication(socket: Socket, data: any): Promise<void> {
  const { sessionId } = data;

  if (!sessionId) {
    console.log(`Socket ${socket.id} failed authentication: No sessionId`);
    socket.emit("unauthorized", {
      error: "Session ID is required for authentication",
    });
    socket.disconnect();
    return;
  }

  try {
    // Validate sessionId with the database
    const user = await prisma.user.findUnique({
      where: { sessionId },
      include: { site: true }, // Include related site for conversation creation
    });

    if (!user) {
      console.log(
        `Socket ${socket.id} failed authentication: Invalid sessionId`
      );
      socket.emit("unauthorized", { error: "Invalid session ID" });
      socket.disconnect();
    } else {
      console.log(`Socket ${socket.id} authenticated successfully`);

      // Create or retrieve a conversation for the user
      const conversation = await prisma.conversation.create({
        data: {
          userId: user.id,
          siteId: user.siteId,
        },
      });

      console.log(
        `New conversation started with ID: ${conversation.id} for user: ${user.id}`
      );

      socket.emit("authenticated", {
        message: "Authentication successful",
        conversationId: conversation.id,
      });
    }
  } catch (error) {
    console.error(`Authentication error for socket ${socket.id}:`, error);
    socket.emit("unauthorized", {
      error: "Internal server error during authentication",
    });
    socket.disconnect();
  }
}

async function handleMessageSend(socket: Socket, data: any): Promise<void> {
  const { content, conversationId } = data;

  if (!content || !conversationId) {
    socket.emit("message:error", {
      error: "Content and conversationId are required",
    });
    return;
  }

  console.log(
    `Received message from client: ${content} (Conversation ID: ${conversationId})`
  );

  try {
    // Add the user's message to the database
    const newMessage = await prisma.message.create({
      data: {
        conversationId,
        content,
        isUserMessage: true,
        timestamp: new Date(),
      },
    });

    console.log("User message saved to database:", newMessage);

    // Fetch AI response from Gemini
    const geminiResponse = await fetchGeminiResponse(content);

    console.log("Gemini response received:", geminiResponse);

    // Add the AI's response to the database
    const aiMessage = await prisma.message.create({
      data: {
        conversationId,
        content: geminiResponse,
        isUserMessage: false,
        timestamp: new Date(),
      },
    });

    console.log("AI response saved to database:", aiMessage);

    // Send the AI response back to the client
    socket.emit("message:receive", {
      message: geminiResponse,
      conversationId,
      isUserMessage: false,
    });
  } catch (error) {
    console.error("Error processing message:", error);
    socket.emit("message:error", {
      error: "Internal server error while processing the message",
    });
  }
}
