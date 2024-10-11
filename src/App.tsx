import React, { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import Auth from "./components/Auth";
import Home from "./components/Home";
import Redirect from "./components/Redirect";
import Thread from "./components/Thread";
import ThemeContext from "./context/ThemeContext";
import UserContext from "./context/UserContext";

/**
 * The root component of the React application.
 */
const App = () => {
  const [darkMode, setDarkMode] = useState(!!localStorage.getItem("dark_mode"));
  const [user, setUser] = useState(localStorage.getItem("username"));

  // Sets the CSS property `--doc-height` to the window's inner height on mount and on resize.
  useEffect(() => {
    const documentHeight = () => {
      const doc = document.documentElement;
      doc.style.setProperty("--doc-height", `${window.innerHeight}px`);
    };
    window.addEventListener("resize", documentHeight);
    documentHeight();
  }, []);

  return (
    <BrowserRouter>
      <div className={"App" + (darkMode ? " dark-mode" : "")}>
        <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
          <UserContext.Provider value={{ user, setUser }}>
            <Routes>
              <Route
                path="/r/:subreddit/comments/:threadId/*"
                element={<Thread />}
              />
              <Route path="/comments/:threadId" element={<Thread />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/redirect" element={<Redirect />} />
              <Route path="/*" element={<Home />} />
            </Routes>
          </UserContext.Provider>
        </ThemeContext.Provider>
      </div>
    </BrowserRouter>
  );
};

export default App;
