import Recipe from "@/app/(models)/recipe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json(); // Parse the incoming JSON body

    // Create a new recipe document in the database
    const newRecipe = new Recipe({
      userId: data.userId,
      title: data.title,
      img: data.img,
      ingredients: data.ingredients,
      procedure: data.procedure,
      likes: 0, // Set default likes to 0
    });

    const savedRecipe = await newRecipe.save(); // Save the recipe in MongoDB

    return NextResponse.json(
      { message: "Recipe created successfully", savedRecipe },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating recipe:", error);
    return NextResponse.json(
      { message: "Failed to create recipe" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { search } = Object.fromEntries(new URL(req.url).searchParams);
  try {
    const response = await Recipe.find({
      title: { $regex: search, $options: "i" },
    });
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
