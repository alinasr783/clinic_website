import { AnimatePresence, motion as Motion } from "framer-motion";
import { Mail, Menu, MessageCircle, Send, X } from "lucide-react";
import { useEffect, useState } from "react";
import Logo from "./Logo";

function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [showOnDesktop, setShowOnDesktop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const infoSection = document.querySelector('[data-section="info"]');
      if (infoSection) {
        const rect = infoSection.getBoundingClientRect();
        setShowOnDesktop(rect.top <= 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    {href: "#services", label: "Services"},
    {href: "#videos", label: "Videos"},
    {href: "#about", label: "About Us"},
    {href: "#faq", label: "Q&A"},
    {href: "#contacts", label: "Contacts"},
  ];

  const overlayVariants = {
    hidden: {opacity: 0},
    visible: {opacity: 1},
  };

  const menuVariants = {
    hidden: {x: "100%"},
    visible: {
      x: 0,
      transition: {duration: 0.3, ease: "easeOut"},
    },
    exit: {
      x: "100%",
      transition: {duration: 0.3, ease: "easeIn"},
    },
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed top-6 right-6 z-50 w-12 h-12 rounded-full 
                bg-dark-1 flex items-center 
                justify-center transition-all duration-300 hover:bg-dark-2/90 
                ${showOnDesktop ? "block" : "md:hidden"}`}
        aria-label="Open menu">
        <Menu className="w-6 h-6 text-white" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <Motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            <Motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 h-full w-3/4 max-w-xs
                bg-dark-2 z-50 overflow-y-auto">
              <div className="flex items-center justify-between p-4">
                <Logo />
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center 
                    text-white hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Close menu">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="p-6">
                <ul className="space-y-4">
                  {menuItems.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className="block text-white text-sm sm:text-base
                          hover:text-gray-300 transition-colors"
                        onClick={() => setIsOpen(false)}>
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div
                className="absolute bottom-4 left-0 
                right-0 p-6">
                <div className="flex gap-4 mb-6">
                  <a
                    href="https://wa.me/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </a>

                  <a
                    href="https://t.me/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                    <Send className="w-5 h-5 text-white" />
                  </a>

                  <a
                    href="mailto:info@naturasmile.com"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                    <Mail className="w-5 h-5 text-white" />
                  </a>
                </div>
              </div>
            </Motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default MobileMenu;
