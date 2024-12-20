import User from "@/app/(models)/user";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { error, User as userType } from "@/app/interfaces";

export async function GET(
  req: Request
): Promise<NextResponse<userType | error>> {
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

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await User.findOneAndUpdate({ _id: data.id }, { liked: data.liked });
    return NextResponse.json(
      { message: "Successfully Updated user" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to perform operation", error);
    return NextResponse.json(
      { message: "Failed to perform operation" },
      { status: 500 }
    );
  }
}
