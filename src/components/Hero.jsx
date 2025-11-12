import Header from "./Header";
import HeroContent from "./HeroContent";

function Hero() {
  return (
    <div
      className="bg-dark-2 rounded-2xl p-3 sm:p-4 md:p-6 
      h-[70vh] sm:h-[75vh] md:h-[80vh] flex flex-col">
      <Header />
      <div className="flex-1">
        <HeroContent />
      </div>
    </div>
  );
}

export default Hero;
