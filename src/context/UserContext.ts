import { createContext, useState } from "react";

interface UserContextType {
  user: string | null;
  setUser: React.Dispatch<React.SetStateAction<string | null>>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export default UserContext;
