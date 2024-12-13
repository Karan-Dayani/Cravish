import { Recipe, recipe, User, UserId } from "../interfaces";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// export const getCurrUser = async (): Promise<
//   SuccessUserGet | { error: string } | null
// > => {
//   try {
//     const res: Response = await fetch(`${baseUrl}/api/getUser`, {
//       cache: "no-store",
//     });
//     if (!res.ok) {
//       throw new Error(`Failed to fetch user: ${res.status} ${res.statusText}`);
//     }
//     return await res.json();
//   } catch (error: unknown) {
//     console.error("An error occurred while fetching the current user:", error);
//     return null;
//   }
// };

export const getUserIdByMail = async (
  email: string
): Promise<UserId | null> => {
  try {
    const res = await fetch(`${baseUrl}/api/User/${email}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch user: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Failed to get User", error);
    return null;
  }
};

export const createRecipe = async (data: recipe): Promise<void> => {
  try {
    const res = await fetch(`${baseUrl}/api/Recipe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Failed to create recipe");
    }

    console.log("Recipe created successfully");
  } catch (error) {
    console.error("Failed to create recipe", error);
    throw error;
  }
};

export const getUsersRecipes = async (
  userId: string
): Promise<Recipe[] | null> => {
  try {
    const res = await fetch(`${baseUrl}/api/Recipe?userId=${userId}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch Recipes: ${res.status} ${res.statusText}`
      );
    }

    return await res.json();
  } catch (error) {
    console.error("Failed to get Recipes", error);
    return null;
  }
};

export const getRecipesBySearch = async (
  prompt: string
): Promise<Recipe[] | null> => {
  try {
    const res = await fetch(`${baseUrl}/api/Recipe?search=${prompt}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch Recipes: ${res.status} ${res.statusText}`
      );
    }

    return await res.json();
  } catch (error) {
    console.error("Failed to get Recipes", error);
    return null;
  }
};

export const getUserById = async (id: string): Promise<User> => {
  try {
    const res = await fetch(`${baseUrl}/api/User?id=${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch user");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const getShuffeledRecipe = async (
  size: number
): Promise<Recipe[] | null> => {
  try {
    const res = await fetch(`${baseUrl}/api/Recipe?size=${size}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch Recipes: ${res.status} ${res.statusText}`
      );
    }

    return await res.json();
  } catch (error) {
    console.error("Failed to get Recipes", error);
    return null;
  }
};

export const getRecipeById = async (id: string): Promise<Recipe | null> => {
  try {
    const res = await fetch(`${baseUrl}/api/Recipe/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch Recipes: ${res.status} ${res.statusText}`
      );
    }

    return await res.json();
  } catch (error) {
    console.error("Failed to get Recipes", error);
    return null;
  }
};
