import {useState, useRef, useEffect} from "react";

const LazyImage = ({
  src,
  alt,
  className = "",
  onClick,
  placeholder = null,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  // Default skeleton placeholder
  const defaultPlaceholder = (
    <div className="w-full h-full bg-gray-800 animate-pulse flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gray-600 border-t-white rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      {...props}>
      {/* Show placeholder while not loaded */}
      {!isLoaded && (
        <div className="absolute inset-0">
          {placeholder || defaultPlaceholder}
        </div>
      )}

      {/* Show error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <svg
              className="w-8 h-8 mx-auto mb-2"
              fill="currentColor"
              viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-xs">Failed to load</p>
          </div>
        </div>
      )}

      {/* Actual image - only load when in view */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={handleLoad}
          onError={handleError}
          onClick={onClick}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default LazyImage;
