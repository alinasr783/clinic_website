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

        

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="space-y-6 max-w-3xl">
            <p className="text-base text-gray-300 leading-relaxed">
              At MI Implants, led by Dr. Mohamed Ibrahim, we specialize in dental implants and full-mouth rehabilitation, delivering smiles with precision, comfort, and minimal visits. Using advanced techniques such as zygomatic and subperiosteal implants, guided implant surgery, and immediate-load protocols, we provide solutions for even the most complex cases.
            </p>
            <p className="text-base text-gray-300 leading-relaxed">
              Our approach is patient-centered: every treatment is tailored to your needs, ensuring lasting results, natural aesthetics, and long-term oral health. We also provide dedicated support for international patients, making travel, consultation, and treatment seamless and stress-free.
            </p>
            <div className="mt-6">
              <img
                src="https://i.ibb.co/tpnsMmf5/Picture1.jpg"
                alt="About section image"
                className="w-full h-64 md:h-72 lg:h-80 object-cover rounded-2xl border border-white/10"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 md:max-w-[450px] lg:max-w-none">
            {counter.map((item) => (
              <div
                key={item.id}
                className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition"
              >
                <div className="text-3xl lg:text-4xl font-semibold mb-2">
                  {item.count}
                </div>
                <div className="text-sm text-gray-300 leading-relaxed">
                  {item.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
