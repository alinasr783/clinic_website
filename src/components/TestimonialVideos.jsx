import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import LazyVideo from "./LazyVideo";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function TestimonialVideos() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sectionRef = useRef(null);
  const swiperRef = useRef(null);

  const testimonialVideos = [
    {
      id: 1,
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      patientName: "Sarah Johnson",
      treatment: "Dental Implants",
    },
    {
      id: 2,
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      patientName: "Michael Chen",
      treatment: "Teeth Whitening",
    },
    {
      id: 3,
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      patientName: "Emma Rodriguez",
      treatment: "Orthodontics",
    },
    {
      id: 4,
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      patientName: "David Thompson",
      treatment: "Cosmetic Dentistry",
    },
    {
      id: 5,
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      patientName: "Lisa Anderson",
      treatment: "Root Canal",
    },
    {
      id: 6,
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      patientName: "James Wilson",
      treatment: "Dental Cleaning",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const openModal = useCallback((video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedVideo(null);
    document.body.style.overflow = "unset";
  }, []);

  const containerVariants = {
    hidden: {opacity: 0, y: 50},
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {opacity: 0, y: 30},
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const modalVariants = {
    hidden: {opacity: 0, scale: 0.8},
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="bg-black text-white py-12 md:py-16 px-4 md:px-6" id="videos">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}>
          <motion.div
            variants={itemVariants}
            className="text-center mb-12 relative">
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">
              Video Reviews
            </p>
            <div className="w-px h-12 bg-white mx-auto mb-2"></div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Happy Faces:
            </h2>
            <p className="md:text-lg text-gray-300">
              Genuine Impressions of Our Patients
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="relative">
            <Swiper
              ref={swiperRef}
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              navigation={{
                prevEl: ".swiper-button-prev-custom",
                nextEl: ".swiper-button-next-custom",
              }}
              pagination={{
                clickable: true,
                bulletClass: "swiper-pagination-bullet-custom",
                bulletActiveClass: "swiper-pagination-bullet-active-custom",
              }}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 24,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 28,
                },
                1280: {
                  slidesPerView: 5,
                  spaceBetween: 32,
                },
              }}
              className="testimonial-swiper">
              {testimonialVideos.map((video) => (
                <SwiperSlide key={video.id}>
                  <LazyVideo video={video} onVideoClick={openModal} />
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>

          {/* pagination */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              className="swiper-button-prev-custom w-12 h-12 
              bg-white/10 backdrop-blur-sm rounded-full flex 
              items-center justify-center hover:bg-white/20 transition-colors">
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <div className="swiper-pagination flex gap-2"></div>

            <button
              className="swiper-button-next-custom w-12 h-12 bg-white/10 
              backdrop-blur-sm rounded-full flex items-center justify-center 
              hover:bg-white/20 transition-colors">
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isModalOpen && selectedVideo && (
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-sm 
              z-50 flex items-center justify-center p-4"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            onClick={closeModal}>
            <motion.div
              className="relative max-w-4xl w-full aspect-video 
                bg-black rounded-2xl overflow-hidden"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}>
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 
                  backdrop-blur-sm rounded-full flex items-center 
                  justify-center hover:bg-black/70 transition-colors">
                <X className="w-6 h-6 text-white" />
              </button>

              <video
                src={selectedVideo.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-cover"
                poster={selectedVideo.thumbnail}>
                Your browser does not support the video tag.
              </video>

              <div
                className="absolute bottom-0 left-0 right-0 
              bg-gradient-to-t from-black/80 to-transparent p-6">
                <h3 className="text-white text-xl font-semibold mb-2">
                  {selectedVideo.patientName}
                </h3>
                <p className="text-gray-300">
                  Treatment: {selectedVideo.treatment}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* custom styles */}
      <style>{`
        .testimonial-swiper .swiper-pagination {
          position: static !important;
          margin-top: 2rem;
        }

        .swiper-pagination-bullet-custom {
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .swiper-pagination-bullet-active-custom {
          background: white;
          transform: scale(1.2);
        }

        .swiper-button-prev-custom:hover,
        .swiper-button-next-custom:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </section>
  );
}

export default memo(TestimonialVideos);
