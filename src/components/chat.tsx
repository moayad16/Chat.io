import { Send } from "lucide-react";
import React from "react";
import { useChat } from "ai/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Message } from "ai";
import toast from "react-hot-toast";

type Props = {
  fileKey: string;
  chatId: number | string;
};

export default function Chat({ fileKey, chatId }: Props) {
  useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
        await axios.get(`/api/get-messages?chatId=${chatId}`)
        .then((res) => {
          setMessages(res.data._messages);
        })
        .catch((err) => {
          toast.error("Failed to fetch messages. Please try again later.")
        });
        return [];
    },
  });

  const { input, handleInputChange, handleSubmit, messages, setMessages } = useChat({
    api: "/api/chat",
    body: {
      fileKey,
      chatId,
    }
  });

  React.useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full lg:px-12 py-5 transition-all duration-200">
      <div
        id="message-container"
        className="h-full w-full overflow-y-auto mb-4 px-2 flex flex-col"
      >
        {messages.map((message, index) => {
          if (message.role !== "user") {
            return (
              <div className="bg-blue-600 h-fit lg:max-w-60% py-2 px-4 mr-auto rounded-xl mb-9 transition-all duration-200">
                {message.content}
              </div>
            );
          } else {
            return (
              <div className="bg-blue-400 lg:max-w-60% w-fit px-4 py-2 rounded-xl mb-9 ml-auto transition-all duraiton-200">
                {message.content}
              </div>
            );
          }
        })}
      </div>
      <div className="mt-auto w-full flex items-center bg-transparent border rounded-xl border-1 border-white px-2">
        <form className="w-full flex items-center py-3" onSubmit={handleSubmit}>
          <textarea
            placeholder="Ask Away!"
            onChange={handleInputChange}
            value={input}
            className="w-full max-h-7 overflow-auto resize-none px-2 bg-transparent focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                const submitEvent = new Event("submit", {
                  bubbles: true,
                  cancelable: true,
                });
                e.currentTarget.form?.dispatchEvent(submitEvent);
                (e.currentTarget as HTMLTextAreaElement).style.height =
                  "1.75rem";
              }
            }}
            onInput={(e) => {
              if ((e.target as HTMLTextAreaElement).value.length === 0) {
                (e.target as HTMLTextAreaElement).style.height = "1.75rem";
              }
              (e.target as HTMLTextAreaElement).style.maxHeight = "400px";
              (e.target as HTMLTextAreaElement).style.height = `${
                (e.target as HTMLTextAreaElement).scrollHeight
              }px`;
            }}
          />
          <button type="submit">
            <Send className="cursor-pointer hover:scale-125 transition-all duration-200" />
          </button>
        </form>
      </div>
    </div>
  );
}
