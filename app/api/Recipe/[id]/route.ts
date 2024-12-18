import Recipe from "@/app/(models)/recipe";
import { error, Recipe as recipeType } from "@/app/interfaces";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse<recipeType | error>> {
  try {
    const response = await Recipe.findById(params.id);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
