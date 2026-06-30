import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import "./App.css";


const App: React.FC = () => {

  return (
    <Router>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
       

        </Route>

        {/* 404 Fallback */}
        <Route
          path="*"
          element={
            <h1 className="text-gray-700 text-center mt-20 text-3xl">
              404 - Page Not Found
            </h1>
          }
        />
      </Routes>
    </Router>
  );
};


export default App;
