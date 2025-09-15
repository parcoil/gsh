import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/home";
import Navbar from "./components/navbar";
import NotFound from "./pages/notfound";
import Login from "./pages/login";
import Submit from "./pages/submit";
import Footer from "./components/footer";
import Site from "./pages/site";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/submit" element={<Submit />} />
            <Route path="/site/:id" element={<Site />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

