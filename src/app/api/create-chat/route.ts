import { db } from "@/lib/db";
import { loads3IntoPinecone } from "@/lib/db/pinecone";
import { getS3Url } from "@/lib/db/s3";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {

  const {userId} = await auth();

  !(userId) && NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const {fileName, fileKey} = body
    await loads3IntoPinecone(fileKey);
    const chatId = await db.insert(chats).values({
      fileKey: fileKey,
      pdfName: fileName,
      pdfUrl: getS3Url(fileKey),
      userId: userId as string,
    }).returning({
      insertedId: chats.id
    })
  
    return NextResponse.json({ chatId: chatId[0].insertedId }, { status: 201 });

  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "Error Creating Chat" }, { status: 500 });
  }
}
