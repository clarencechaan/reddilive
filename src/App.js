import { fetchToken } from "./auth";
import "./App.css";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    fetchToken();
  }, []);

  return <div className="App"></div>;
}

export default App;
