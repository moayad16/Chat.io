"use client";
import React from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { LoaderCircle } from "lucide-react";

type Props = {
  isPro: boolean;
};

export default function SubButton({ isPro }: Props) {
    const [loading, setLoading] = React.useState(false);
    const handleClick = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/stripe`);
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
    <button className="bg-gradient-to-r from-indigo-600 to-blue-500 text-base hover:scale-105 transition-all duration-200 font-bold h-10 flex items-center xl:w-56 w-full rounded-lg mb-4 p-2 justify-center" onClick={handleClick}>
        {loading? <LoaderCircle className="animate-spin"/>: isPro? "Manage Subscription": "Upgrade to Pro"}
    </button>
  );
}
