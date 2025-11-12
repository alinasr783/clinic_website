import {X} from "lucide-react";
import {useEffect} from "react";
import CertificateSlider from "./CertificateSlider";

function DoctorModal({doctor, onClose}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-y-auto font-roboto">
      <div className="bg-black text-white w-full min-h-screen relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="fixed top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8 z-20 text-white 
            hover:text-gray-300 transition-colors bg-black 
            bg-opacity-50 rounded-full p-2"
          aria-label="Close modal">
          <X className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        {/* Centered Heading */}
        <div className="text-center pt-8 sm:pt-12 lg:pt-16 pb-6 sm:pb-8 lg:pb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light mb-3 sm:mb-4">
            {doctor.details.fullName}
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto px-4">
            {doctor.details.specialization}
          </p>
        </div>

        <div
          className="grid grid-cols-1 xl:grid-cols-[2fr_3fr] gap-6 
          sm:gap-8 lg:gap-12 xl:gap-16 px-4 sm:px-6 lg:px-12 xl:px-16 pb-8 sm:pb-12 lg:pb-16">
          {/* Left Side - Statistics and Certificate */}
          <div
            className="flex flex-col justify-start 
            space-y-8 sm:space-y-10 lg:space-y-12 order-2 xl:order-1 xl:pl-8">
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              <div className="text-center sm:text-left">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light mb-1 sm:mb-2">
                  {doctor.details.yearsOfExperience}
                </div>
                <div className="text-xs text-gray-300">
                  {doctor.details.experienceDescription}
                </div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light mb-1 sm:mb-2">
                  15+
                </div>
                <div className="text-xs text-gray-300">
                  Specialist since 2009 in Stomatological Association of Russia
                </div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light mb-1 sm:mb-2">
                  {doctor.details.patientsCount}
                </div>
                <div className="text-xs text-gray-300">
                  {doctor.details.patientsDescription}
                </div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light mb-1 sm:mb-2">
                  {doctor.details.certificatesCount}
                </div>
                <div className="text-xs text-gray-300">
                  {doctor.details.certificatesDescription}
                </div>
              </div>
            </div>

            <CertificateSlider certificates={doctor.details.certificates} />
          </div>

          {/* Right Side - Doctor Image and Details */}
          <div
            className="flex flex-col justify-start space-y-6 
            sm:space-y-8 order-1 xl:order-2">
            <div className="flex justify-center xl:justify-start">
              <div
                className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 
                lg:w-96 lg:h-96 xl:w-[400px] xl:h-[400px] rounded-lg overflow-hidden">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="text-gray-300 text-sm sm:text-base leading-relaxed text-center xl:text-left">
              <p className="mb-4 sm:mb-6">{doctor.details.qualifications[0]}</p>
            </div>

            <div className="text-center xl:text-left">
              <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4 text-white">
                {doctor.details.education}
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 mb-4 sm:mb-6">
                {doctor.details.educationDetails}
              </p>
            </div>

            <div className="text-center xl:text-left">
              <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4 text-white">
                Повышение квалификации:
              </h3>
              <div className="space-y-2">
                {doctor.details.qualifications.map((qualification, index) => (
                  <p key={index} className="text-xs sm:text-sm text-gray-300">
                    {qualification}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorModal;
