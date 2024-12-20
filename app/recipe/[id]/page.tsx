"use client";
import {
  getRecipeById,
  getUserById,
  likeRecipe,
  unlikeRecipe,
  updateUsersLiked,
} from "@/app/api/api";
import { useAppContext } from "@/app/context";
import { Recipe, User } from "@/app/interfaces";
import { Inter } from "next/font/google";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { LuHeart } from "react-icons/lu";

const InterFont = Inter({ subsets: ["latin"], weight: "400" });

export default function RecipePage() {
  const params = useParams();
  const { user, setTrigger } = useAppContext();
  const [recipe, setRecipe] = useState<Recipe>();
  const [creator, setCreator] = useState<User>();
  const [liked, setLiked] = useState<{ total: number; bool: boolean }>();
  const [loading, setloading] = useState<boolean>(true);

  useEffect(() => {
    setLiked((prev) => ({
      total: prev?.total as number,
      bool: user?.liked.includes(recipe?._id as string) as boolean,
    }));
  }, [recipe, user]);

  useEffect(() => {
    const getRecipe = async () => {
      setloading(true);
      try {
        const res = await getRecipeById(params.id as string);
        if (res) {
          setRecipe(res);
          setLiked((prev) => ({
            total: res.likes,
            bool: prev?.bool as boolean,
          }));
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

  const handleLikeToggle = async () => {
    let updatedLiked = user?.liked || [];
    if (liked?.bool) {
      //unlike
      updatedLiked = updatedLiked.filter((id) => id !== recipe?._id);
      await unlikeRecipe(params.id as string);
      setLiked({ total: liked.total - 1, bool: false });
    } else {
      //like
      updatedLiked.push(params.id as string);
      await likeRecipe(params.id as string);
      setLiked({ total: liked?.total ? liked.total + 1 : 1, bool: true });
    }
    setTrigger((prev) => !prev);
    await updateUsersLiked(user?._id as string, updatedLiked);
  };

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

  if (!recipe) {
    return (
      <div className="flex justify-center w-full p-8">
        <h1 className="text-2xl">Recipe not found</h1>
      </div>
    );
  }

  return (
    <div className={`${InterFont.className}`}>
      <div className="md:p-10">
        <div className="flex flex-col md:flex-row gap-2 md:gap-10">
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
          <div className="relative">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-center md:text-left">
                {recipe?.title}
              </h1>
              <h1 className="text-md text-center md:text-right px-3">
                {creator?.username}
              </h1>
            </div>
            <div className="absolute top-0 right-0 md:top-auto md:right-auto p-3 flex items-center gap-2">
              {liked && liked?.total >= 1 && (
                <h1 className="text-red-500">{liked?.total}</h1>
              )}
              <LuHeart
                onClick={handleLikeToggle}
                className={`size-6 stroke-red-500 ${
                  liked?.bool && "fill-red-500"
                }`}
              />
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
