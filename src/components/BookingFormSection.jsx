import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { createBooking, getServices, updateBooking } from "../sevices/api";
import { formatCurrency, formatDate } from "../utils/helpers";
import Button from "./Button";
import availableTimesData from "../data/availableTimes.json";

function BookingFormSection({booking = null, onBookingUpdated, onClose}) {
  const [services, setServices] = useState([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEditMode = Boolean(booking);

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm({
    mode: "onChange",
    defaultValues: {
      userName: booking?.name || "",
      userPhone: booking?.phone || "",
      selectedCountry: booking?.country || "",
      selectedService: booking?.service || "",
      selectedDate: booking?.date ? new Date(booking.date) : new Date(),
      selectedTime: booking?.time || "02:00 PM",
    },
  });

  const validationRules = {
    userName: {
      required: "Full name is required",
      minLength: {
        value: 2,
        message: "Name must be at least 2 characters long",
      },
      maxLength: {
        value: 50,
        message: "Name must be no more than 50 characters",
      },
      pattern: {
        value: /^[a-zA-Z\s'-]+$/,
        message:
          "Name can only contain letters, spaces, hyphens, and apostrophes",
      },
      validate: {
        noLeadingTrailingSpaces: (value) => {
          if (value.trim() !== value) {
            return "Name cannot start or end with spaces";
          }
          return true;
        },
        noMultipleSpaces: (value) => {
          if (/\s{2,}/.test(value)) {
            return "Name cannot contain multiple consecutive spaces";
          }
          return true;
        },
      },
    },
    userPhone: {
      required: "Phone number is required",
      validate: {
        validFormat: (value) => {
          const cleanPhone = value.replace(/\D/g, "");
          if (cleanPhone.length < 10) {
            return "Phone number must be at least 10 digits";
          }
          if (cleanPhone.length > 15) {
            return "Phone number must be no more than 15 digits";
          }
          const phonePattern = /^[\+]?[1-9][\d]{9,14}$/;
          if (!phonePattern.test(cleanPhone)) {
            return "Please enter a valid phone number";
          }
          return true;
        },
        noInvalidChars: (value) => {
          const validChars = /^[\d\s\-\(\)\+]+$/;
          if (!validChars.test(value)) {
            return "Phone number can only contain digits, spaces, hyphens, parentheses, and plus sign";
          }
          return true;
        },
      },
    },
    selectedCountry: {
      required: "Please select your country",
      validate: {
        notEmpty: (value) => {
          if (!value || value.trim() === "") {
            return "Please select a valid country";
          }
          return true;
        },
      },
    },
    selectedService: {
      required: "Please select a service",
      validate: {
        notEmpty: (value) => {
          if (!value || value.trim() === "") {
            return "Please select a valid service";
          }
          return true;
        },
      },
    },
    selectedDate: {
      required: "Please select a date",
      validate: {
        notPastDate: (value) => {
          if (!value) return "Please select a date";
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const selectedDate = new Date(value);
          selectedDate.setHours(0, 0, 0, 0);

          if (selectedDate < today) {
            return "Please select a future date";
          }
          return true;
        },
        notTooFarInFuture: (value) => {
          if (!value) return true;
          const maxDate = new Date();
          maxDate.setMonth(maxDate.getMonth() + 6); // 6 months in advance
          const selectedDate = new Date(value);

          if (selectedDate > maxDate) {
            return "Please select a date within the next 6 months";
          }
          return true;
        },
      },
    },
    selectedTime: {
      required: "Please select a time slot",
      validate: {
        validTimeSlot: (value) => {
          if (!value || value.trim() === "") {
            return "Please select a valid time slot";
          }
          // Check if the selected time is in the available times
          const availableTimes = availableTimesData.availableTimes;
          if (!availableTimes.includes(value)) {
            return "Please select a valid time slot from the available options";
          }
          return true;
        },
      },
    },
  };

  useEffect(() => {
    setIsLoadingServices(true);
    getServices()
      .then(setServices)
      .catch(console.error)
      .finally(() => setIsLoadingServices(false));
  }, []);

  const onSubmit = async (data) => {
    setError(null);
    setIsLoading(true);

    const formData = {
      name: data.userName,
      phone: data.userPhone,
      service: data.selectedService,
      date: data.selectedDate
        ? formatDate(data.selectedDate)
        : "No date selected",
      time: data.selectedTime,
      dentist: "Dr. Evelyn Reed",
    };

    try {
      console.log("Booking Form Data:", formData);

      if (isEditMode) {
        await updateBooking(booking.id, formData);

        if (onBookingUpdated) {
          onBookingUpdated({...booking, ...formData});
        }

        if (onClose) {
          onClose();
        }

        toast.success("Booking updated successfully!");
      } else {
        await createBooking(formData);
        toast.success("Booking created successfully!");

        reset({
          userName: "",
          userPhone: "",
          selectedCountry: "",
          selectedService: "",
          selectedDate: new Date(),
          selectedTime: "02:00 PM",
        });
      }
    } catch (err) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} booking:`,
        err
      );
      setError(
        `Failed to ${
          isEditMode ? "update" : "create"
        } booking. Please try again.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const ErrorMessage = ({error}) => {
    if (!error) return null;
    return (
      <p className="text-red-400 text-sm mt-1 flex items-center">
        <span className="mr-1">⚠</span>
        {error}
      </p>
    );
  };

  if (isLoadingServices) {
    return <p>Loading services...</p>;
  }

  return (
    <section
      className="bg-dark-2 p-4 sm:p-6 lg:p-8 rounded-2xl max-w-3xl mx-auto"
      id="booking">
      <form
        className="grid grid-cols-1 gap-6 lg:gap-8 w-full max-w-2xl mx-auto"
        onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6 lg:space-y-8">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-200">Your Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm sm:text-base font-medium mb-2 text-gray-300">Full Name *</label>
                <Controller
                  name="userName"
                  control={control}
                  rules={validationRules.userName}
                  render={({field}) => (
                    <input
                      {...field}
                      type="text"
                      autoComplete="name"
                      placeholder="Enter your full name"
                      className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-white focus:outline-none 
                          focus:ring-2 focus:border-transparent text-base transition-colors
                          ${
                            errors.userName
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-700 focus:ring-blue-500"
                          }`}
                    />
                  )}
                />
                <ErrorMessage error={errors.userName?.message} />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium mb-2 text-gray-300">Phone Number *</label>
                <Controller
                  name="userPhone"
                  control={control}
                  rules={validationRules.userPhone}
                  render={({field}) => (
                    <input
                      {...field}
                      type="tel"
                      autoComplete="tel"
                      placeholder="Enter your phone number (e.g., +1234567890)"
                      className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-white focus:outline-none 
                          focus:ring-2 focus:border-transparent text-base transition-colors
                          ${
                            errors.userPhone
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-700 focus:ring-blue-500"
                          }`}
                    />
                  )}
                />
                <ErrorMessage error={errors.userPhone?.message} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-lg font-semibold mb-4 text-gray-200">
              Select a Service *
            </label>
            <div className="relative">
              <Controller
                name="selectedService"
                control={control}
                rules={validationRules.selectedService}
                render={({field}) => (
                  <select
                    {...field}
                    className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-white focus:outline-none 
                        focus:ring-2 focus:border-transparent appearance-none cursor-pointer text-base transition-colors
                        ${
                          errors.selectedService
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-700 focus:ring-blue-500"
                        }`}>
                    <option value="" disabled>
                      Please select a service
                    </option>
                    {services.map((service) => (
                      <option key={service.id} value={service.title}>
                        {service.title} {formatCurrency(service.price)}
                      </option>
                    ))}
                  </select>
                )}
              />
              <div
                className="absolute inset-y-0 right-0 
                flex items-center px-2 pointer-events-none">
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <ErrorMessage error={errors.selectedService?.message} />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-200">
              Our Dentist
            </h3>
              <div className="flex items-center space-x-4 bg-gray-800 p-4 rounded-lg shadow-md">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center flex-shrink-0">
                <img
                  src="/logo.jpeg"
                  alt="Dentist"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-white text-sm sm:text-base">
                  Dr. Evelyn Reed
                </h4>
                <p className="text-gray-400 text-xs sm:text-sm">
                  General & Cosmetic Dentistry
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-200">
              Select a Date
            </h3>

              <div className="bg-gray-800 rounded-lg p-2 sm:p-4 overflow-x-auto shadow-md">
              <Controller
                name="selectedDate"
                control={control}
                rules={validationRules.selectedDate}
                render={({field}) => (
                  <DayPicker
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={{before: new Date()}}
                    style={{
                      "--rdp-cell-size": "32px",
                      "--rdp-accent-color": "#fff",
                      "--rdp-background-color": "#374151",
                      "--rdp-accent-color-dark": "#2563eb",
                      "--rdp-background-color-dark": "#1f2937",
                      "--rdp-outline": "2px solid var(--rdp-accent-color)",
                      "--rdp-outline-selected":
                        "2px solid var(--rdp-accent-color)",
                      color: "#e5e7eb",
                      backgroundColor: "transparent",
                      fontSize: "14px",
                    }}
                    className="rdp-dark mx-auto"
                    classNames={{
                      months: "rdp-months",
                      month: "rdp-month",
                      caption:
                        "rdp-caption text-white font-semibold text-sm sm:text-base",
                      caption_label: "rdp-caption_label text-white",
                      nav: "rdp-nav",
                      nav_button:
                        "rdp-nav_button text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg p-1 sm:p-2",
                      nav_button_previous: "rdp-nav_button_previous",
                      nav_button_next: "rdp-nav_button_next",
                      table: "rdp-table w-full min-w-[280px]",
                      head_row: "rdp-head_row",
                      head_cell:
                        "rdp-head_cell text-gray-400 font-medium text-xs sm:text-sm p-1 sm:p-2",
                      row: "rdp-row",
                      cell: "rdp-cell",
                      button:
                        "rdp-button w-full h-8 sm:h-10 text-xs sm:text-sm rounded-lg transition-colors text-gray-300 hover:bg-gray-700",
                      button_reset: "rdp-button_reset",
                      day: "rdp-day",
                      day_today: "rdp-day_today font-semibold",
                      day_selected:
                        "rdp-day_selected bg-blue-600 text-white font-semibold hover:bg-blue-700",
                      day_disabled:
                        "rdp-day_disabled text-gray-600 cursor-not-allowed",
                      day_outside: "rdp-day_outside text-gray-600",
                      day_range_middle: "rdp-day_range_middle",
                      day_hidden: "rdp-day_hidden",
                    }}
                  />
                )}
              />
              <ErrorMessage error={errors.selectedDate?.message} />
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:space-y-8">
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-200">Available Times</h3>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-3">
              <Controller
                name="selectedTime"
                control={control}
                rules={validationRules.selectedTime}
                render={({field}) => (
                  <>
                    {availableTimesData.availableTimes.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => field.onChange(time)}
                        className={`
                          w-full p-3 rounded-lg border-2 transition-all duration-200 text-left text-sm sm:text-base
                          ${
                            field.value === time
                              ? "border-white bg-gray-700 text-white font-semibold"
                              : "border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500 hover:bg-gray-700"
                          }
                        `}
                      >
                        {time}
                      </button>
                    ))}
                  </>
                )}
              />
              <ErrorMessage error={errors.selectedTime?.message} />
            </div>
          </div>

          <div className="mt-6 text-center">
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? `${isEditMode ? "Updating" : "Creating"} Booking...`
                : `${isEditMode ? "Update" : "Confirm"} Appointment`}
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}

export default BookingFormSection;
