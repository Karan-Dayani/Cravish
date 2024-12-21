import Recipe from "@/app/(models)/recipe";
import { error, Recipe as recipeType } from "@/app/interfaces";
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

export async function GET(
  req: Request
): Promise<NextResponse<recipeType[] | error>> {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  const skip = parseInt(searchParams.get("skip") || "0");
  const limit = parseInt(searchParams.get("limit") || "15");
  const userId = searchParams.get("userId");

  try {
    let response;

    if (search) {
      response = await Recipe.find({
        title: { $regex: search, $options: "i" },
      });
    } else if (userId) {
      response = await Recipe.find({ userId: userId });
    } else {
      response = await Recipe.find(
        {},
        { userId: 1, title: 1, img: 1, likes: 1 }
      )
        .sort({ likes: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit);
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
