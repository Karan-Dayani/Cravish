"use client";
import React from "react";
import { signIn } from "next-auth/react";
import { useAppContext } from "../context";

export default function SignIn() {
  const { user, status } = useAppContext();

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <div className="p-10">
        <h1>hii! you are logged in as {user?.username}</h1>
        <h1>
          Check out your profile{" "}
          <a
            href="/profile"
            className="underline text-blue-300 hover:text-blue-500"
          >
            here
          </a>
        </h1>
      </div>
    );
  } else {
    return (
      <div className="p-10 flex justify-center">
        <button
          className="bg-blue-400 p-3 rounded-lg"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          Sign In with Google
        </button>
      </div>
    );
  }
}
