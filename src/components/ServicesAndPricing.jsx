import {motion} from "framer-motion";
import {useEffect, useRef, useState} from "react";
import Button from "./Button";
import ServiceAccordion from "./ServiceAccordion";

function ServicesAndPricing() {
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
        threshold: 0.2,
        rootMargin: "0px 0px -100px 0px",
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

  const containerVariants = {
    hidden: {opacity: 0},
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  return (
    <div
      id="services"
      ref={sectionRef}
      className="bg-black text-white py-8 sm:py-12 md:py-16 px-3 sm:px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="space-y-4 sm:space-y-6 md:space-y-8">
          <motion.div
            variants={itemVariants}
            className="text-center mb-2 sm:mb-3 md:mb-4">
            <p
              className="text-gray-400 text-[10px] sm:text-xs 
              uppercase tracking-wider mb-2 sm:mb-3 md:mb-4">
              Services and Pricing
            </p>
            <div className="w-[1px] h-8 sm:h-12 md:h-16 bg-white mx-auto"></div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="text-center mb-3 sm:mb-4 md:mb-6">
            <h2
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold 
              max-w-4xl mx-auto">
              We provide fast and comfortable dental implant and full-mouth rehabilitation solutions, from consultation to advanced procedures.
            </h2>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="text-center mb-1 sm:mb-2">
            <p
              className="text-gray-400 text-sm sm:text-base md:text-lg 
              max-w-xl mx-auto">
              Every treatment is planned with precision to ensure minimal visits, maximum comfort, and lasting results — all performed according to international standards.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="text-center mb-4 sm:mb-6 md:mb-8">
            <Button variation="link" size="small">
              View Price List
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-4 sm:mb-6 md:mb-8">
            <ServiceAccordion />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default ServicesAndPricing;
