import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import ClientChatPage from "../../../components/clientPage";
import { checkSub } from "@/lib/subscription";

type Props = {
  params: {
    chatid: string;
  };
};

export default async function chatPage({ params: { chatid } }: Props) {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
  if (!_chats) {
    return redirect("/");
  }

  if (!_chats.find((chat) => chat.id === parseInt(chatid))) {
    return redirect("/");
  }

  const currentChat = _chats.find((chat) => chat.id === parseInt(chatid));
  const isPro = await checkSub();

  return (
    <ClientChatPage
      isPro={isPro}
      chatId={parseInt(chatid)}
      chats={_chats}
      currentChat={currentChat}
      userId={userId}
    />
  );
}
