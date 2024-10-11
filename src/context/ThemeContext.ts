import { createContext } from "react";

interface ThemeContextType {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>> | null;
}

const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  setDarkMode: null,
});

export default ThemeContext;
