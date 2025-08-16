import { prismaClient as prisma } from "@repo/db/client";
import { fetchGeminiResponse } from "./gemini";
import { Router } from "express";
import type { Request, Response } from "express";

const chatRouter = Router();

// POST /api/authenticate
chatRouter.post("/authenticate", async (req: Request, res: Response) => {
  // No explicit return type, just use res.json/res.status
  const { sessionId } = req.body;
  if (!sessionId) {
    res
      .status(400)
      .json({ error: "Session ID is required for authentication" });
    return;
  }
  try {
    const user = await prisma.user.findUnique({
      where: { sessionId },
      include: { site: true },
    });
    if (!user) {
      res.status(401).json({ error: "Invalid session ID" });
      return;
    }
    // Create a new conversation for the user
    const conversation = await prisma.conversation.create({
      data: {
        userId: user.id,
        siteId: user.siteId,
      },
    });
    res.json({
      message: "Authentication successful",
      conversationId: conversation.id,
    });
    return;
  } catch (error) {
    console.error("Authentication error:", error);
    res
      .status(500)
      .json({ error: "Internal server error during authentication" });
    return;
  }
});

// POST /api/message
chatRouter.post("/message", async (req: Request, res: Response) => {
  // No explicit return type, just use res.json/res.status
  const { content, conversationId } = req.body;
  if (!content || !conversationId) {
    res.status(400).json({ error: "Content and conversationId are required" });
    return;
  }
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
    // Fetch AI response from Gemini
    const geminiResponse = await fetchGeminiResponse(content);
    // Add the AI's response to the database
    const aiMessage = await prisma.message.create({
      data: {
        conversationId,
        content: geminiResponse,
        isUserMessage: false,
        timestamp: new Date(),
      },
    });
    // Send the AI response back to the client
    res.json({
      message: geminiResponse,
      conversationId,
      isUserMessage: false,
    });
    return;
  } catch (error) {
    console.error("Error processing message:", error);
    res
      .status(500)
      .json({ error: "Internal server error while processing the message" });
    return;
  }
});

export default chatRouter;
