import "./App.css";
import Thread from "./components/Thread";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/comments/:threadId/*" element={<Thread />} />
      </Routes>
    </div>
  );
}

export default App;
