"use client";
import React from "react";
import { Inbox, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { uploadPdf } from "@/lib/db/s3";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function FileUpload() {
  const [loading, isLoading] = React.useState(false);
  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: async ({
      fileKey,
      fileName,
    }: {
      fileKey: string;
      fileName: string;
    }) => {
      const res = await axios.post("/api/create-chat", { fileKey, fileName });
      return res.data;
    },
  });

  const { getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      isLoading(true);
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size should be less than 10MB");
        return;
      }

      const data: { fileName: string; fileKey: string } = (await uploadPdf(
        file
      )) ?? { fileName: "", fileKey: "" };
      if (!data.fileKey || !data.fileName) {
        toast.error("Error uploading file");
        isLoading(false);
        return;
      } else {
        isLoading(false);
        mutate(data, {
          onSuccess: ({chatId}) => {
            toast.success("Chat Created Successfully");
            router.push(`/chat/${chatId}`);

          },
          onError: (error) => {
            console.log(error);
            toast.error("Error creating chat");
          },
        });
      }
    },
  });

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="bg-white xl:w-1/2 w-5/6 p-2 rounded-2xl min-h-40 flex items-center justify-center">
        {loading ? (
          <div className="flex items-center justify-center flex-col">
            <Loader2 className="h-16 w-16 text-gray-300 animate-spin" />
            <p className="mt-2 text-sm text-gray-400">Uploading Your File...</p>
          </div>
        ) : (
          <label
            className="cursor-pointer hover:bg-gray-200 transition-all duration-200 text-gray-500 border-dashed border-2 rounded-xl flex flex-col justify-center items-center min-h-40 w-full"
            htmlFor="file"
          >
            <Inbox className="m-0" size={90} color="gray" />
            Drop PDF Here
          </label>
        )}
        <input
          {...getInputProps()}
          className="hidden"
          id="file"
          name="file"
          type="file"
        />
      </div>
    </div>
  );
}
