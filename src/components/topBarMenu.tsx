"use client";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function TopBarMenu() {
  const [isShown, setIsShown] = useState(false);

  const handleToggle = (e: any) => {
    e.stopPropagation();
    const menuCont = document.querySelector(".menuCont");
    menuCont?.classList.toggle("hidden");
  };

  return (
    <div className="flex">
      <span className="ml-auto cursor-pointer" onClick={handleToggle}>
        <Menu size={30} />
      </span>
      <div
        onClick={handleToggle}
        onScroll={handleToggle}
        className="menuCont hidden absolute top-0 left-0 backdrop-blur bg-[rgba(19,27,46,.7)] w-screen h-screen"
      >
        <div className="flex justify-between p-4 bg-slate absolute top-4 right-4 rounded-xl w-5/6 h-1/2">
          <div className=" flex-col justify-center items-center">
            <Link
              href="/chats"
              className="mb-3 font-bold block text-blue-500 hover:text-sky-500"
            >
              Chats
            </Link>
            <Link
              href="/subscription"
              className="mb-3 font-bold block text-blue-500 hover:text-sky-500"
            >
              Manage Subscription
            </Link>
            <Link
              href="/dashboard"
              className="mb-3 font-bold block text-blue-500 hover:text-sky-500"
            >
              Dashboard
            </Link>
          </div>
          <div className="grid">
            <span className="cursor-pointer" onClick={(e) => handleToggle(e)}>
              <X size={30} />
            </span>
            <div className="mt-auto">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
