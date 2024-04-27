import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";
import SideBar from "@/components/sideBar";
import { ArrowRightCircle, ArrowLeftCircle } from "lucide-react";
import PdfViewer from "@/components/pdfViewer";
import Chat from "@/components/chat";

type Props = {
  params: {
    chatId: string;
  };
};

export default async function chatPage({ params: { chatId } }: Props) {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
  if (!_chats) {
    return redirect("/");
  }

  if (!_chats.find((chat) => chat.id === parseInt(chatId))) {
    return redirect("/");
  }

  const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));  
  


  return (
    <div className="flex bg-chat-bg p-4 flex-row h-screen w-screen">
      <div className="lg:w-1/5 relative flex ">
        <SideBar chatId={parseInt(chatId)} chats={_chats} />
        <div className="absolute top-1/2 -right-10 cursor-pointer hover:scale-125 transition-all duration-200 z-10">
          {/* <ArrowRightCircle className="bg-sideBar-bg" /> */}
          <ArrowLeftCircle className="bg-sideBar-bg" />
        </div>
      </div>
      <div className="mx-auto w-2/5 flex justify-center items-center">
        <Chat />
      </div>
      <div className="flex relative lg:w-2/5">
        <div className="absolute top-1/2 -left-10 cursor-pointer hover:scale-125 transition-all duration-200 z-10">
          <ArrowRightCircle className="bg-sideBar-bg" />
          {/* <ArrowLeftCircle className="bg-sideBar-bg" /> */}
        </div>
        <PdfViewer fileKey={currentChat?.fileKey || ""} />
      </div>
    </div>
  );
}
