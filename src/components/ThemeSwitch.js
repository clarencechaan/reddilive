import { Moon, SunDim } from "phosphor-react";
import React, { useContext } from "react";
import ThemeContext from "../context/ThemeContext";
import "../styles/ThemeSwitch.css";

function ThemeSwitch() {
  const { setDarkMode } = useContext(ThemeContext);

  // toggle theme, setting state and local storage to reflect changes
  function handleThemeSwitchClick() {
    setDarkMode((prev) => {
      if (prev) localStorage.setItem("dark_mode", "");
      else localStorage.setItem("dark_mode", true);
      return !prev;
    });
  }

  return (
    <button className="ThemeSwitch" onClick={handleThemeSwitchClick}>
      <Moon size={26} weight="fill" className="moon" />
      <SunDim size={26} weight="bold" className="sun" />
    </button>
  );
}

export default ThemeSwitch;
