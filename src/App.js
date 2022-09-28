import "./App.css";
import Thread from "./components/Thread";
import Home from "./components/Home";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/comments/:threadId" element={<Thread />} />
        <Route path="/*" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
