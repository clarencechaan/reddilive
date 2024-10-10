import { createContext } from "react";

interface ThemeContextType {
  darkMode: boolean | null;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean | null>> | null;
}

const ThemeContext = createContext<ThemeContextType>({
  darkMode: null,
  setDarkMode: null,
});

export default ThemeContext;
