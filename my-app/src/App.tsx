import React from "react";
import "./App.css";
import TaskManagement from "./taskManagement/taskManagement";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>TASK MANAGEMENT</p>
      </header>

      <TaskManagement />
    </div>
  );
}

export default App;
