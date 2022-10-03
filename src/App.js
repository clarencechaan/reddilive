import "./App.css";
import Thread from "./components/Thread";
import Home from "./components/Home";
import { Routes, Route } from "react-router-dom";
import { Moon, SunDim } from "phosphor-react";
import { useState } from "react";

function App() {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("dark-mode"));

  function handleThemeSwitchClicked() {
    setDarkMode((prev) => {
      if (prev) localStorage.setItem("dark-mode", "");
      else localStorage.setItem("dark-mode", true);
      return !prev;
    });
  }

  return (
    <div className={"App" + (darkMode ? " dark-mode" : "")}>
      <button className="theme-switch" onClick={handleThemeSwitchClicked}>
        <Moon size={24} weight="fill" className="moon" />
        <SunDim size={24} weight="bold" className="sun" />
      </button>
      <Routes>
        <Route path="/r/:subreddit/comments/:threadId/*" element={<Thread />} />
        <Route path="/comments/:threadId" element={<Thread />} />
        <Route path="/*" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
