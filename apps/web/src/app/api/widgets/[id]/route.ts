import { NextRequest, NextResponse } from "next/server";
import { prismaClient as prisma } from "@repo/db/client";
import jwt from "jsonwebtoken";
import { jsonToken } from "@/app/types/token";

const SECRET = process.env.JWT_SECRET || "your-secret-key";

// Create a helper function to get the widget id from params
async function getSiteId(
  paramsPromise: Promise<{ id: string }>
): Promise<string> {
  const { id } = await paramsPromise;
  return id;
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Use the helper function to get the id
    const siteId = await getSiteId(context.params);

    if (!siteId) {
      return NextResponse.json(
        { error: "Widget ID is required." },
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

    // Fetch the widget with detailed information
    const widget = await prisma.site.findFirst({
      where: {
        id: siteId,
        adminId, // Ensure the widget belongs to the authenticated admin
      },
      include: {
        _count: {
          select: {
            users: true,
            conversations: true,
          },
        },
        users: {
          orderBy: { createdAt: "desc" },
          take: 10, // Limit to most recent 10 users
        },
        conversations: {
          orderBy: { startedAt: "desc" },
          take: 10, // Limit to most recent 10 conversations
          include: {
            user: true,
            _count: {
              select: {
                messages: true,
              },
            },
          },
        },
      },
    });

    if (!widget) {
      return NextResponse.json(
        { error: "Widget not found or access denied." },
        { status: 404 }
      );
    }

    // Get time-based analytics
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));

    const todayConversations = await prisma.conversation.count({
      where: {
        siteId,
        startedAt: {
          gte: startOfToday,
        },
      },
    });

    const todayUsers = await prisma.user.count({
      where: {
        siteId,
        createdAt: {
          gte: startOfToday,
        },
      },
    });

    // Format the response
    const widgetDetails = {
      id: widget.id,
      name: widget.name,
      domain: widget.domain,
      apiKey: widget.apiKey,
      createdAt: widget.createdAt,
      stats: {
        totalUsers: widget._count.users,
        totalConversations: widget._count.conversations,
        todayUsers,
        todayConversations,
      },
      recentUsers: widget.users.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      })),
      recentConversations: widget.conversations.map((convo) => ({
        id: convo.id,
        startedAt: convo.startedAt,
        endedAt: convo.endedAt,
        messageCount: convo._count.messages,
        user: {
          id: convo.user.id,
          name: convo.user.name || "Anonymous",
          email: convo.user.email,
        },
      })),
    };

    return NextResponse.json({ success: true, widget: widgetDetails });
  } catch (error) {
    console.error("[Widget Details API]", error);
    return NextResponse.json(
      { error: "An error occurred while fetching widget details." },
      { status: 500 }
    );
  }
}
