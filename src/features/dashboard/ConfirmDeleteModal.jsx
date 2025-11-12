import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Button from "../../components/Button";

function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType = "booking",
  isLoading,
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}>
          <motion.div
            initial={{scale: 0.95, opacity: 0}}
            animate={{scale: 1, opacity: 1}}
            exit={{scale: 0.95, opacity: 0}}
            className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Confirm Delete
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                  disabled={isLoading}>
                  <X size={24} />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-300">
                  Are you sure you want to delete the {itemType}{" "}
                  <span className="font-semibold text-white">
                    {itemName}
                  </span>
                  ?
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variation="secondary"
                  size="medium"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={onConfirm}
                  disabled={isLoading}
                  variation="danger">
                  {isLoading ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ConfirmDeleteModal;
