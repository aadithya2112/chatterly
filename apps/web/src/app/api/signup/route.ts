import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prismaClient as prisma } from "@repo/db/client";

// Environment variables (ensure you add these to .env file)
const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    // Check if the admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { message: "Admin with this email already exists." },
        { status: 400 }
      );
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the admin in the database
    const newAdmin = await prisma.admin.create({
      data: {
        email,
        name,
        passwordHash: hashedPassword,
      },
    });

    // Generate a JWT
    const token = jwt.sign(
      {
        id: newAdmin.id,
        email: newAdmin.email,
        name: newAdmin.name,
      },
      JWT_SECRET
    );

    // Return the JWT
    return NextResponse.json({ token }, { status: 201 });
  } catch (error) {
    console.error("Error during signup:", error);
    return NextResponse.json(
      { message: "Internal Server Error." },
      { status: 500 }
    );
  }
}
