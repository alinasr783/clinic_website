import {Link} from "react-router-dom";

const Footer = () => {
  const navigationLinks = [
    {name: "Services", href: "#services"},
    {name: "About", href: "#about"},
    {name: "Booking", href: "#booking"},
    {name: "Cost", href: "#cost"},
  ];

  return (
    <footer className="bg-dark-2 p-4 rounded-2xl relative">
      <nav className="flex flex-wrap justify-center md:justify-center gap-6 lg:gap-8">
        {navigationLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className="text-xs sm:text-sm text-gray-300 
              hover:text-white transition-colors duration-200">
            {link.name}
          </a>
        ))}
      </nav>

      <Link
        to="/dashboard"
        className="text-gray-300 absolute bottom-4 right-4
        hidden md:inline-block">
        Admin
      </Link>
    </footer>
  );
};

export default Footer;
