import "./App.css";
import Thread from "./components/Thread";
import Home from "./components/Home";
import Auth from "./components/Auth";
import Redirect from "./components/Redirect";
import { Routes, Route } from "react-router-dom";
import ThemeContext from "./ThemeContext";
import UserContext from "./UserContext";
import { useState, useEffect } from "react";

function App() {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("dark_mode"));
  const [user, setUser] = useState(localStorage.getItem("username"));

  useEffect(() => {
    const documentHeight = () => {
      const doc = document.documentElement;
      doc.style.setProperty("--doc-height", `${window.innerHeight}px`);
    };
    window.addEventListener("resize", documentHeight);
    documentHeight();
  }, []);

  return (
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
  );
}

export default App;
