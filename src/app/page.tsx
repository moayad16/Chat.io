import Link from "next/link";
import TopBar from "../components/topbar";
import { ArrowRight } from "lucide-react";
import { auth } from "@clerk/nextjs";
import { LogIn, } from "lucide-react";
import FileUpload from "@/components/fileUpload";
import { checkSub } from "@/lib/subscription";
import SubButton from "@/components/subButton";

export default async function Home() {
  const { userId } = await auth();
  const isPro = await checkSub();
  

  return (
    <div className="cont flex flex-grow flex-col">
      <TopBar />
      <div className="xl:pt-20 pt-60 text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <h1 className="text-5xl font-bold mb-3">Chat.io</h1>
        <h2 className="text-2xl  mb-2 w-screen px-2">
          Upload your PDF documents and start chatting with them
        </h2>
        <p className="text-sm mb-2 text-slate-600 px-2">
          Join Millions of students, reasearchers and proffesionals who use
          Chat.io to instantly get answers and chat with their documents using
          AI
        </p>
        {userId ? (
          <div>
            <div className="pl-8 pr-8 w-full h-fit flex flex-col items-center justify-center sm:flex-row">
              <Link
                className="lg:mr-3 bg-white text-lg hover:bg-black hover:text-white transition-all duration-200 font-bold text-slate h-10 flex items-center xl:w-56 w-full rounded-lg mb-4 p-2 xl:justify-between justify-center"
                href="/chat"
              >
                Goto Chats <ArrowRight className="ml-10" />
              </Link>
              <SubButton isPro={isPro} />
            </div>
            <FileUpload/>
          </div>
        ) : (
          <div className="pl-8 pr-8 w-full h-fit flex flex-col items-center justify-center sm:flex-row">
            <Link
              className="xl:mr-3 bg-white text-base text-slate hover:bg-black hover:text-white transition-all duration-200 font-bold h-10 flex items-center xl:w-56 w-full rounded-lg mb-4 p-2 justify-center"
              href="/sign-in"
            >
              Login
              <LogIn className="ml-2" />
            </Link>
            <Link
              className="bg-white text-base text-slate hover:bg-black hover:text-white transition-all duration-200 font-bold h-10 flex items-center xl:w-56 w-full rounded-lg mb-4 p-2 justify-center"
              href="/sign-up"
            >
              Sign Up
            </Link>
          </div>
        )}
        <div className="flex w-screen justify-center items-center">
          <img
            src="/Conversational-AI-chat-vs-Traditional-chat-removebg-preview.png"
            alt="chat"
          />
        </div>
      </div>
    </div>
  );
}
