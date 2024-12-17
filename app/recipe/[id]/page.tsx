"use client";
import { getRecipeById, getUserById, Recipe, User } from "@/app/api/api";
import { Inter } from "next/font/google";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { LuHeart } from "react-icons/lu";

const InterFont = Inter({ subsets: ["latin"], weight: "400" });

export default function RecipePage() {
  const params = useParams();
  const [recipe, setRecipe] = useState<Recipe>();
  const [creator, setCreator] = useState<User>();
  const [liked, setLiked] = useState<boolean>();
  const [loading, setloading] = useState<boolean>();
  useEffect(() => {
    const getRecipe = async () => {
      setloading(true);
      try {
        const res = await getRecipeById(params.id as string);
        if (res) {
          setRecipe(res);
        }
      } catch (err) {
        console.error("Failed to fetch recipe:", err);
      } finally {
        setloading(false);
      }
    };
    getRecipe();
  }, [params]);

  useEffect(() => {
    const getCreator = async () => {
      const res = await getUserById(recipe?.userId as string);
      setCreator(res);
    };
    if (recipe?.userId) {
      getCreator();
    }
  }, [recipe]);

  if (loading) {
    return (
      <div className="flex justify-center w-full p-8">
        <div
          className="loader border-t-2 rounded-full border-gray-500 bg-gray-300 animate-spin
          aspect-square w-6 flex justify-center items-center text-yellow-700"
        ></div>
      </div>
    );
  }
  return (
    <div className={`${InterFont.className}`}>
      <div className="md:p-10">
        <div className="flex flex-col md:flex-row gap-2 md:gap-10">
          <div className="relative">
            {recipe?.img && (
              <Image
                priority={true}
                src={recipe?.img as string}
                alt={recipe?.title as string}
                width={1000}
                height={1000}
                quality={100}
                className="w-full md:w-auto h-52 md:h-72 object-cover md:rounded-lg"
              />
            )}
            <div className="absolute bottom-3 right-3">
              <LuHeart
                onClick={() => setLiked((prev) => !prev)}
                className={`size-6 stroke-red-500 ${liked && "fill-red-500"}`}
              />
            </div>
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-center md:text-left">
              {recipe?.title}
            </h1>
            <div className="flex items-center gap-3 justify-end px-3">
              {/* {creator?.image && (
                <Image
                  src={creator?.image as string}
                  alt="creator-img"
                  height={100}
                  width={100}
                  className="h-8 w-8 rounded-full"
                />
              )} */}
              <h1 className="text-md font-bold">- by {creator?.username}</h1>
            </div>
          </div>
        </div>
        <div className="p-6 md:p-3">
          <h1 className="text-lg md:text-xl font-bold">Ingredients</h1>
          <ul className="list-disc px-6 md:px-3">
            {recipe?.ingredients.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="p-6 md:p-3">
          <h1 className="text-lg md:text-xl font-bold">Process</h1>
          <ul className="list-decimal px-6 md:px-3">
            {recipe?.procedure.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
