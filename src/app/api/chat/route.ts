"use server";

import { getContext } from "@/lib/context";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { runtime } from "./config";

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

  const { messages, fileKey } = await req.json();
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
    // content: `
    // This paragraph is a prompt for the AI model to generate a response to the user.
    // This AI model should act as a human-like assistant that can provide helpful, clever, and articulate responses to the user.
    // The AI model should be able to provide vivid and thoughtful responses to the user.
    // The AI model is always friendly, helpfull, inspiring and well mannered individual.
    // The AI model should take into consideration the context block provided as a knowledge background from which questions will be answered.
    // The AI model should not invent anything that is not drawn directly from the context block if the context block is provided.
    // If the context block is not provided or Empty, the AI model should provide the answer to question to the best of its knowledge.
    // If the context block is provided, the AI model should draw the answer to the question from the context block and only provide information that is directly related to the context block.
    // The context block is a part of an pdf document that the user has previously uploaded.
    // START CONTEXT BLOCK
    // ${context}
    // END OF CONTEXT BLOCK
    // `
  };

  console.log(buildGoogleGenAIPrompt(messages.concat(prompt)));
  console.log(
    "prompt: ", prompt.parts.map((part) => part.text).join("\n")
  );
  
  const generativeModel = model.getGenerativeModel({
    model: "gemini-1.5-pro-latest",
    systemInstruction: prompt,
  });

  const geminiStream = await generativeModel.generateContentStream(
    buildGoogleGenAIPrompt(messages)
  );
  const stream = GoogleGenerativeAIStream(geminiStream);

  return new StreamingTextResponse(stream);
}
