import {motion as Motion} from "framer-motion";
import {useEffect, useRef, useState} from "react";
import Button from "./Button";

function ConsultationSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const sectionRef = useRef(null);

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

    const node = sectionRef.current;
    if (node) {
      observer.observe(node);
    }

    return () => {
      if (node) {
        observer.unobserve(node);
      }
    };
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src =
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(true);
  }, []);

  const containerVariants = {
    hidden: {opacity: 0},
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: {opacity: 0},
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative rounded-2xl mb-12
        overflow-hidden py-20 bg-dark-2">
      <div
        className="absolute left-[-100px] bottom-[-100px] 
        transform -translate-x-1/4 translate-y-1/4">
        <img
          src="/hero.png"
          alt="Diamond"
          className="w-[500px] md:w-[700px] lg:w-[800px] 
            xl:w-[900px] object-contain opacity-30"
          style={{
            filter: "blur(1px)",
          }}
        />
      </div>

      <Motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        className="relative z-10 h-full flex items-center justify-center px-4 md:px-8">
        <div
          className="text-center text-white lg:max-w-[40%] 
          md:max-w-[50%] max-w-[80%] mx-auto">
          <Motion.h2
            variants={itemVariants}
            className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
            Primary Consultation of the Chief Physician
          </Motion.h2>

          <Motion.p
            variants={itemVariants}
            className="text-base text-gray-300 mb-4 
              max-w-md mx-auto leading-relaxed font-light ">
            “I will select a team of doctors most suitable for your case and
            personally oversee the entire treatment process at our clinic.”
          </Motion.p>

          <Motion.div
            variants={itemVariants}
            className="flex flex-col items-center mb-8 md:mb-10 max-w-[50%] mx-auto">
            <div className="relative mb-6">
              {!imageLoaded && (
                <div
                  className="w-32 h-32 md:w-40 md:h-40 
                  rounded-full bg-gray-600 animate-pulse"
                />
              )}

              {imageLoaded && (
                <img
                  src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Chief Physician"
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white/30"
                />
              )}

              <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center">
                <h3
                  className="font-script font-medium text-white 
                    tracking-normal leading-none whitespace-nowrap text-3xl md:text-5xl">
                  Savkina E. V.
                </h3>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-300 font-light">
                Chief Physician of the clinic, aesthetic
                <br />
                dentist, therapist, orthopedist
              </p>
            </div>
          </Motion.div>

          <Motion.p
            variants={itemVariants}
            className="text-base text-gray-300 
              mb-4 max-w-lg mx-auto leading-relaxed font-semibold">
            Schedule a consultation to receive a personalized treatment plan. We
            consider every aspect of your health and ensure the best possible
            results.
          </Motion.p>

          <Motion.div variants={itemVariants}>
            <Button variation="primary" size="medium" to="/cost">
              Book an Appointment
            </Button>
          </Motion.div>
        </div>
      </Motion.div>
    </section>
  );
}

export default ConsultationSection;
