import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import "./App.css";
import Home from "./Home/Home";

// import Home from "./pages/Home/Home";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<Home />} />

        {/* 404 Page */}
        <Route
          path="*"
          element={
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                fontSize: "32px",
                fontWeight: "bold",
              }}
            >
              404 - Page Not Found
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;