import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import App from "./App"; // Login Page
import Dashboard1 from "./Dashboard1"; // Dashboard 1
import Dashboard2 from "./Dashboard2"; // Dashboard 2
import Dashboard3 from "./Dashboard3"; // Dashboard 2

const MainApp = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard1" element={<Dashboard1 />} />
        <Route path="/dashboard2" element={<Dashboard2 />} />
        <Route path="/dashboard3" element={<Dashboard3 />} />
      </Routes>
    </Router>
  );
};

export default MainApp;