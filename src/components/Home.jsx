import AboutSection from "./AboutSection";
import AdvBooking from "./AdvBooking";
import AdvCost from "./AdvCost";
import BackToTopButton from "./BackToTopButton";
import BookingFormSection from "./BookingFormSection";
import DevelopedBy from "./DevelopedBy";
import Footer from "./Footer";
import Header from "./Header";
import Hero from "./Hero";
import MobileMenu from "./MobileMenu";
import QASection from "./QASection";
import ServicesAndPricing from "./ServicesAndPricing";
// Removed: import TestimonialVideos from "./TestimonialVideos";

function Home() {
  return (
    <main className="bg-dark-1 px-3 py-4 md:p-6 font-roboto">
      <MobileMenu />
      <Hero />

      <div className="mt-3 sm:mt-4 md:mt-6">
        <AdvCost />
      </div>

      <div className="mt-3 sm:mt-4 md:mt-6">
        <AdvBooking />
      </div>

      <div className="mt-3 sm:mt-4 md:mt-6">
        <ServicesAndPricing />
      </div>
      {/* <div className="mt-3 sm:mt-4 md:mt-6">
        <ConsultationSection />
      </div> */}
      {/* <div className="mt-3 sm:mt-4 md:mt-6">
        <BonusProgram />
      </div> */}
      <div className="mt-3 sm:mt-4 md:mt-6">
        {/* Removed Video Reviews section */}
        {/* <TestimonialVideos /> */}
      </div>
      <div className="mt-3 sm:mt-4 md:mt-6">
        <AboutSection />
      </div>
      {/* <div className="mt-3 sm:mt-4 md:mt-6">
        <CircularCarousel />
      </div> */}
      {/* <div className="mt-3 sm:mt-4 md:mt-6">
        <HealthAndBeautySection />
      </div> */}

      <div className="mt-3 sm:mt-4 md:mt-6">
        <BookingFormSection />
      </div>

      <div className="mt-3 sm:mt-4 md:mt-6">
        <QASection />
      </div>
      {/* <div className="mt-3 sm:mt-4 md:mt-6">
        <ContactSection />
      </div> */}

      <Footer />

      <DevelopedBy />
      <BackToTopButton />
    </main>
  );
}

export default Home;
