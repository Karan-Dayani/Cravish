"use client";
import Image from "next/image";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { getUserById } from "./api/api";
import { Recipe, User } from "./interfaces";
import { LuHeart } from "react-icons/lu";
import Link from "next/link";
import { Inter } from "next/font/google";

const InterFont = Inter({ subsets: ["latin"], weight: "400" });

function ResultItem({ item }: { item: Recipe }) {
  const [creator, setCreator] = useState<User>();
  const [liked, setLiked] = useState<boolean>();
  useLayoutEffect(() => {
    const getCreator = async () => {
      const res = await getUserById(item.userId);
      setCreator(res);
    };
    getCreator();
  }, [item]);
  return (
    <div className={`${InterFont.className}`}>
      <div className="flex items-center justify-between py-2 px-2 md:px-0">
        <div className="flex items-center gap-3">
          {creator?.image && (
            <Image
              src={creator?.image as string}
              alt="creator-img"
              height={100}
              width={100}
              className="h-8 w-8 rounded-full"
            />
          )}
          <h1 className="text-sm font-bold">{creator?.username}</h1>
        </div>
        <Link
          href={`/recipe/${item._id}`}
          className="text-blue-400 hover:text-blue-500"
        >
          Get Recipe...
        </Link>
      </div>
      <button
        className="w-full"
        onDoubleClick={() => setLiked((prev) => !prev)}
      >
        <Image
          priority={true}
          src={item.img}
          alt={item.title}
          width={1000}
          height={1000}
          quality={100}
          className="w-full"
        />
      </button>
      <div className="flex items-center justify-between py-2 px-2 md:px-0">
        <h1 className="text-lg font-bold">{item.title}</h1>
        <div className="flex items-center gap-2 text-2xl text-red-500">
          {item.likes >= 1 && <h1 className="text-xl">{item.likes}</h1>}
          <LuHeart
            onClick={() => setLiked((prev) => !prev)}
            className={`${liked && "fill-red-500"}`}
          />
        </div>
      </div>
      <hr />
    </div>
  );
}

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchRecipes = async (page: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/Recipe?page=${page}&limit=10`);
      if (!res.ok) throw new Error("Failed to fetch recipes");

      const data = await res.json();

      if (data.length === 0) {
        setHasMore(false);
      } else {
        setRecipes((prevRecipes) => [...prevRecipes, ...data]);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes(page);
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 200 &&
        !loading &&
        hasMore
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, hasMore]);

  return (
    <div className="py-2">
      <div className="flex justify-center">
        <div className="w-full md:w-[40%] flex flex-col gap-4">
          {recipes.map((recipe, i) => (
            <ResultItem item={recipe} key={i} />
          ))}
        </div>
      </div>
      {loading && (
        <div className="flex justify-center w-full p-8">
          <div
            className="loader border-t-2 rounded-full border-gray-500 bg-gray-300 animate-spin
          aspect-square w-6 flex justify-center items-center text-yellow-700"
          ></div>
        </div>
      )}
      {!hasMore && <p className="text-center mt-4">No more recipes to load.</p>}
    </div>
  );
}
