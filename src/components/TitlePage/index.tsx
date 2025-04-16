import React, { FC } from "react";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
interface ITitlePage {
  title: string;
}

export const TitlePage: FC<ITitlePage> = ({ title }) => {
  return (
    <div className="flex justify-between mt-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      <Link
        className=" rounded-full p-1 grid place-items-center hover:bg-zinc-300/75 dark:hover:bg-zinc-300/60 transition duration-300 ease-in-out"
        href="/dashboard"
      >
        <ArrowLeft />
      </Link>
    </div>
  );
};
