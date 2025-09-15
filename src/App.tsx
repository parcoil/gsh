import { BrowserRouter, Routes, Route } from "react-router";
import Home from "@/pages/home";
import Navbar from "@/components/navbar";
import NotFound from "@/pages/notfound";
import Login from "@/pages/login";
import Submit from "@/pages/submit";
import Footer from "@/components/footer";
import Site from "@/pages/site";
import MySites from "@/pages/mysites";
import { Toaster } from "@/components/ui/sonner"

import { ThemeProvider } from "@/components/theme-provider"

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <BrowserRouter>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/submit" element={<Submit />} />
              <Route path="/site/:id" element={<Site />} />
              <Route path="/mysites" element={<MySites />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <Toaster />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
