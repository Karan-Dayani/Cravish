import User from "@/app/(models)/user";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export async function GET(req: Request) {
  try {
    const { id } = Object.fromEntries(new URL(req.url).searchParams);

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
