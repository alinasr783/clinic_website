import {Link} from "react-router-dom";

function Button({
  children,
  disabled,
  to,
  variation = "primary",
  onClick,
  size = "medium",
  className,
}) {
  const sizeStyles = {
    small: ` text-xs sm:text-sm px-3 sm:px-4 py-1.5`,
    medium: ` text-base sm:text-lg px-4 sm:px-6 py-2`,
    large: `text-base sm:text-lg md:text-xl px-6 sm:px-8 py-3`,
  };

  const baseStyles = {
    icon: ` ${sizeStyles[size]} rounded-full w-10 h-10 flex items-center justify-center
      cursor-pointer hover:bg-gray-200 border border-gray-300 ${className}`,

    primary: ` ${sizeStyles[size]} bg-white text-gray-800 
            rounded-full border border-transparent
              hover:bg-dark-2 hover:border-white hover:text-white 
                transition-colors w-auto min-w-[160px] sm:min-w-[180px] md:min-w-[200px]
              duration-300 cursor-pointer inline-block disabled:cursor-not-allowed 
              disabled:opacity-50 text-center ${className}`,

    secondary: ` ${sizeStyles[size]} bg-dark-2 text-white border 
      border-gray-400 rounded-full w-auto min-w-[160px] sm:min-w-[180px] md:min-w-[200px] cursor-pointer
      hover:bg-white hover:text-gray-800 transition-colors duration-300  ${className}`,

    danger: ` ${sizeStyles[size]} bg-red-500 text-white border 
      border-gray-400 rounded-full w-auto min-w-[160px] sm:min-w-[180px] md:min-w-[200px] cursor-pointer
      hover:bg-white hover:text-gray-800 transition-colors duration-300  ${className}`,

    link: ` ${sizeStyles[size]} cursor-pointer underline 
    underline-offset-4 hover:no-underline ${className}`,
  };

  if (to) {
    return (
      <Link to={to} className={baseStyles[variation]} disabled={disabled}>
        {children}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={baseStyles[variation]}
        disabled={disabled}>
        {children}
      </button>
    );
  }

  return (
    <button disabled={disabled} className={baseStyles[variation]}>
      {children}
    </button>
  );
}

export default Button;
