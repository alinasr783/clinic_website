import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-50 bg-dark-1 
            text-white p-2 rounded-full 
            shadow-lg transition-all duration-300 hover:scale-110 
              focus:outline-none focus:ring-2 focus:ring-dark-2 
              focus:ring-offset-2 cursor-pointer"
          aria-label="Back to top">
          <ArrowUp />
        </button>
      )}
    </>
  );
}

export default BackToTopButton;
