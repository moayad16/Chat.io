"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import { MessageCircle, PlusCircle, Trash2, X } from "lucide-react";
import { drizzleChat } from "@/lib/db/schema";
import DeleteConfirmation from "./deleteConfirmation";

type Props = {
  chats: drizzleChat[];
  chatId: number;
};

export default function SideBar({ chats, chatId }: Props) {
  const [chatIdToDelete, setChatIdToDelete] = useState<number | null>(null);
  const [overFlowed, setOverFlowed] = useState<boolean>(false);

  useEffect(() => {
    const chatList = document.getElementById("chats-list");
    if (chatList) {
      setOverFlowed(chatList.scrollHeight > chatList.clientHeight);
    }
  }, [chats]);

  return (
    <div className="bg-sideBar-bg flex lg:pt-0 pt-10 flex-col h-full w-full overflow-hidden lg:rounded-xl">
      <div className="p-5">
        <div className="mb-2">
          <Link
            className="w-full h-16 rounded-xl border-dashed border-2 border-white flex items-center justify-center hover:scale-95 transition-all duration-200 font-bold"
            href="/"
          >
            Create New Chat <PlusCircle className="ml-2" />
          </Link>
        </div>
        <div id="chats-list" className="mb-auto h-full overflow-y-auto overflow-x-hidden pr-2">
          <ul>
            {chats.map((chat, index) => {
              return (
                <div key={chat.id} className="h-50 my-4 transition-all duration-500">
                  <li
                    className={`${
                      chat.id === chatId ? "bg-li-bg" : "bg-side-text"
                    } h-12 font-bold rounded-lg flex items-center p-4 pr-0 cursor-pointer hover:translate-x-2 transition-all duration-200`}
                  >
                    <Link className="flex" href={`/chat/${chat.id}`}>
                      <MessageCircle className="mr-2" />
                      {chat.pdfName}
                    </Link>
                    <button className={`h-12 ml-auto transition-all duration-200 border-0 border-l-2 rounded-tl-none rounded-bl-none rounded-lg ${chatIdToDelete === chat.id? "hover:bg-green-700" : "hover:bg-red-700"} p-2`}>
                      {chatIdToDelete === chat.id ? (
                        <X onClick={() => setChatIdToDelete(null)} />
                      ) : (
                        <Trash2 onClick={() => setChatIdToDelete(chat.id)} />
                      )}
                    </button>
                  </li>
                  <DeleteConfirmation
                    chatId={chat.id}
                    chatName={chat.pdfName}
                    visible={chatIdToDelete === chat.id ? true : false}
                    // visible={index === 0? true: false}
                    // visible={true}
                    fileKey={chat.fileKey}
                  />
                </div>
              );
            })}
          </ul>
        </div>
      </div>
      <div
        className="mt-auto min-h-12 flex items-center pr-2 "
        style={{ boxShadow: overFlowed? "0 -10px 6px -5px rgba(0, 0, 0, 1)" : ""}}
      >
        <div className="ml-auto flex items-center ">
          <UserButton />
        </div>
      </div>
    </div>
  );
}
