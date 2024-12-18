import User from "@/app/(models)/user";
import { error, UserId } from "@/app/interfaces";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { email: string } }
): Promise<NextResponse<UserId | error>> {
  try {
    const response = await User.findOne({ email: params.email }, { _id: 1 });
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
