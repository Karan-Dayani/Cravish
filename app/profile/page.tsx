"use client";
import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { getCurrUser } from "../api/api";
// import { getUserByMail } from "../api/api";
import Image from "next/image";
import { Inter } from "next/font/google";
import { IoIosLogOut } from "react-icons/io";
import { redirect } from "next/navigation";

const InterFont = Inter({ subsets: ["latin"], weight: "400" });

interface User {
  name: string;
  email: string;
  image: string;
}

export default function Profile() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/signIn");
    }
  }, [status]);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await getCurrUser();

      if (response) {
        if ("success" in response) {
          setUser(response.success.user);
        } else if ("error" in response) {
          setUser(null);
        }
      }
    };

    // const fetchUserByEmail = async () => {
    //   const response = await getUserByMail(session?.user?.email as string);
    //   if (response) {
    //     console.log(response);
    //   }
    // };

    if (session) {
      fetchUser();
      // fetchUserByEmail();
    }
  }, [session]);

  if (status === "loading") {
    // While the session is being resolved, show a loading state
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-10">
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-3 lg:gap-0">
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-10 items-center lg:items-start">
          {user?.image ? (
            <Image
              src={user?.image as string}
              alt="user-img"
              height={150}
              width={150}
              className="rounded-lg"
              priority
            />
          ) : (
            <></>
          )}

          <div className="flex flex-col items-center lg:items-start gap-0 lg:gap-2">
            <h1 className={`text-2xl lg:text-4xl ${InterFont.className}`}>
              {user?.name}
            </h1>
            <h1 className={`text-sm lg:text-md ${InterFont.className}`}>
              {user?.email}
            </h1>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="bg-red-400 p-2 rounded-lg block lg:hidden absolute right-4 top-14"
        >
          <IoIosLogOut size={20} />
        </button>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="bg-red-400 p-3 rounded-lg hidden lg:flex items-center gap-3"
        >
          Sign Out
          <IoIosLogOut size={22} />
        </button>
      </div>
    </div>
  );
}
