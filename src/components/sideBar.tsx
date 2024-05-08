"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import {
  CornerRightUp,
  LoaderCircle,
  MessageCircle,
  PlusCircle,
  Trash2,
  X,
} from "lucide-react";
import { drizzleChat } from "@/lib/db/schema";
import DeleteConfirmation from "./deleteConfirmation";
import axios from "axios";
import toast from "react-hot-toast";

type Props = {
  chats: drizzleChat[];
  chatId: number | null;
  userId: string;
  isPro: boolean;
};

export default function SideBar({ isPro, chats, chatId, userId }: Props) {
  const [chatIdToDelete, setChatIdToDelete] = useState<number | null>(null);
  const [overFlowed, setOverFlowed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const chatList = document.getElementById("chats-list");
    if (chatList) {
      setOverFlowed(chatList.scrollHeight > chatList.clientHeight);
    }
  }, [chats]);

  const handleClick = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/stripe?userId=${userId}`);
      window.location.href = res.data.url;
    } catch (error) {
      setLoading(false);
      toast.error(
        "An error occured while trying to upgrade to Pro! Please try again later"
      );
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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
        <div
          id="chats-list"
          className="mb-auto h-full overflow-y-auto overflow-x-hidden pr-2"
        >
          <ul>
            {chats.length !== 0 ? (
              chats.map((chat, index) => {
                return (
                  <div
                    key={chat.id}
                    className="h-50 my-4 transition-all duration-500"
                  >
                    <li
                      className={`${
                        chat.id === chatId ? "bg-li-bg" : "bg-side-text"
                      } h-12 font-bold rounded-lg flex items-center p-4 pr-0 cursor-pointer hover:translate-x-2 transition-all duration-200`}
                    >
                      <Link className="flex" href={`/chat/${chat.id}`}>
                        <MessageCircle className="mr-2" />
                        {chat.pdfName}
                      </Link>
                      <button
                        className={`h-12 ml-auto transition-all w-1/6 duration-200 border-0 border-l-2 rounded-tl-none rounded-bl-none rounded-lg ${
                          chatIdToDelete === chat.id
                            ? "hover:bg-green-500"
                            : "hover:bg-red-500"
                        }`}
                      >
                        {chatIdToDelete === chat.id ? (
                          <X
                            className="w-full p-2 h-full rounded-tr-lg rounded-br-lg"
                            onClick={() => setChatIdToDelete(null)}
                          />
                        ) : (
                          <Trash2
                            className="w-full p-2 h-full rounded-tr-lg rounded-br-lg"
                            onClick={() => setChatIdToDelete(chat.id)}
                          />
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
              })
            ) : (
              <div className="flex mt-4 flex-col items-center justify-center h-full">
                <CornerRightUp className="stroke-gray-400" />
                <p className="text-gray-400 text-lg">Create a New Chat Now!</p>
              </div>
            )}
          </ul>
        </div>
      </div>
      <div
        className="mt-auto min-h-12 flex justify-between ml-2.5 mb-2 items-center pr-2 "
        style={{
          boxShadow: overFlowed ? "0 -10px 6px -5px rgba(0, 0, 0, 1)" : "",
        }}
      >
        {!isPro ? (
          <button
            onClick={handleClick}
            className={`bg-gradient-to-r w-36 flex justify-center ${
              !loading && "animate-bounce"
            } from-indigo-700 to-blue-500 font-bold rounded-lg p-2 transition-all duration-200 hover:scale-105`}
            disabled={loading}
          >
            {loading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              "Upgrage to Pro!"
            )}
          </button>
        ) : (
          <h1 className="-mb-4 ml-2 text-xl bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-yellow-100 to-yellow-600">
            PRO
          </h1>
        )}
        <div className="ml-auto flex items-center">
          <UserButton />
        </div>
      </div>
    </div>
  );
}
