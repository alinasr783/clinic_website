import {Link} from "react-router-dom";
import Logo from "./Logo";

function AppHeader() {
  const links = [
    {
      name: "Home",
      path: "/",
    },
    // {
    //   name: "Cost",
    //   path: "/cost",
    // },
    {
      name: "Booking",
      path: "/booking",
    },
    {
      name: "Dashboard",
      path: "/dashboard",
    },
  ];

  return (
    <header className="flex items-center justify-between py-3 px-4 sm:px-6">
      <Logo />

      <nav className="flex gap-4 sm:gap-12">
        {links.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className="text-sm sm:text-base font-semibold text-white whitespace-nowrap">
            {link.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export default AppHeader;
