import {motion as Motion} from "framer-motion";
import {useEffect, useRef, useState} from "react";
import Button from "./Button";

function BonusProgram() {
  const [isVisible, setIsVisible] = useState(false);
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
      className="relative rounded-2xl mb-12 overflow-hidden bg-dark-2">
      <div
        className="absolute right-9 rounded-2xl 
            top-[-100px] transform -translate-x-1/4 -translate-y-1/4">
        <img
          src="/hero.png"
          alt="Diamond"
          className="w-[500px] md:w-[700px] lg:w-[800px] 
            xl:w-[900px] object-contain opacity-20"
          style={{
            filter: "blur(1px)",
          }}
        />
      </div>

      <Motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        className="relative z-10 grid grid-cols-1 md:grid-cols-2 min-h-[400px] sm:min-h-[500px]">
        <div
          className="flex flex-col items-center max-w-[600px] mx-auto 
            justify-center p-6 sm:p-8 md:p-12 pl-6 sm:pl-8 md:pl-12 lg:pl-16">
          <Motion.h2
            variants={itemVariants}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl 
                font-bold text-white mb-6 md:mb-8 leading-tight text-center md:text-left">
            Bonus Program
          </Motion.h2>

          <Button variation="primary" size="medium" to="/cost">
            Book an Appointment
          </Button>
        </div>

        <div
          className="bg-dark-2 p-6 sm:p-8 md:p-12 
            flex flex-col justify-between items-start rounded-2xl space-y-6 md:space-y-8">
          <Motion.p
            variants={itemVariants}
            className="text-white text-base sm:text-lg md:text-xl 
                leading-relaxed text-center md:text-left">
            To all patients after the first visit, we credit{" "}
            <span className="font-bold">20,000 bonus $</span> to the account,
            which can be spent by paying with them:
          </Motion.p>

          <Motion.div
            variants={itemVariants}
            className="flex  sm:flex-row justify-between gap-4 
              sm:gap-6 md:gap-8 items-center sm:items-start w-full">
            <div className="text-center sm:text-left">
              <div
                className="text-3xl sm:text-4xl md:text-5xl 
                font-bold text-white mb-1 md:mb-2">
                25%
              </div>
              <div className="text-xs sm:text-sm text-gray-300">
                (for therapy)
              </div>
            </div>

            <div className="text-center sm:text-left">
              <div
                className="text-3xl sm:text-4xl md:text-5xl 
                font-bold text-white mb-1 md:mb-2">
                15%
              </div>
              <div className="text-xs sm:text-sm text-gray-300">
                (for implantation)
              </div>
            </div>

            <div className="text-center sm:text-left">
              <div
                className="text-3xl sm:text-4xl md:text-5xl 
                font-bold text-white mb-1 md:mb-2">
                10%
              </div>
              <div className="text-xs sm:text-sm text-gray-300">
                (for prosthetics)
              </div>
            </div>
          </Motion.div>
        </div>
      </Motion.div>
    </section>
  );
}

export default BonusProgram;
