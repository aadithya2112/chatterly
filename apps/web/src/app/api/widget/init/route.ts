import { NextResponse } from "next/server";
import { prismaClient as prisma } from "@repo/db/client";
import { nanoid } from "nanoid";

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { apiKey } = body;

    // Validate the API key
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      );
    }

    // Check if the API key exists in the database
    const site = await prisma.site.findUnique({
      where: { apiKey },
    });

    if (!site) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    // Generate a unique session ID for the user
    const sessionId = nanoid();

    // Store the session in the database (if required)
    await prisma.user.create({
      data: {
        sessionId,
        siteId: site.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Return the session ID
    return NextResponse.json({
      message: "Session initialized successfully",
      sessionId,
    });
  } catch (error: any) {
    console.error("Error initializing widget session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
