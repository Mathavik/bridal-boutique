import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header"; // Correct path

function Home() {
  return (
    <>
      <Header />

      <div className="p-10 text-center">
        <h1 className="text-4xl font-bold">Bridal Boutique</h1>
        <p className="mt-4 text-gray-500">
          Welcome to our Bridal Boutique
        </p>
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}