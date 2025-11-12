import {AnimatePresence, motion} from "framer-motion";
import {Plus, Trash2, X} from "lucide-react";
import {useEffect} from "react";
import {useForm, useFieldArray} from "react-hook-form";
import Button from "../../components/Button";

function AddServiceModal({isOpen, onClose, onSubmit, editingService = null}) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: {errors, isSubmitting},
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      price: "",
      details: [{value: ""}],
    },
  });

  const {fields, append, remove} = useFieldArray({
    control,
    name: "details",
  });

  // Reset form when modal opens or editingService changes
  useEffect(() => {
    if (isOpen) {
      if (editingService) {
        // Populate form with existing service data
        reset({
          title: editingService.title || "",
          description: editingService.description || "",
          price: editingService.price?.toString() || "",
          details:
            editingService.details?.length > 0
              ? editingService.details.map((detail) => ({value: detail}))
              : [{value: ""}],
        });
      } else {
        // Reset to empty form for new service
        reset({
          title: "",
          description: "",
          price: "",
          details: [{value: ""}],
        });
      }
    }
  }, [isOpen, editingService, reset]);

  const addDetail = () => {
    append({value: ""});
  };

  const removeDetail = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const onFormSubmit = async (data) => {
    try {
      // Filter out empty details
      const filteredDetails = data.details
        .map((detail) => detail.value.trim())
        .filter((detail) => detail !== "");

      if (filteredDetails.length === 0) {
        return;
      }

      const serviceData = {
        title: data.title.trim(),
        description: data.description.trim(),
        price: parseFloat(data.price),
        details: filteredDetails,
      };

      // Pass the service ID if editing
      if (editingService) {
        await onSubmit(editingService.id, serviceData);
      } else {
        await onSubmit(serviceData);
      }

      reset();
      onClose();
    } catch (error) {
      console.error("Error saving service:", error);
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
            className="relative bg-dark-2 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
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
                {editingService ? "Edit Service" : "Add New Service"}
              </h2>
              <p className="text-gray-400 mt-1">
                {editingService
                  ? "Update the service information"
                  : "Create a new service for your clinic"}
              </p>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                {/* Title Field */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    {...register("title", {
                      required: "Service title is required",
                      minLength: {
                        value: 2,
                        message: "Title must be at least 2 characters",
                      },
                    })}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg 
                             text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                             focus:ring-blue-500 focus:border-transparent ${
                               errors.title
                                 ? "border-red-500"
                                 : "border-gray-600"
                             }`}
                    placeholder="Enter service title"
                  />
                  {errors.title && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Description Field */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Description *
                  </label>
                  <textarea
                    {...register("description", {
                      required: "Description is required",
                      minLength: {
                        value: 10,
                        message: "Description must be at least 10 characters",
                      },
                    })}
                    rows={4}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg 
                             text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                             focus:ring-blue-500 focus:border-transparent resize-none ${
                               errors.description
                                 ? "border-red-500"
                                 : "border-gray-600"
                             }`}
                    placeholder="Enter service description"
                  />
                  {errors.description && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Price Field */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Price *
                  </label>
                  <input
                    type="number"
                    {...register("price", {
                      required: "Price is required",
                      min: {
                        value: 0.01,
                        message: "Price must be greater than 0",
                      },
                    })}
                    min="0"
                    step="0.01"
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg 
                             text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                             focus:ring-blue-500 focus:border-transparent ${
                               errors.price
                                 ? "border-red-500"
                                 : "border-gray-600"
                             }`}
                    placeholder="Enter price"
                  />
                  {errors.price && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                {/* Details Field */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Service Details *
                    </label>
                    <button
                      type="button"
                      onClick={addDetail}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 
                               text-white rounded-md text-sm transition-colors">
                      <Plus size={14} />
                      Add Detail
                    </button>
                  </div>

                  <div className="space-y-3">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <input
                          type="text"
                          {...register(`details.${index}.value`, {
                            required:
                              index === 0
                                ? "At least one detail is required"
                                : false,
                          })}
                          className={`flex-1 px-4 py-3 bg-gray-800 border rounded-lg 
                                   text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                                   focus:ring-blue-500 focus:border-transparent ${
                                     errors.details?.[index]?.value
                                       ? "border-red-500"
                                       : "border-gray-600"
                                   }`}
                          placeholder={`Detail ${index + 1}`}
                        />
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDetail(index)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-gray-700 
                                     rounded-lg transition-colors"
                            title="Remove detail">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                    {errors.details?.[0]?.value && (
                      <p className="text-red-400 text-sm">
                        {errors.details[0].value.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={onClose}
                    variant="secondary"
                    disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700">
                    {isSubmitting
                      ? editingService
                        ? "Updating..."
                        : "Adding..."
                      : editingService
                      ? "Update Service"
                      : "Add Service"}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AddServiceModal;
