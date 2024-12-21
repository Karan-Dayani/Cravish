import Recipe from "@/app/(models)/recipe";
import { error, Recipe as recipeType } from "@/app/interfaces";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse<recipeType | error>> {
  const { id } = await params;
  try {
    const response = await Recipe.findById(id);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    if (data.operation === "like") {
      await Recipe.findOneAndUpdate({ _id: data.id }, { $inc: { likes: 1 } });
    } else if (data.operation === "unlike") {
      await Recipe.findOneAndUpdate({ _id: data.id }, { $inc: { likes: -1 } });
    }
    return NextResponse.json(
      { message: "Successfully Updated recipe" },
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
