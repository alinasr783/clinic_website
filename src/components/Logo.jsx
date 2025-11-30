import {Link} from "react-router-dom";

function Logo() {
  return (
    <Link to="/" className="flex flex-col items-center gap-1">
      <img
        src="https://i.ibb.co/pvSbXJHy/Gemini-Generated-Image-aokz26aokz26aokz-1.png"
        alt="Logo"
        className="w-8 h-8 sm:w-12 sm:h-12 rounded-full object-cover"
      />
    </Link>
  );
}

export default Logo;
