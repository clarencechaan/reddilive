import { Moon, SunDim } from "phosphor-react";
import React, { useContext } from "react";
import ThemeContext from "../context/ThemeContext";
import "../styles/ThemeSwitch.css";

/**
 * Component for a button that toggles between light and dark mode for the app's theme.
 */
function ThemeSwitch() {
  const { setDarkMode } = useContext(ThemeContext);

  /**
   * Toggles the app's theme between light and dark mode, and saves the current
   * state to local storage.
   */
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
