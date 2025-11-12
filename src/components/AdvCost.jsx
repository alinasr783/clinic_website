import {useRef} from "react";
import Button from "./Button";

function AdvCost() {
  const sectionRef = useRef(null);

  return (
    <section
      ref={sectionRef}
      className="w-full rounded-2xl overflow-hidden bg-dark-2"
      id="cost"
      data-section="cost">
      <div className="relative h-[420px] md:h-[520px]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="mx-auto px-4 text-white rounded-2xl 
            p-6 md:p-10 max-w-[800px] w-full h-[90%] flex 
                flex-col items-center justify-center text-center">
            <div className="text-center text-[11px] text-gray-300 leading-tight mb-6">
              <div>"Natura Smile Dental Clinic"</div>
              <div>License No. LO-77-02-1415 dated 30.08.2021</div>
            </div>

            <p className="text-lg md:text-2xl sm:w-[70%] leading-snug text-center mb-8">
              Expert Dental Implants & Full-Mouth Rehabilitation for Patients from Around the World. Discover how easily you can achieve your perfect smile from abroad.
            </p>

            <div className="flex justify-center w-full">
              <Button variation="primary" size="medium" to="/cost">
                Calculate Journey Cost
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdvCost;
