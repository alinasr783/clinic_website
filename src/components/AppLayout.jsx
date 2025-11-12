import {useEffect, useState} from "react";
import {Outlet, useLocation} from "react-router-dom";
import Header from "./Header";

function AppLayout() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const headerClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isHome && !scrolled
      ? "bg-transparent opacity-100"
      : "bg-dark-1 border-b border-gray-900 opacity-100"
  }`;

  return (
    <div className="bg-dark-1 min-h-screen text-white">
      <div className={headerClasses}>
        <Header scrolled={scrolled} isHome={isHome} />
      </div>

      <main className={`${isHome ? "" : "pt-16 sm:pt-24"}`}>
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
