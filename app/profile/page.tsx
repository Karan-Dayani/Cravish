"use client";
import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Inter } from "next/font/google";
import { IoIosLogOut } from "react-icons/io";
import { redirect } from "next/navigation";
import { getUserIdByMail, getUsersRecipes, Recipe } from "../api/api";
import FlatList from "flatlist-react/lib";
import { LuHeart } from "react-icons/lu";

const InterFont = Inter({ subsets: ["latin"], weight: "400" });

function Posts({ userId }: { userId: string }) {
  const [yourRecipes, setYourRecipes] = useState<Recipe[] | null>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getRecipes = async () => {
      setIsLoading(true); // Start loading
      try {
        const res = await getUsersRecipes(userId as string);
        setYourRecipes(res);
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
      } finally {
        setIsLoading(false); // End loading
      }
    };

    if (userId) {
      getRecipes();
    }
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex justify-center w-full p-8">
        <div
          className="loader border-t-2 rounded-full border-gray-500 bg-gray-300 animate-spin
        aspect-square w-6 flex justify-center items-center text-yellow-700"
        ></div>
      </div>
    );
  }

  // if (!yourRecipes || yourRecipes.length === 0) {
  //   return (
  //     <div>
  //       <h1>No recipes found.</h1>
  //     </div>
  //   );
  // }

  return (
    <div className="pt-4">
      {/* <h1>Your Recipes</h1>
        <p>User ID: {userId}</p> */}
      <div className="flex md:justify-start w-full">
        <div className="flex justify-center flex-wrap gap-1">
          <FlatList
            list={yourRecipes ? yourRecipes : []}
            renderItem={(item, i) => (
              <div key={i} className="relative group">
                <div className="group-hover:brightness-75">
                  <Image
                    src={item.img}
                    alt="res-img"
                    width={150}
                    height={150}
                    className="h-[120px] w-[120px] md:h-[200px] md:w-[200px] object-cover"
                  />
                </div>
                <div className="absolute bottom-0 right-1 md:opacity-0 group-hover:opacity-100">
                  <div className="text-white flex items-center gap-2 text-2xl">
                    <LuHeart className="fill-white" /> {item.likes}
                  </div>
                </div>
              </div>
            )}
            renderWhenEmpty={() => <h1>You got Nothing</h1>}
            renderOnScroll
          />
        </div>
      </div>
    </div>
  );
}

function LikedRecipes() {
  return (
    <div>
      <h1>Liked recipes</h1>
    </div>
  );
}

export default function Profile() {
  const { data: session, status } = useSession();
  const [userId, setUserId] = useState<string>();
  const [activeTab, setActiveTab] = useState<string>("posts");

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/signIn");
    }
  }, [status]);

  useEffect(() => {
    const getUserId = async () => {
      const res = await getUserIdByMail(session?.user?.email as string);
      setUserId(res?._id);
    };
    if (session) {
      getUserId();
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

  const renderActiveTab = () => {
    switch (activeTab) {
      case "posts":
        return <Posts userId={userId || ""} />;
      case "liked":
        return <LikedRecipes />;
      default:
        return null;
    }
  };

  return (
    <div className="pt-10 md:px-10">
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-3 lg:gap-0">
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-10 items-center lg:items-start">
          {session?.user?.image ? (
            <Image
              src={session?.user?.image as string}
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
              {session?.user?.name}
            </h1>
            <h1 className={`text-sm lg:text-md ${InterFont.className}`}>
              {session?.user?.email}
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

      <div className="pt-6">
        <div className="">
          <div className="flex justify-around">
            <button
              onClick={() => setActiveTab("posts")}
              className={`py-2 border-b-4 transition-colors duration-300 w-full ${
                activeTab === "posts"
                  ? "border-teal-500"
                  : "border-transparent hover:border-gray-200"
              }`}
            >
              <h1
                className={`text-lg duration-300 transition-opacity ${
                  activeTab === "posts" ? "opacity-100" : "opacity-50"
                }`}
              >
                Posts
              </h1>
            </button>
            <button
              onClick={() => setActiveTab("liked")}
              className={`py-2 border-b-4 transition-colors duration-300 w-full ${
                activeTab === "liked"
                  ? "border-teal-500"
                  : "border-transparent hover:border-gray-200"
              }`}
            >
              <h1
                className={`text-lg duration-300 transition-opacity ${
                  activeTab === "liked" ? "opacity-100" : "opacity-50"
                }`}
              >
                Liked
              </h1>
            </button>
          </div>
          <div className="w-full">{renderActiveTab()}</div>
        </div>
      </div>
    </div>
  );
}
