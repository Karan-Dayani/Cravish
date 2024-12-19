"use client";
import React, { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import Image from "next/image";
import { AiOutlineClose, AiOutlineMinus } from "react-icons/ai";
import { GoPlus } from "react-icons/go";
import { createRecipe } from "../api/api";
import { recipe } from "../interfaces";
import { useAppContext } from "../context";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: "unified-firefly-322314.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

export default function Create() {
  const router = useRouter();
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app();
  }
  const { user, status } = useAppContext();
  const [title, setTitle] = useState<string>("");
  const [img, setImg] = useState<string>("");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [procedure, setProcedure] = useState<string[]>([""]);

  const handleAddField = (field: string) => {
    if (field === "ingredient") {
      setIngredients([...ingredients, ""]);
    } else if (field === "step") {
      setProcedure([...procedure, ""]);
    }
  };

  const handleRemoveField = (field: string, index: number) => {
    if (field === "ingredient") {
      setIngredients(ingredients.filter((_, i) => i !== index));
    } else if (field === "step") {
      setProcedure(procedure.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newRecipe: recipe = {
      userId: user?._id,
      title,
      img,
      ingredients,
      procedure,
      likes: 0,
    };

    try {
      await createRecipe(newRecipe);
      console.log("Recipe created successfully");
      router.replace("/");
    } catch (error) {
      console.error("Failed to create recipe", error);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center w-full p-8">
        <div
          className="loader border-t-2 rounded-full border-gray-500 bg-gray-300 animate-spin
        aspect-square w-6 flex justify-center items-center text-yellow-700"
        ></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    redirect("/signIn");
  }

  //* Firebase image upload and remove functions
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(selectedFile.name);

      fileRef.put(selectedFile).then((snapshot) => {
        snapshot.ref.getDownloadURL().then((downloadURL) => {
          setImg(downloadURL);
        });
      });
    } else {
      alert("No file selected");
    }
  };
  const handleImageRemove = () => {
    const storageRef = firebase.storage().refFromURL(img as string);
    storageRef
      .delete()
      .then(() => {
        setImg("");
      })
      .catch((error) => {
        console.error("Error removing image:", error);
      });
  };
  return (
    <div className="pt-3 md:p-10">
      <h1 className="text-2xl italic text-center">Create your Dish</h1>
      <form className="p-3 pb-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-3">
          <div className="flex items-center md:items-start gap-1.5 md:flex-col">
            <label className="text-xl text-gray-600 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Title
            </label>
            <input
              placeholder="Title..."
              className="p-2 border rounded-md"
              name="text"
              type="text"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              required
            />
          </div>
          <div className="relative min-h-[200px]">
            {img ? (
              <button
                type="button"
                onClick={handleImageRemove}
                className="absolute right-0 bg-red-400 rounded-bl-md p-1 shadow-lg shadow-slate-400"
              >
                <AiOutlineClose size={24} />
              </button>
            ) : (
              <>
                <div className="flex md:grid w-full max-w-xs items-center gap-1.5">
                  <label className="text-xl text-gray-600 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Picture
                  </label>
                  <input
                    onChange={handleImageUpload}
                    id="picture"
                    type="file"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium"
                  />
                </div>
              </>
            )}
            {img && <Image src={img} height={400} width={400} alt="image" />}
          </div>
        </div>
        <div className="pt-3">
          <label className="text-xl text-gray-600 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Ingredients
          </label>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Ingredient ${index + 1}`}
                  value={ingredient}
                  onChange={(e) => {
                    const newIngredients = [...ingredients];
                    newIngredients[index] = e.target.value;
                    setIngredients(newIngredients);
                  }}
                  className="w-full p-2 border rounded-md"
                  required
                />
                <button
                  type="button"
                  onClick={() => {
                    if (ingredients.length > 1) {
                      handleRemoveField("ingredient", index);
                    } else {
                      const newIngredients = [...ingredients];
                      newIngredients[0] = ""; // Clear the field if it's the only one.
                      setIngredients(newIngredients);
                    }
                  }}
                  className="p-2 bg-red-500 text-white rounded-md"
                >
                  <AiOutlineMinus size={24} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddField("ingredient")}
              className="p-2 bg-blue-500 text-white rounded-md flex justify-center items-center"
            >
              <GoPlus size={30} />
            </button>
          </div>
        </div>
        <div className="pt-3">
          <label className="text-xl text-gray-600 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Procedure
          </label>
          <div className="items-center text-right">
            {procedure.map((step, index) => (
              <div key={index} className="flex w-full mb-2 items-center">
                <input
                  type="text"
                  value={step}
                  onChange={(e) => {
                    const newProcedure = [...procedure];
                    newProcedure[index] = e.target.value;
                    setProcedure(newProcedure);
                  }}
                  className="w-full p-2 border rounded-md"
                  placeholder={`Step ${index + 1}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => {
                    if (procedure.length > 1) {
                      handleRemoveField("step", index); // Use a dedicated function for steps
                    } else {
                      const newProcedure = [...procedure];
                      newProcedure[0] = ""; // Clear the field if it's the only one.
                      setProcedure(newProcedure);
                    }
                  }}
                  className="ml-2 p-2 bg-red-500 text-white rounded-md"
                >
                  <AiOutlineMinus size={24} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddField("step")}
              className="mt-2 p-2 bg-blue-500 text-white rounded-md w-full md:w-auto"
            >
              <GoPlus size={30} />
            </button>
          </div>
        </div>
        <div className="w-full text-center">
          <button
            type="submit"
            className=" my-4 p-2 w-56 bg-green-500 text-white rounded-md"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
}
