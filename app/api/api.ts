const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
// interface User {
//   name: string;
//   email: string;
//   image: string;
// }

// interface SuccessUserGet {
//   success: {
//     user: User;
//   };
// }

// interface ErrorUserGet {
//   error: string;
// }

// type CurrUserResponse = SuccessUserGet | ErrorUserGet;

export const getCurrUser = async () => {
  try {
    const res: Response = await fetch(`${baseUrl}/api/getUser`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch user: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (error: unknown) {
    console.error("An error occurred while fetching the current user:", error);
    return null;
  }
};

export const getUserByMail = async (email: string) => {
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
