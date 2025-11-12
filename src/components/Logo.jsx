import {Link} from "react-router-dom";

function Logo() {
  return (
    <Link to="/" className="flex flex-col items-center gap-1">
      <img
        src="/logo.jpeg"
        alt="Logo"
        className="w-8 h-8 sm:w-12 sm:h-12 rounded-full object-cover"
      />
    </Link>
  );
}

export default Logo;
