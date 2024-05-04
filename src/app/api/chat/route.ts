"use server";

import { getContext } from "@/lib/context";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { runtime } from "./config";
import { db } from "@/lib/db";
import { messages as _messages } from "@/lib/db/schema";

const model = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

const buildGoogleGenAIPrompt = (messages: Message[]) => ({
  contents: messages
    .filter((message) => message.role === "user" || message.role === "system")
    .map((message) => ({
      role: message.role === "user" ? "user" : "model",
      parts: [{ text: `${message.content}` }],
    })),
});

export async function POST(req: NextRequest, res: NextResponse) {
  if (process.env.VERCEL_ENV === "production" && process.env.VERCEL_REGION) {
    console.log("this is probably an edge function");
  } else {
    console.log("this is endpoint is running on the main server");
  }

  const { messages, fileKey, chatId } = await req.json();
  const lastMessage = messages[messages.length - 1];
  const context = await getContext(lastMessage.content, fileKey);
  const prompt = {
    role: "assistant",
    parts: [
      {
        text: `AI assistant is a brand new, powerful, human-like artificial intelligence.
    The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
    AI is a well-behaved and well-mannered individual.
    AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
    AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic.
    Al assistant is a big fan of Pinecone and Vercel.
    START CONTEXT BLOCK
    ${context}
    END OF CONTEXT BLOCK
    AI assistant will take into account any CONTEXT BLOCK (which is a part of a pdf document) that is provided in a conversation.
    AI assistant will only provide information that is directly related to the context block.
    If the context block is not provided, AI assistant will act as a normal generative AI.
    AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
    AI assistant will not invent anything that is not drawn directly from the context block.
    AI assistant should only take this text as context for the conversation.
    `,
      },
    ],
  };

  const generativeModel = model.getGenerativeModel({
    model: "gemini-1.5-pro-latest",
    systemInstruction: prompt,
  });

  const geminiStream = await generativeModel.generateContentStream(
    buildGoogleGenAIPrompt(messages)
  );
  const stream = GoogleGenerativeAIStream(geminiStream, {
    onStart: async () => {
      await db.insert(_messages).values({
        chatId,
        role: "user",
        content: lastMessage.content,
      })
    },
    onCompletion: async (completion) => {
      await db.insert(_messages).values({
        chatId,
        role: "system",
        content: completion,
      })
    }
  });

  return new StreamingTextResponse(stream);
}
