import { createContext } from "react";

interface UserContextType {
  user: string | null;
  setUser: React.Dispatch<React.SetStateAction<string | null>> | null;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: null,
});

export default UserContext;
