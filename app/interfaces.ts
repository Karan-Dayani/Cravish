export interface Recipe {
  _id: string;
  userId: string;
  title: string;
  img: string;
  ingredients: string[];
  procedure: string[];
  likes: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface User {
  _id: string;
  username: string;
  image: string;
  email: string;
  liked: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface UserId {
  _id: string;
}

export interface recipe {
  userId: string | undefined;
  title: string;
  img: string;
  ingredients: string[];
  procedure: string[];
  likes: number;
}

export interface error {
  message: string | unknown;
}

export interface AppContextProps {
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  status: string;
}

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
