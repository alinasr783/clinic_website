import { AnimatePresence, motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { useState } from "react";

const qaData = [
  {
    id: 1,
    question: "What are dental implants and how do they work?",
    answer:
      "Dental implants are titanium or zirconia posts placed in the jawbone to replace missing tooth roots. They integrate with the bone (osseointegration) and support crowns, bridges, or full-arch restorations for a natural look and function.",
  },
  {
    id: 2,
    question: "Am I a candidate for dental implants?",
    answer:
      "Most adults with good oral health are candidates. We evaluate bone density, gum health, medical history, and personal goals. If bone loss is present, options like bone grafting, sinus lifts, or zygomatic implants may be recommended.",
  },
  {
    id: 3,
    question: "How long does the implant process take?",
    answer:
      "Depending on your case: same-day implants are possible in selected cases. Otherwise, typical timelines range from 2–6 months, including healing and final restoration placement.",
  },
  {
    id: 4,
    question: "What is All-on-4® / All-on-6®?",
    answer:
      "These are full-arch solutions using 4 or 6 implants to support a fixed bridge. They offer high stability, faster treatment, and fewer implants, often ideal for full-mouth rehabilitation.",
  },
  {
    id: 5,
    question: "Do implants look and feel natural?",
    answer:
      "Yes. With precise planning, modern materials, and custom prosthetics, implants look, feel, and function like natural teeth.",
  },
  {
    id: 6,
    question: "Is the procedure painful?",
    answer:
      "We use local anesthesia and minimally invasive techniques. Most patients report mild discomfort that subsides within a few days. Sedation options are available for maximum comfort.",
  },
  {
    id: 7,
    question: "How do I care for my implants?",
    answer:
      "Brush and floss daily, use interdental brushes, and visit for routine checkups. Good oral hygiene and regular maintenance are key to long-term success.",
  },
  {
    id: 8,
    question: "What is the success rate of dental implants?",
    answer:
      "With proper care, implants have a success rate of 95–98%. Our clinic follows international protocols to maximize predictability and longevity.",
  },
  {
    id: 9,
    question: "What if I have severe bone loss?",
    answer:
      "Advanced options like zygomatic or subperiosteal implants, sinus lifts, and bone grafting allow treatment even in complex cases. We tailor solutions to your anatomy and goals.",
  },
];

function QASection() {
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const openModal = (question) => {
    setSelectedQuestion(question);
  };

  const closeModal = () => {
    setSelectedQuestion(null);
  };

  return (
    <section className="relative bg-dark-1 min-h-screen py-8" id="faq">
      <div className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-2 items-stretch">
          <div className="relative h-[600px] lg:h-[700px]">
            <div className="relative h-full">
              <img
                src="/items.jpg"
                alt="Dental Equipment"
                className="w-full h-full object-cover rounded-2xl"
                style={{
                  filter: "brightness(0.8) contrast(1.1)",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent rounded-2xl"></div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <p className="text-sm text-gray-300 mb-4 uppercase tracking-wider">
                  Question - Answer
                </p>
                <div className="w-px h-12 bg-white mx-auto mb-6"></div>
                <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight">
                  We answer frequently
                  <br />
                  asked questions
                </h2>
              </div>
            </div>
          </div>

          <div className="space-y-1 h-[600px] lg:h-[700px] flex flex-col justify-center">
            {qaData.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{opacity: 0, x: 20}}
                whileInView={{opacity: 1, x: 0}}
                transition={{duration: 0.5, delay: index * 0.1}}
                viewport={{once: true}}
                className="bg-white rounded-2xl p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-300"
                onClick={() => openModal(item)}>
                <div className="flex items-center justify-between">
                  <h3 className="sm:text-sm text-xs font-medium text-gray-900 pr-4 leading-relaxed">
                    {item.question}
                  </h3>
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8  flex items-center justify-center">
                      <Plus className="w-5 h-5 text-dark-1" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedQuestion && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.3}}>
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={closeModal}
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
            />

            {/* Modal Content */}
            <motion.div
              className="relative bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              initial={{opacity: 0, scale: 0.9, y: 20}}
              animate={{opacity: 1, scale: 1, y: 0}}
              exit={{opacity: 0, scale: 0.9, y: 20}}
              transition={{duration: 0.3, ease: "easeOut"}}
              onClick={(e) => e.stopPropagation()}>
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 w-10 h-10 bg-gray-100 
                  hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
                <X className="w-5 h-5 text-gray-600" />
              </button>

              <div className="pr-12">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6 leading-relaxed">
                  {selectedQuestion.question}
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {selectedQuestion.answer}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default QASection;
