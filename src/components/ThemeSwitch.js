import { useContext } from "react";
import { Moon, SunDim } from "phosphor-react";
import ThemeContext from "../ThemeContext";
import "../styles/ThemeSwitch.css";

function ThemeSwitch() {
  const { setDarkMode } = useContext(ThemeContext);

  function handleThemeSwitchClick() {
    setDarkMode((prev) => {
      if (prev) localStorage.setItem("dark_mode", "");
      else localStorage.setItem("dark_mode", true);
      return !prev;
    });
  }
  return (
    <button className="ThemeSwitch" onClick={handleThemeSwitchClick}>
      <Moon size={24} weight="fill" className="moon" />
      <SunDim size={24} weight="bold" className="sun" />
    </button>
  );
}

export default ThemeSwitch;
