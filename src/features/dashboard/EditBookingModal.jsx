import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import { useEffect, useState } from "react";
import "react-day-picker/style.css";
import Button from "../../components/Button";
import { getServices, updateBooking } from "../../sevices/api";
import { formatCurrency, formatDate } from "../../utils/helpers";

function EditBookingModal({isOpen, onClose, booking, onBookingUpdated}) {
  const [services, setServices] = useState([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [selectedService, setSelectedService] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setIsLoadingServices(true);
      getServices()
        .then(setServices)
        .catch(console.error)
        .finally(() => setIsLoadingServices(false));

      if (booking?.service) {
        setSelectedService(booking.service);
      }
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, booking]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedService) {
      setError("Please select a service");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const updatedBooking = {
        ...booking,
        service: selectedService,
      };

      await updateBooking(booking.id, updatedBooking);

      if (onBookingUpdated) {
        onBookingUpdated(updatedBooking);
      }

      onClose();
    } catch (err) {
      console.error("Error updating booking:", err);
      setError("Failed to update booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const modalVariants = {
    hidden: {opacity: 0, scale: 0.8, y: 50},
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {duration: 0.2},
    },
  };

  const backdropVariants = {
    hidden: {opacity: 0},
    visible: {opacity: 1},
    exit: {opacity: 0},
  };

  if (!booking) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            className="relative bg-dark-2 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 
                         rounded-full flex items-center justify-center transition-colors">
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Modal Header */}
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-2xl font-semibold text-white">
                Edit Booking
              </h2>
              <p className="text-gray-400 mt-1">
                Modify the service for this appointment
              </p>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-gray-200">
                        Personal Information
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-300">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={booking.name || ""}
                            disabled
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 
                                     text-gray-400 cursor-not-allowed opacity-60"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-300">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={booking.phone || ""}
                            disabled
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 
                                     text-gray-400 cursor-not-allowed opacity-60"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-300">
                            Country
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={booking.country || ""}
                              disabled
                              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 
                                       text-gray-400 cursor-not-allowed opacity-60"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-lg font-semibold mb-4 text-gray-200">
                        Select a Service *
                      </label>
                      <div className="relative">
                        <select
                          value={selectedService}
                          onChange={(e) => setSelectedService(e.target.value)}
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 
                                   text-white focus:outline-none focus:ring-2 focus:ring-white-500 
                                   focus:border-transparent appearance-none cursor-pointer"
                          required>
                          <option value="" disabled>
                            {isLoadingServices
                              ? "Loading services..."
                              : "Please select a service"}
                          </option>
                          {services.map((service) => (
                            <option key={service.id} value={service.title}>
                              {service.title} {formatCurrency(service.price)}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <ChevronDown className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-gray-200">
                        Dentist
                      </h3>
                      <div className="flex items-center space-x-4 bg-gray-700 p-4 rounded-lg opacity-60">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                          <img
                            src="/logo.jpeg"
                            alt="Dentist"
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-gray-400 text-sm">
                            {booking.dentist || "Dr. Evelyn Reed"}
                          </h4>
                          <p className="text-gray-500 text-xs">
                            General & Cosmetic Dentistry
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-gray-200">
                        Appointment Date & Time
                      </h3>

                      <div className="mb-6">
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                          Selected Date
                        </label>
                        <input
                          type="text"
                          value={
                            booking.date
                              ? formatDate(new Date(booking.date))
                              : ""
                          }
                          disabled
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 
                                   text-gray-400 cursor-not-allowed opacity-60"
                        />
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                          Selected Time
                        </label>
                        <input
                          type="text"
                          value={booking.time || ""}
                          disabled
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 
                                   text-gray-400 cursor-not-allowed opacity-60"
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-gray-200">
                        Appointment Summary
                      </h3>
                      <div className="bg-gray-800 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">
                            Country:
                          </span>
                          <span className="text-white font-medium text-sm">
                            {booking.country || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">
                            Service:
                          </span>
                          <span className="text-white font-medium text-sm">
                            {selectedService || "No service selected"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Date:</span>
                          <span className="text-white font-medium text-sm">
                            {booking.date
                              ? formatDate(new Date(booking.date))
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Time:</span>
                          <span className="text-white font-medium text-sm">
                            {booking.time || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">
                            Dentist:
                          </span>
                          <span className="text-white font-medium text-sm">
                            {booking.dentist || "Dr. Evelyn Reed"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {error && (
                      <div className="p-3 bg-red-900/50 border border-red-500 rounded-lg">
                        <p className="text-red-200 text-sm">{error}</p>
                      </div>
                    )}

                    <div className="flex gap-3 pt-4">
                      <Button variation="secondary" size="medium" onClick={onClose}>
                        Cancel
                      </Button>

                      <Button
                        type="submit"
                        variant="secondary"
                        disabled={isLoading || !selectedService}
                        className="flex-1">
                        {isLoading ? "Updating..." : "Update Booking"}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default EditBookingModal;
