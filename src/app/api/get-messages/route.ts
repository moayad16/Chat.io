import { db } from "@/lib/db";
import { messages } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest, res: NextResponse) {
  const chatId = req.nextUrl.searchParams.get("chatId");
  
  const _messages = await db
    .select()
    .from(messages)
    .where(eq(messages.chatId, Number(chatId)))
    .orderBy(asc(messages.createdAt));

    // console.log("messages", _messages);
    
    
    return NextResponse.json({ _messages }, { status: 200 });
}
