"use client";
import Link from "next/link";
import React, {useState, useEffect} from "react";
import { UserButton } from "@clerk/nextjs";
import { ArrowLeftCircle, ArrowRightCircle, MessageCircle, PlusCircle, X } from "lucide-react";
import { drizzleChat } from "@/lib/db/schema";

type Props = {
  chats: drizzleChat[];
  chatId: number;
};

export default function SideBar({ chats, chatId }: Props) {
    const [open, setOpen] = useState(true)

    useEffect(() => {
        if(window.innerWidth <= 768) {
            setOpen(false)
        }
    },[])

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
        <div className="mb-auto h-full overflow-y-auto overflow-x-hidden pr-2">
          <ul>
            {chats.map((chat) => {
              return (
                <Link key={chat.id} href={`/chat/${chat.id}`}>
                  <li
                    className={`${
                      chat.id === chatId ? "bg-li-bg" : "bg-side-text"
                    } my-2 h-10  font-bold rounded-lg flex items-center p-4 cursor-pointer hover:translate-x-2 transition-all duration-200`}
                  >
                    <MessageCircle className="mr-2" />
                    {chat.pdfName}
                  </li>
                </Link>
              );
            })}
          </ul>
        </div>
      </div>
      <div
        className="mt-auto min-h-12 flex items-center pr-5 "
        style={{ boxShadow: "0 -10px 6px -5px rgba(0, 0, 0, 1)" }}
      >
        <div className="ml-auto flex items-center ">
          <UserButton />
        </div>
      </div>
    </div>
  );
}
