import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header"; // Correct path
import Home from "./Home/Home";


export default function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}