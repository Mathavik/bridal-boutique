

import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

          {/* 🔓 Public */}
          <Route path="/" element={<div>This is app</div>} />
      </Routes>
    </BrowserRouter>
  );
}