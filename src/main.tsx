import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import Login from "./pages/login.tsx";
import Movies from "./pages/movies.tsx";
import Books from "./pages/books.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<App />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/books" element={<Books />} />
      </Routes>
    </Router>
  </StrictMode>
);
