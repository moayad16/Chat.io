import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";

type Props = {
  fileKey: string;
  chatId: number;
  chatName: string;
  visible: boolean;
};

export default function DeleteConfirmation({
  fileKey,
  chatId,
  chatName,
  visible,
}: Props) {
    const [loading, setLoading] = React.useState<boolean>(false);
  const handleDelete = async () => {
    setLoading(true);
    await axios
      .delete(`/api/delete-chat?chatId=${chatId}&fileKey=${fileKey}`)
      .then((res) => {
        toast.success("Chat deleted successfully");
        setLoading(false);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to delete chat. Please try again later.");
      });
  };

  return (
    <div
      className="w-full mt-2 bg-chat-bg h-0 transition-all duration-200 rounded-lg flex flex-col justify-center items-center"
      style={{
        height: visible ? "100px" : "0",
        opacity: visible ? "1" : "0",
        marginTop: visible ? "0.5rem" : "0",
        padding: visible ? "1rem" : "0",
      }}
    >
      <h1 className="text-center h-1/2">Delete {chatName}?</h1>
      <button
        onClick={handleDelete}
        {...(loading? {disabled: true}: {})}
        className={`w-full m-1 mt-2 h-1/2 bg-red-500 p-2 flex items-center justify-center rounded-lg ${!loading && "hover:bg-red-600"} tranisiont-all duration-200`}
      >
        {loading? <LoaderCircle className="animate-spin"/> :"Yes"}
      </button>
    </div>
  );
}
