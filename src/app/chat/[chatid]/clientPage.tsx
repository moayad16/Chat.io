"use client";
import { drizzleChat } from "@/lib/db/schema";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import SideBar from "@/components/sideBar";
import PdfViewer from "@/components/pdfViewer";
import Chat from "@/components/chat";
import React, { useEffect, useState } from "react";
import axios from "axios";

type Props = {
  chatId: number;
  chats: drizzleChat[];
  currentChat: drizzleChat | undefined;
  userId: string;
};

export default function ClientChatPage({
  chatId,
  chats,
  currentChat,
  userId,
}: Props) {
  const [uiState, setUiState] = useState({
    sideBarOpen: true,
    pdfViewerOpen: true,
  });
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    window.innerWidth < 1024 &&
      setUiState({ ...uiState, sideBarOpen: false, pdfViewerOpen: false });
    axios
      .get(`/api/get-presigned-url?fileKey=${currentChat?.fileKey}`)
      .then((res) => {
        setUrl(res.data.encodedUrl);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="flex bg-chat-bg p-4 flex-row h-screen w-screen">
      <div
        className={`lg:relative lg:h-full flex transition-all duration-200 ${
          uiState.sideBarOpen
            ? "w-screen h-screen lg:w-1/5 absolute top-0 left-0 z-50"
            : "relative w-0 lg:w-0"
        }`}
      >
        <SideBar chatId={chatId} chats={chats} />
        <div className={`${(uiState.sideBarOpen && typeof window !== "undefined" && window.innerWidth< 1024) && "right-5 top-5"} absolute top-1/2 -right-10 cursor-pointer hover:scale-125 transition-all duration-200 z-1`}>
          {uiState.sideBarOpen ? (
            <ArrowLeftCircle
              onClick={() =>
                setUiState({
                  ...uiState,
                  sideBarOpen: !uiState.sideBarOpen,
                })
              }
              className="bg-sideBar-bg rounded-full"
            />
          ) : (
            <ArrowRightCircle
              onClick={() =>
                setUiState({
                  ...uiState,
                  sideBarOpen: !uiState.sideBarOpen,
                })
              }
              className="bg-transparent"
            />
          )}
        </div>
      </div>
      <div
        className={`mx-auto lg:max-w-screen-lg lg:w-2/5 flex justify-center items-center flex-grow transition-all duration-200 flex-shring`}
      >
        <Chat fileKey={currentChat?.fileKey || ""} />
      </div>
      <div
        className={`flex lg:relative lg:h-full transition-all duration-200 ${
          uiState.pdfViewerOpen
            ? "w-screen h-screen lg:w-2/5 absolute top-0 right-0 z-10"
            : "relative w-0 lg:w-0"
        }`}
      >
        <div className={`${(uiState.pdfViewerOpen && typeof window !== "undefined" && window.innerWidth < 1024) && "left-5 top-5 rounded-full"} absolute top-1/2 -left-10 cursor-pointer hover:scale-125 transition-all duration-200 z-10`}>
          {uiState.pdfViewerOpen ? (
            <ArrowRightCircle
              onClick={() =>
                setUiState({
                  ...uiState,
                  pdfViewerOpen: !uiState.pdfViewerOpen,
                })
              }
              className="bg-sideBar-bg rounded-full"
            />
          ) : (
            <ArrowLeftCircle
              onClick={() =>
                setUiState({
                  ...uiState,
                  pdfViewerOpen: !uiState.pdfViewerOpen,
                })
              }
            />
          )}
        </div>
        {url && <PdfViewer url={url} />}
        {/* <PdfViewer url={url} /> */}
      </div>
    </div>
  );
}
