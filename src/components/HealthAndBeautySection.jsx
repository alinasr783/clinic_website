import {useState} from "react";
import ImageModal from "./ImageModal";
import LazyImage from "./LazyImage";

const HealthAndBeautySection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const images = [
    {
      src: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=800&q=80",
      alt: "Modern dental clinic interior",
    },
    {
      src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=800&q=80",
      alt: "Modern medical building exterior",
    },
    {
      src: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=800&q=80",
      alt: "Professional dental instruments",
    },
    {
      src: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=800&q=80",
      alt: "Dentist examining patient",
    },
    {
      src: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=800&q=80",
      alt: "Advanced dental equipment",
    },
  ];

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <section
      className="bg-black text-white py-16 sm:py-20 lg:py-24 font-roboto"
      id="clinic-photos">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex flex-col items-center">
            <p className="text-sm sm:text-base text-gray-300 mb-4">
              Our Clinic
            </p>
            <div className="w-px h-16 sm:h-20 bg-white mb-8"></div>
          </div>

          <h2 className="text-2xl lg:text-3xl xl:text-4xl font-semibold leading-tight max-w-4xl mx-auto">
            Immerse yourself in a world of health and beauty: we have done
            everything to make your treatment as comfortable as possible
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 max-w-7xl mx-auto">
          {images.map((image, index) => (
            <div
              key={index}
              className={`${
                index === 2
                  ? "col-span-2 lg:col-span-1"
                  : "col-span-1 lg:col-span-1"
              }`}>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group">
                <LazyImage
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full transition-transform duration-300 group-hover:scale-105"
                  onClick={() => handleImageClick(index)}
                />
              </div>
            </div>
          ))}
        </div>

        <ImageModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          images={images}
          initialIndex={selectedImageIndex}
        />
      </div>
    </section>
  );
};

export default HealthAndBeautySection;
