import AppHeaderText from "../components/AppHeaderText";
import BookingForm from "../features/booking/BookingForm";

function Booking() {
  return (
    <div
      className="flex flex-col items-center 
      gap-12 px-3 py-4 md:p-6 min-h-screen">
      <AppHeaderText
        title="Schedule Your Appointment"
        subtitle="Quickly and easily book your next visit with us."
      />

      <div className="w-full">
        <BookingForm />
      </div>
    </div>
  );
}

export default Booking;
