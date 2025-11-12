import {useEffect, useRef, useState} from "react";
import Button from "./Button";

function AdvBooking() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          const img = new Image();
          img.src = "/items.jpg";
          img.onload = () => setImageLoaded(true);
          img.onerror = () => setImageLoaded(true);
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

  return (
    <section
      ref={sectionRef}
      className="bg-white rounded-2xl overflow-hidden"
      data-section="info">
      <div className="relative h-[420px] md:h-[520px]">
        {!imageLoaded && isVisible && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {isVisible && (
          <img
            src="/items.jpg"
            alt="Dental instruments"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            loading="lazy"
            style={{
              willChange: "opacity",
              backfaceVisibility: "hidden",
            }}
          />
        )}

        <div className="absolute inset-0 flex items-center justify-center md:justify-start">
          <div
            className="mx-4 md:mx-0 md:ml-10 bg-dark-2 text-white rounded-2xl 
            p-6 md:p-10 max-w-[700px] w-full md:w-auto h-[90%] flex 
                flex-col items-center justify-center text-center">
            <div className="text-center text-[11px] text-gray-300 leading-tight mb-6">
              <div>"Natura Smile Dental Clinic"</div>
              <div>License No. LO-77-02-1415 dated 30.08.2021</div>
            </div>

            <p className="text-lg md:text-2xl sm:w-[70%] leading-snug text-center mb-8">
              Have questions about your smile? Connect with our experts for personalized guidance on implants and full-mouth rehabilitation.
            </p>

            <div className="flex justify-center w-full">
              <a href="#booking">
                <Button variation="primary" size="medium">
                  Schedule online Consultation
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdvBooking;
