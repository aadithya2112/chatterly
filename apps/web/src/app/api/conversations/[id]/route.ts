import { NextRequest, NextResponse } from "next/server";
import { prismaClient as prisma } from "@repo/db/client";
import jwt from "jsonwebtoken";
import { jsonToken } from "@/app/types/token";

const SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await context.params;

    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation ID is required." },
        { status: 400 }
      );
    }

    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization token is missing." },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Authorization token is invalid." },
        { status: 401 }
      );
    }

    // Verify and decode the token
    let decodedToken: jsonToken;
    try {
      decodedToken = jwt.verify(token, SECRET) as jsonToken;
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid or expired token." },
        { status: 401 }
      );
    }

    const { id: adminId } = decodedToken;

    if (!adminId) {
      return NextResponse.json(
        { error: "Unable to authenticate admin." },
        { status: 401 }
      );
    }

    // Fetch the conversation with messages and verify admin access
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { timestamp: "asc" },
        },
        user: true,
        site: {
          select: {
            id: true,
            name: true,
            domain: true,
            adminId: true,
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found." },
        { status: 404 }
      );
    }

    // Verify that the conversation's site belongs to the admin
    if (conversation.site.adminId !== adminId) {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }

    // Format the conversation data
    const conversationData = {
      id: conversation.id,
      startedAt: conversation.startedAt,
      endedAt: conversation.endedAt,
      site: {
        id: conversation.site.id,
        name: conversation.site.name,
        domain: conversation.site.domain,
      },
      user: {
        id: conversation.user.id,
        name: conversation.user.name || "Anonymous",
        email: conversation.user.email,
      },
      messages: conversation.messages.map((msg) => ({
        id: msg.id,
        content: msg.content,
        isUserMessage: msg.isUserMessage,
        aiModel: msg.aiModel,
        timestamp: msg.timestamp,
      })),
    };

    return NextResponse.json({ success: true, conversation: conversationData });
  } catch (error) {
    console.error("[Conversation Details API]", error);
    return NextResponse.json(
      { error: "An error occurred while fetching conversation details." },
      { status: 500 }
    );
  }
}
