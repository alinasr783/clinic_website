import {useState, useRef, useEffect, memo} from "react";
import {Play} from "lucide-react";

const LazyVideo = memo(({video, onVideoClick}) => {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

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

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleVideoLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div
      ref={containerRef}
      className="relative group cursor-pointer"
      onClick={() => onVideoClick(video)}>
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-800">
        {isInView ? (
          <video
            ref={videoRef}
            src={video.videoUrl}
            className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-110 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
            muted
            preload="metadata"
            onLoadedData={handleVideoLoad}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-700 animate-pulse" />
        )}

        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h3 className="text-white font-semibold text-sm mb-1">
            {video.patientName}
          </h3>
          <p className="text-gray-300 text-xs">{video.treatment}</p>
        </div>
      </div>
    </div>
  );
});

LazyVideo.displayName = "LazyVideo";

export default LazyVideo;
