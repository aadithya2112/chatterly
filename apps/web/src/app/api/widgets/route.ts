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
        conversations: true, // Assuming conversations are related data
      },
    });

    return NextResponse.json({ success: true, widgets });
  } catch (error) {
    console.error("[Fetch Widgets API]", error);
    return NextResponse.json(
      { error: "An error occurred while fetching widgets." },
      { status: 500 }
    );
  }
}
