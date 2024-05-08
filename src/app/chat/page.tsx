import SideBar from "@/components/sideBar";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";
import ClientChatPage from "./[chatId]/clientPage";
import { checkSub } from "@/lib/subscription";

type Props = {};

export default async function Chats ({}: Props) {
  const { userId } = await auth();
  if (!userId) return redirect("/login");
  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
  const isPro = await checkSub();

  return (
    <ClientChatPage
      chats={_chats}
      chatId={null}
      currentChat={undefined}
      userId={userId}
      isPro={isPro}
    />
  );
}
