"use client";
import React from "react";
import { GoHome, GoHomeFill, GoSearch, GoPlus } from "react-icons/go";
import { CiUser } from "react-icons/ci";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dancing_Script } from "next/font/google";

const appTitleFont = Dancing_Script({ subsets: ["latin"] });

const Sidebar = () => {
  const currentPath = usePathname();
  return (
    <>
      <div className="block md:hidden fixed top-0 w-full bg-background border-b-[1px] py-1 px-3">
        <h1 className={`text-4xl font-extrabold ${appTitleFont.className}`}>
          Cravish
        </h1>
      </div>
      <div className="block md:hidden fixed bottom-0 w-full bg-background border-t-[1px] py-3 px-10">
        <div className="flex justify-between">
          <Link href={"/"}>
            {currentPath === "/" ? (
              <GoHomeFill size={30} />
            ) : (
              <GoHome size={30} />
            )}
          </Link>
          <Link href={"/search"}>
            <GoSearch
              size={30}
              className={`${currentPath === "/search" ? "stroke-1" : ""}`}
            />
          </Link>
          <Link href={"/create"}>
            <GoPlus
              size={32}
              className={`${currentPath === "/create" ? "stroke-1" : ""}`}
            />
          </Link>
          <Link href={"/"}>
            <CiUser size={30} className="stroke-[0.3px]" />
          </Link>
        </div>
      </div>
      <div className="border-r-2 border-slate-400 w-56 h-screen hidden md:block fixed">
        <div className="p-6 w-full">
          <h1 className={`text-4xl font-extrabold ${appTitleFont.className}`}>
            Cravish
          </h1>
        </div>
        <div className="p-6 w-full">
          <div className="flex flex-col gap-6">
            <Link
              href={"/"}
              className={`text-lg flex items-start gap-3 ${
                currentPath === "/" ? "font-bold" : ""
              }`}
            >
              {currentPath === "/" ? (
                <GoHomeFill size={26} />
              ) : (
                <GoHome size={26} />
              )}
              Home
            </Link>

            <Link
              href={"/search"}
              className={`text-lg flex items-start gap-3 ${
                currentPath === "/search" ? "font-bold" : ""
              }`}
            >
              <GoSearch
                size={26}
                className={`${currentPath === "/search" ? "stroke-1" : ""}`}
              />
              Search
            </Link>

            <Link
              href={"/create"}
              className={`text-lg flex items-start gap-3 ${
                currentPath === "/create" ? "font-bold" : ""
              }`}
            >
              <GoPlus
                size={28}
                className={`${currentPath === "/create" ? "stroke-1" : ""}`}
              />
              Create
            </Link>
          </div>
        </div>
        <div className="p-6 absolute bottom-0">
          <Link href={"/"} className="text-lg flex items-start gap-3">
            <CiUser size={26} className="stroke-[0.3px]" />
            Profile
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
