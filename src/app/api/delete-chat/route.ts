import { db } from "@/lib/db";
import { getPinecone } from "@/lib/db/pinecone";
import { deletePdfFromS3 } from "@/lib/db/s3Server";
import { chats, messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, res: NextResponse) {
  const chatId = req.nextUrl.searchParams.get("chatId");
  const fileKey = req.nextUrl.searchParams.get("fileKey");

  if (!chatId || !fileKey) {
    return NextResponse.json(
      { message: "ChatId and fileKey are required" },
      { status: 400 }
    );
  }

  try {
    //delete the messages of the chat first
    await db.delete(messages).where(eq(messages.chatId, Number(chatId)));
    // delete the chat
    await db.delete(chats).where(eq(chats.id, Number(chatId)));
    // delete the vectore embeddings from the pinecone db
    const pinecone = getPinecone();
    const index = pinecone.index("chat-io");
    await index.namespace(fileKey).deleteAll();
    // delet the pdf from s3
    await deletePdfFromS3(fileKey);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Problem occured when deleting chat" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Chat deleted" }, { status: 200 });
}
