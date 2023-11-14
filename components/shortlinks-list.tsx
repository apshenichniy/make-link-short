"use client";

import { useGetShortlinks } from "@/lib/use-shortlinks";
import { Loader2 } from "lucide-react";

const ShortlinksList = () => {
  const { isPending, data } = useGetShortlinks();

  if (isPending)
    return <Loader2 className="self-center m-6 h-8 w-8 animate-spin" />;

  return <div className="flex flex-col">links list</div>;
};

export { ShortlinksList };
