import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Upload from "./Components/Upload";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Upload />} />
      </Routes>
    </Router>
  );
};

export default App;
