import { createContext } from "react";

interface ThemeContextType {
  darkMode: string | null;
  setDarkMode: React.Dispatch<React.SetStateAction<string | null>>;
}

const ThemeContext = createContext<ThemeContextType>({
  darkMode: null,
  setDarkMode: () => {},
});

export default ThemeContext;
