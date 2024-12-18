"use client";
import React, { useLayoutEffect, useState } from "react";
import { GoSearch } from "react-icons/go";
import { getRecipesBySearch, getUserById } from "../api/api";
import { Recipe, User } from "../interfaces";
import FlatList from "flatlist-react/lib";
import Image from "next/image";
import { LuHeart } from "react-icons/lu";

function ResultItem({ item }: { item: Recipe }) {
  const [creator, setCreator] = useState<User>();
  useLayoutEffect(() => {
    const getCreator = async () => {
      const res = await getUserById(item.userId);
      setCreator(res);
    };
    getCreator();
  }, [item]);
  return (
    <div className="bg-slate-200 rounded-md flex justify-between items-center relative">
      <div className="flex">
        <div className="p-2 md:p-4">
          <Image
            src={item.img}
            alt="img"
            width={100}
            height={100}
            className="h-[100px] md:h-[130px] w-[100px] md:w-[130px] object-cover rounded-lg"
          />
        </div>
        <div className="p-2 md:p-4">
          <h1 className="text-lg">{item.title}</h1>
          <h1 className="text-sm">{creator?.username}</h1>
        </div>
      </div>
      <div className="absolute right-3 bottom-2">
        <div className="p-2 flex items-center gap-1 text-lg text-red-500">
          <LuHeart /> {item.likes}
        </div>
      </div>
    </div>
  );
}

export default function Search() {
  const [prompt, setPrompt] = useState<string>("");
  const [result, setResult] = useState<Recipe[] | null>();

  const getResults = async () => {
    try {
      const res = await getRecipesBySearch(prompt);
      setResult(res);
    } catch (err) {
      console.error("Failed to fetch recipes:", err);
    }
  };

  const handleSearch = () => {
    if (prompt) {
      getResults();
    }
  };

  return (
    <>
      <div className="p-6 md:p-10 flex items-center justify-center">
        <div className="relative">
          <input
            placeholder="Search..."
            className="input pr-10 shadow-lg focus:border-2 border-gray-300 px-5 py-3 rounded-xl w-56 transition-all focus:w-64 outline-none"
            name="search"
            autoComplete="off"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            // type="search"
          />
          <GoSearch
            onClick={() => handleSearch()}
            size={24}
            className="absolute top-3 right-3 text-gray-500"
          />
        </div>
      </div>
      <div className="px-2 md:px-6 space-y-2 pb-2">
        <FlatList
          list={result ? result : []}
          renderItem={(item, i) => <ResultItem item={item} key={i} />}
          renderWhenEmpty={() => (
            <h1 className="text-center">Well search something, damn it!</h1>
          )}
          renderOnScroll
        />
      </div>
    </>
  );
}
