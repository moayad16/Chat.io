import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import TopBar from "@/components/topbar";
import Provider from "@/components/provider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chat.io",
  description: "A chat app for PDF documents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#0583F2",
          colorBackground: "#0F1626",
          colorInputBackground: "#0F1626",
          colorText: "white",
          colorTextOnPrimaryBackground: "white",
        },
        baseTheme: dark,
      }}
    >
      <Provider>
        <html lang="en">
          <body className="flex min-h-screen">{children}</body>
          <Toaster />
        </html>
      </Provider>
    </ClerkProvider>
  );
}
