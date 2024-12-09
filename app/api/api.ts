interface User {
  name: string;
  email: string;
  image: string;
}

interface SuccessUserGet {
  success: {
    user: User;
  };
}

interface ErrorUserGet {
  error: string;
}

type CurrUserResponse = SuccessUserGet | ErrorUserGet;

export const getCurrUser = async (): Promise<CurrUserResponse | null> => {
  try {
    const res: Response = await fetch("http://localhost:3000/api/getUser", {
      cache: "no-store",
    });
    return res.json();
  } catch (error: unknown) {
    console.log("Failed to get User", error);
    return null;
  }
};
