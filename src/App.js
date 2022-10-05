import "./App.css";
import Thread from "./components/Thread";
import Home from "./components/Home";
import { Routes, Route } from "react-router-dom";
import ThemeContext from "./ThemeContext";
import { useState } from "react";

function App() {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("dark_mode"));

  return (
    <div className={"App" + (darkMode ? " dark-mode" : "")}>
      <ThemeContext.Provider value={{ setDarkMode }}>
        <Routes>
          <Route
            path="/r/:subreddit/comments/:threadId/*"
            element={<Thread />}
          />
          <Route path="/comments/:threadId" element={<Thread />} />
          <Route path="/*" element={<Home />} />
        </Routes>
      </ThemeContext.Provider>
    </div>
  );
}

export default App;
