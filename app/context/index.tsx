import { useSession } from "next-auth/react";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getUserById, getUserIdByMail } from "../api/api";
import { AppContextProps, User } from "../interfaces";

const AppContext = createContext<AppContextProps | undefined>(undefined);

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User>();
  const [trigger, setTrigger] = useState<boolean>(false);
  useEffect(() => {
    const getUser = async () => {
      const Userid = await getUserIdByMail(session?.user?.email as string);
      if (Userid) {
        const res = await getUserById(Userid?._id as string);
        setUser(res);
        console.log("ran");
      }
    };
    if (session) {
      getUser();
    }
  }, [session, trigger]);
  return (
    <AppContext.Provider value={{ user, setUser, status, setTrigger }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
