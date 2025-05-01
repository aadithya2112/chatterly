import { prismaClient } from "@repo/db/client";

// model User {
//     id            String         @id @default(cuid())
//     sessionId     String         @unique
//     email         String?
//     name          String?
//     metadata      Json?
//     createdAt     DateTime       @default(now())
//     updatedAt     DateTime       @updatedAt
//     siteId        String
//     site          Site           @relation(fields: [siteId], references: [id])
//     conversations Conversation[]
//   }

export async function createUser(
  sessionId: string,
  email: string | null,
  name: string | null,
  metadata: object | null,
  siteId: string
) {
  const user = await prismaClient.user.create({
    data: {
      sessionId,
      email,
      name,
      metadata: metadata ?? undefined,
      siteId,
    },
  });

  return user;
}
