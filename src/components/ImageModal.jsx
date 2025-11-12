import {AnimatePresence, motion} from "framer-motion";
import {useEffect, useRef} from "react";
import {Navigation, Pagination} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/react";
import {X, ChevronLeft, ChevronRight} from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ImageModal = ({isOpen, onClose, images, initialIndex = 0}) => {
  const swiperRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        swiperRef.current?.swiper.slidePrev();
      } else if (e.key === "ArrowRight") {
        swiperRef.current?.swiper.slideNext();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && swiperRef.current) {
      swiperRef.current.swiper.slideTo(initialIndex, 0);
    }
  }, [isOpen, initialIndex]);

  const backdropVariants = {
    hidden: {opacity: 0},
    visible: {opacity: 1},
    exit: {opacity: 0},
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            className="relative w-full h-full max-w-6xl max-h-[90vh] mx-4"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 
                         rounded-full flex items-center justify-center transition-colors">
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Swiper Container */}
            <div className="w-full h-full">
              <Swiper
                ref={swiperRef}
                modules={[Navigation, Pagination]}
                navigation={{
                  prevEl: ".image-modal-prev",
                  nextEl: ".image-modal-next",
                }}
                pagination={{
                  clickable: true,
                  bulletClass: "image-modal-bullet",
                  bulletActiveClass: "image-modal-bullet-active",
                }}
                spaceBetween={20}
                slidesPerView={1}
                loop={images.length > 1}
                className="w-full h-full image-modal-swiper">
                {images.map((image, index) => (
                  <SwiperSlide
                    key={index}
                    className="flex items-center justify-center">
                    <div className="w-full h-full flex items-center justify-center p-8">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="max-w-full max-h-full object-contain rounded-lg"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Navigation Buttons */}
              {images.length > 1 && (
                <>
                  <button
                    className="image-modal-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 
                                   w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full 
                                   flex items-center justify-center transition-colors">
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>

                  <button
                    className="image-modal-next absolute right-4 top-1/2 -translate-y-1/2 z-10 
                                   w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full 
                                   flex items-center justify-center transition-colors">
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageModal;

// Custom styles for the modal swiper
const styles = `
  .image-modal-swiper .swiper-pagination {
    bottom: 20px !important;
    display: flex;
    justify-content: center;
    gap: 8px;
  }

  .image-modal-bullet {
    width: 12px;
    height: 12px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .image-modal-bullet-active {
    background: white;
    transform: scale(1.2);
  }

  .image-modal-swiper .swiper-button-disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
