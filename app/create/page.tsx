"use client";
import React from "react";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Create() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    redirect("/signIn");
  }
  return (
    <div>
      <h1>Create</h1>
      <h1>{session?.user?.name}</h1>
    </div>
  );
}
