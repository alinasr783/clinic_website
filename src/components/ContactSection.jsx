import {motion} from "framer-motion";
import Button from "./Button";

const ContactSection = () => {
  const socialLinks = [
    {
      name: "facebook",
      link: "https://www.facebook.com/",
    },
    {
      name: "instagram",
      link: "https://www.instagram.com/",
    },
    {
      name: "twitter",
      link: "https://twitter.com/",
    },
  ];

  return (
    <section
      className="relative bg-dark-2 text-white min-h-[70vh] 
        flex items-center justify-center overflow-hidden mb-2 rounded-2xl"
      id="contacts">
      <div className="absolute top-4 sm:top-6 md:top-8 left-4 sm:left-6 md:left-8 text-left z-20">
        <div className="text-white text-xs sm:text-sm">
          <p className="font-semibold text-sm sm:text-base">MATILDA SMILE</p>
          <p className="font-semibold text-sm sm:text-base">DENTAL CLINIC</p>
          <div className="mt-1 sm:mt-2 text-xs text-gray-300">
            <p className="hidden sm:block">All types of dental services</p>
            <p className="hidden sm:block">
              Licensed by +7 (7-495-920) at 08:00-20:00
            </p>
            <p className="sm:hidden">Dental services</p>
            <p className="sm:hidden">08:00-20:00</p>
          </div>
        </div>
      </div>

      <div className="absolute top-4 sm:top-6 md:top-8 right-4 sm:right-6 md:right-8 text-right z-20">
        <div className="text-white text-xs sm:text-sm">
          <a
            href="tel:+79859201221"
            className="text-base sm:text-lg font-semibold hover:text-gray-300 transition-colors block">
            +7 (985) 920 1221
          </a>
          <div className="mt-1 sm:mt-2 text-xs text-gray-300">
            <p className="hidden md:block">
              Octyabrskoye Pole, Panfilovskaya metro stations,
            </p>
            <p className="hidden md:block">
              2 Marshala Rybalko St., bldg. 9, office 229
            </p>
            <p className="md:hidden">Octyabrskoye Pole metro</p>
            <p className="md:hidden">2 Marshala Rybalko St.</p>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors underline text-xs">
              How to get there
            </a>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <img
            src="/hero.png"
            alt="Diamond"
            className="w-[500px] md:w-[600px] lg:w-[700px] xl:w-[800px] object-contain opacity-30"
            style={{
              filter: "brightness(1.2) contrast(1.1)",
            }}
          />
        </div>
      </div>

      <div className="relative z-10 text-center">
        <motion.div
          initial={{opacity: 0, y: 30}}
          whileInView={{opacity: 1, y: 0}}
          transition={{duration: 1, ease: "easeOut"}}
          viewport={{once: true}}
          className="space-y-8">
          <div className="space-y-4 px-4 sm:px-6 md:px-8">
            <h1
              className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl 
              xl:text-7xl 2xl:text-8xl font-bold leading-tight tracking-wider">
              TAKE CARE OF
              <br />
              <span className="relative inline-block">
                YOUR SMILE
                <span
                  className="absolute -right-4 xs:-right-6 sm:-right-8 md:-right-12 
                  lg:-right-16 top-0 text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl 
                    xl:text-6xl 2xl:text-7xl font-script text-white/90 italic">
                  Today
                </span>
              </span>
            </h1>

            <div className="mt-8 sm:mt-12">
              <Button variation="primary" to='/cost'>Book an Appointment</Button>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 text-left z-20">
        <div className="text-xs text-gray-400 space-y-1">
          <p className="hidden sm:block">Privacy Policy</p>
          <p className="hidden sm:block">Clinical Information</p>
          <p className="text-xs sm:text-xs">
            © All rights reserved. Unauthorized copying is prohibited
          </p>
        </div>
      </div>

      <div
        className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 
        transform -translate-x-1/2 text-center z-20 hidden sm:block">
        <div
          className="text-xs text-gray-400 space-y-1 
          flex flex-col gap-1 justify-center items-center">
          {socialLinks.map((item) => (
            <a
              key={item.name}
              href={item.link}
              className="text-gray-400 hover:text-white transition-colors">
              {item.name}
            </a>
          ))}
        </div>
      </div>

      <div
        className="absolute bottom-4 sm:bottom-6 md:bottom-8 right-4 
        sm:right-6 md:right-8 text-right z-20 hidden md:block">
        <p className="text-xs text-gray-500">
          Developed by Digital Marketing Agency
        </p>
      </div>
    </section>
  );
};

export default ContactSection;
