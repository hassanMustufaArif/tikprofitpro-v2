import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="mk-page min-h-screen flex flex-col">
      <Navbar variant="light" />
      <main className="flex flex-1 items-center justify-center px-5 pt-24 pb-20">
        <div className="text-center">
          <div className="mk-pill">Error 404</div>
          <h1 className="mk-h2 mt-6">Page not found</h1>
          <p className="mk-lead mx-auto mt-5 max-w-md">The page you're looking for doesn't exist or has moved.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="/" className="mk-btn-primary">Return to Home</a>
            <a href="/products" className="mk-btn-secondary">Browse products</a>
          </div>
        </div>
      </main>
      <Footer variant="light" />
    </div>
  );
};

export default NotFound;
