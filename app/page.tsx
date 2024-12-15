"use client";
import Image from "next/image";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { getUserById, Recipe, User } from "./api/api";
import { LuHeart } from "react-icons/lu";
import Link from "next/link";
import { Inter } from "next/font/google";

const InterFont = Inter({ subsets: ["latin"], weight: "400" });

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
        <Link href={"#"} className="text-blue-400 hover:text-blue-500">
          Get Recipe...
        </Link>
      </div>
      <div>
        <Image
          priority={true}
          src={item.img}
          alt={item.title}
          width={400}
          height={400}
          quality={100}
          className="w-full"
        />
      </div>
      <div className="flex items-center justify-between py-2 px-2 md:px-0">
        <h1 className="text-lg font-bold">{item.title}</h1>
        <div className="flex items-center gap-2 text-lg">
          <h1>{item.likes}</h1>
          <LuHeart className="size-5" />
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
      {loading && <p className="text-center mt-4">Loading...</p>}
      {!hasMore && <p className="text-center mt-4">No more recipes to load.</p>}
    </div>
  );
}
