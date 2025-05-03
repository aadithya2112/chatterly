import { NextResponse } from "next/server";
import { prismaClient as prisma } from "@repo/db/client";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { jsonToken } from "@/app/types/token";

const SECRET = process.env.JWT_SECRET || "your-secret-key";

// Function to validate the domain
// Function to validate the domain with a protocol
function isValidDomain(domain: string): boolean {
  const domainRegex =
    /^(https?:\/\/)([a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/;
  return domainRegex.test(domain);
}

export async function POST(req: Request) {
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
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, SECRET);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid or expired token." },
        { status: 401 }
      );
    }

    const { id } = decodedToken as jsonToken;

    if (!id) {
      return NextResponse.json(
        { error: "Unable to associate admin with the site." },
        { status: 401 }
      );
    }

    const { name, domain } = await req.json();

    if (!name || !domain) {
      return NextResponse.json(
        { error: "Name and domain are required." },
        { status: 400 }
      );
    }

    // Validate the domain
    if (!isValidDomain(domain)) {
      return NextResponse.json(
        { error: "Invalid domain format." },
        { status: 400 }
      );
    }

    // Generate unique API key
    const apiKey = nanoid(32);

    // Save to the database
    const site = await prisma.site.create({
      data: {
        name,
        domain,
        apiKey,
        adminId: id, // Associate with the Admin's ID
      },
    });

    return NextResponse.json({ success: true, apiKey });
  } catch (error) {
    console.error("[Create Site API]", error);
    return NextResponse.json(
      { error: "An error occurred while creating the site." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
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
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, SECRET);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid or expired token." },
        { status: 401 }
      );
    }

    const { id: adminId } = decodedToken as jsonToken;

    if (!adminId) {
      return NextResponse.json(
        { error: "Unable to authenticate admin." },
        { status: 401 }
      );
    }

    // Get the site ID from URL search params
    const url = new URL(req.url);
    const siteId = url.searchParams.get("siteId");

    if (!siteId) {
      return NextResponse.json(
        { error: "Site ID is required." },
        { status: 400 }
      );
    }

    // First check if the site exists and belongs to the admin
    const site = await prisma.site.findFirst({
      where: {
        id: siteId,
        adminId: adminId,
      },
    });

    if (!site) {
      return NextResponse.json(
        { error: "Site not found or you don't have permission to delete it." },
        { status: 404 }
      );
    }

    // Delete all related data - this will cascade due to the schema relationships,
    // but we're doing it explicitly to be safe
    // First delete messages
    await prisma.message.deleteMany({
      where: {
        conversation: {
          siteId: siteId,
        },
      },
    });

    // Then delete conversations
    await prisma.conversation.deleteMany({
      where: {
        siteId: siteId,
      },
    });

    // Delete users associated with this site
    await prisma.user.deleteMany({
      where: {
        siteId: siteId,
      },
    });

    // Finally delete the site
    await prisma.site.delete({
      where: {
        id: siteId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Site deleted successfully.",
    });
  } catch (error) {
    console.error("[Delete Site API]", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the site." },
      { status: 500 }
    );
  }
}
