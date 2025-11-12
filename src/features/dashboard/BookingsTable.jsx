import {Edit, Trash2, X} from "lucide-react";
import {useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import Table from "../../components/Table";
import {deleteBooking} from "../../sevices/api";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import BookingForm from "../booking/BookingForm";

function BookingsTable({
  bookings,
  paginationData,
  onPageChange,
  onBookingUpdated,
  onBookingDeleted,
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditClick = (booking) => {
    setSelectedBooking(booking);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (booking) => {
    setSelectedBooking(booking);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedBooking(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedBooking(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedBooking) return;

    setIsDeleting(true);
    try {
      await deleteBooking(selectedBooking.id);

      if (onBookingDeleted) {
        onBookingDeleted(selectedBooking.id);
      }

      setIsDeleteModalOpen(false);
      setSelectedBooking(null);
    } catch (error) {
      console.error("Error deleting booking:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBookingUpdated = (updatedBooking) => {
    if (onBookingUpdated) {
      onBookingUpdated(updatedBooking);
    }
  };

  if (!bookings || bookings.length === 0) {
    return (
      <>
        <Table>
          <Table.Empty>No bookings found.</Table.Empty>
        </Table>

        <EditBookingModal
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          booking={selectedBooking}
          onBookingUpdated={handleBookingUpdated}
        />
      </>
    );
  }

  return (
    <>
      <Table>
        <Table.Header>
          <Table.Title>Bookings</Table.Title>
        </Table.Header>

        <Table.Content>
          <Table.Element>
            <Table.Head>
              <Table.Row hover={false}>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Phone</Table.HeaderCell>
                <Table.HeaderCell>Service</Table.HeaderCell>
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell>Time</Table.HeaderCell>
                <Table.HeaderCell>Dentist</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {bookings.map((booking) => (
                <Table.Row key={booking.id}>
                  <Table.Cell>{booking.name || "N/A"}</Table.Cell>
                  <Table.Cell>{booking.phone || "N/A"}</Table.Cell>
                  <Table.Cell>{booking.service || "N/A"}</Table.Cell>
                  <Table.Cell>{booking.date || "N/A"}</Table.Cell>
                  <Table.Cell>{booking.time || "N/A"}</Table.Cell>
                  <Table.Cell>{booking.dentist || "N/A"}</Table.Cell>
                  <Table.HeaderCell>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditClick(booking)}
                        className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-gray-700 
                        rounded transition-all duration-200 cursor-pointer"
                        title="Edit booking">
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() => handleDeleteClick(booking)}
                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-gray-700 
                        rounded transition-all duration-200 cursor-pointer"
                        title="Delete booking">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </Table.HeaderCell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Element>
        </Table.Content>

        {paginationData && paginationData.totalPages > 1 && (
          <Table.Pagination
            currentPage={paginationData.currentPage}
            totalPages={paginationData.totalPages}
            totalItems={paginationData.totalItems}
            itemsPerPage={paginationData.itemsPerPage}
            onPageChange={onPageChange}
          />
        )}
      </Table>

      {/* Edit Booking Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.2}}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{scale: 0.95, opacity: 0, y: 20}}
              animate={{scale: 1, opacity: 1, y: 0}}
              exit={{scale: 0.95, opacity: 0, y: 20}}
              transition={{duration: 0.2, ease: "easeOut"}}
              className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-white">Edit Booking</h2>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800"
                  >
                    <X size={20} />
                  </button>
                </div>
                <BookingForm
                  booking={selectedBooking}
                  onBookingUpdated={handleBookingUpdated}
                  onClose={handleCloseModal}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        bookingName={selectedBooking?.name || "Unknown"}
        isLoading={isDeleting}
      />
    </>
  );
}

export default BookingsTable;
