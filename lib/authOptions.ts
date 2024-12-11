import User from "@/app/(models)/user";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session }) {
      if (session?.user) {
        const existingUser = await User.findOne({
          email: session?.user?.email,
        });
        if (!existingUser) {
          await User.create({
            username: session?.user?.name,
            image: session?.user?.image,
            email: session?.user?.email,
            liked: [],
          });
        }
      }
      return session;
    },
  },
};
