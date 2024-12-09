"use client";
import React from "react";
import { signIn, useSession } from "next-auth/react";

export default function SignIn() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (session) {
    return (
      <div className="p-10">
        <h1>hii! you are logged in as {session?.user?.name}</h1>
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
