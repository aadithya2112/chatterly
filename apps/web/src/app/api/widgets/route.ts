import { NextResponse } from "next/server";
import { prismaClient as prisma } from "@repo/db/client";
import jwt from "jsonwebtoken";
import { jsonToken } from "@/app/types/token";

const SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET(req: Request) {
  try {
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
        { error: "Unable to associate admin with widgets." },
        { status: 401 }
      );
    }

    // Fetch widgets associated with the admin
    const widgets = await prisma.site.findMany({
      where: { adminId },
      select: {
        id: true,
        name: true,
        domain: true,
        apiKey: true,
        createdAt: true,
        conversations: true,
        _count: {
          select: {
            users: true,
            conversations: true,
          },
        },
      },
    });

    // Transform the data to include user count in a more accessible format
    const transformedWidgets = widgets.map((widget) => ({
      id: widget.id,
      name: widget.name,
      domain: widget.domain,
      apiKey: widget.apiKey,
      createdAt: widget.createdAt,
      conversations: widget.conversations,
      userCount: widget._count.users,
      conversationCount: widget._count.conversations,
    }));

    return NextResponse.json({ success: true, widgets: transformedWidgets });
  } catch (error) {
    console.error("[Fetch Widgets API]", error);
    return NextResponse.json(
      { error: "An error occurred while fetching widgets." },
      { status: 500 }
    );
  }
}
