import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/home";
import Navbar from "./components/navbar";
import NotFound from "./pages/notfound";
import Login from "./pages/login";
import Submit from "./pages/submit";
import Footer from "./components/footer";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
