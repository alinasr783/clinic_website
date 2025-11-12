const AboutSection = () => {
  const counter = [
    {
      id: 1,
      count: "1000+",
      title: "Satisfied Patients",
    },
    {
      id: 2,
      count: "15+",
      title: "Years of Experience",
    },
    {
      id: 3,
      count: 10,
      title: "Dentists",
    },
    {
      id: 4,
      count: "5+",
      title: "Branches",
    },
  ];

  return (
    <section
      className="bg-black text-white py-16 sm:py-20 lg:py-24 font-roboto"
      id="about">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4">
          <div className="flex flex-col items-center">
            <p className="text-sm sm:text-base text-gray-300 mb-4">About Us</p>
            <div className="w-px h-16 sm:h-20 bg-white"></div>
          </div>
        </div>

        <div className="text-center mb-12">
          <h2
            className="text-2xl lg:text-3xl xl:text-4xl 
            font-semibold leading-tight max-w-3xl mx-auto">
            Expert Dental Implants & Full-Mouth Rehabilitation — trusted by
            patients worldwide
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="grid grid-cols-2 gap-6 md:max-w-[450px]">
            {counter.map((item) => (
              <div className="text-left" key={item.id}>
                <div className="text-3xl lg:text-4xl font-semibold mb-2">
                  {item.count}
                </div>
                <div className="text-sm text-gray-300 leading-relaxed">
                  {item.title}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <div className="space-y-4">
                <p className="text-sm text-gray-300 leading-relaxed">
                  At MI Implants, led by Dr. Mohamed Ibrahim, we specialize in dental implants and full-mouth rehabilitation, delivering smiles with precision, comfort, and minimal visits. Using advanced techniques such as zygomatic and subperiosteal implants, guided implant surgery, and immediate-load protocols, we provide solutions for even the most complex cases.
                </p>

                <p className="text-sm text-gray-300 leading-relaxed">
                  Every plan is tailored to your needs — from single-tooth
                  replacement to full-arch solutions. With 15+ years of
                  experience and 1000+ successful implants, comfort, safety,
                  and lasting results are at the heart of our care.
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-gray-300 leading-relaxed">
                  Our team continuously trains on the latest implant systems
                  and techniques to deliver predictable outcomes in fewer
                  visits. We prioritize minimally invasive approaches, faster
                  recovery, and natural aesthetics.
                </p>

                <p className="text-sm text-gray-300 leading-relaxed">
                  Treating patients with care: high quality work, safety, and
                  comfort — our core values.
                </p>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <div className="h-64 lg:w-full lg:h-88">
                <img
                  src="https://images.pexels.com/photos/4033148/pexels-photo-4033148.jpeg"
                  alt="Dental implant excellence"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
