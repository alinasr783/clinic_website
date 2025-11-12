import {useEffect, useState} from "react";
import {useSearchParams, useNavigate} from "react-router-dom";
import BookingsTable from "../features/dashboard/BookingsTable";
import ServicesTable from "../features/dashboard/ServicesTable";
import AddServiceModal from "../features/dashboard/AddServiceModal";
import ConfirmDeleteModal from "../features/dashboard/ConfirmDeleteModal";
import {
  getBookings,
  getServices,
  createService,
  updateService,
  deleteService,
} from "../sevices/api";
import Button from "../components/Button";
import toast from "react-hot-toast";

function Dashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [bookingsData, setBookingsData] = useState(null);
  const [servicesData, setServicesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [servicesError, setServicesError] = useState(null);
  const [activeTab, setActiveTab] = useState("bookings");
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentPage = parseInt(searchParams.get("page")) || 1;

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await getBookings(currentPage, 8);
        setBookingsData(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentPage]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setServicesLoading(true);
        const data = await getServices();
        setServicesData(data);
      } catch (err) {
        console.error("Error fetching services:", err);
        setServicesError(err.message);
      } finally {
        setServicesLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handlePageChange = (newPage) => {
    setSearchParams({page: newPage.toString()});
  };

  const handleBookingUpdated = (updatedBooking) => {
    setBookingsData((prevData) => {
      if (!prevData || !prevData.data) return prevData;

      const updatedBookings = prevData.data.map((booking) =>
        booking.id === updatedBooking.id ? updatedBooking : booking
      );

      return {
        ...prevData,
        data: updatedBookings,
      };
    });
  };

  const handleBookingDeleted = (deletedBookingId) => {
    setBookingsData((prevData) => {
      if (!prevData || !prevData.data) return prevData;

      const filteredBookings = prevData.data.filter(
        (booking) => booking.id !== deletedBookingId
      );

      return {
        ...prevData,
        data: filteredBookings,
        totalItems: prevData.totalItems - 1,
        totalPages: Math.ceil(
          (prevData.totalItems - 1) / prevData.itemsPerPage
        ),
      };
    });
  };

  const handleAddService = () => {
    setEditingService(null);
    setIsAddServiceModalOpen(true);
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setIsAddServiceModalOpen(true);
  };

  const handleCloseAddServiceModal = () => {
    setIsAddServiceModalOpen(false);
    setEditingService(null);
  };

  const handleServiceSubmit = async (serviceIdOrData, serviceData = null) => {
    try {
      if (editingService && serviceData) {
        // Update existing service
        const updatedService = await updateService(
          serviceIdOrData,
          serviceData
        );
        setServicesData((prevServices) =>
          prevServices.map((service) =>
            service.id === serviceIdOrData ? updatedService : service
          )
        );
      } else {
        // Create new service
        const newService = await createService(serviceIdOrData);
        setServicesData((prevServices) => [...prevServices, newService]);
      }
      setIsAddServiceModalOpen(false);
      setEditingService(null);
    } catch (error) {
      console.error("Error saving service:", error);
      toast.error("Error saving service");
    }
  };

  const handleDeleteService = (service) => {
    setServiceToDelete(service);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setServiceToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;

    try {
      setIsDeleting(true);
      await deleteService(serviceToDelete.id);
      setServicesData((prevServices) =>
        prevServices.filter((service) => service.id !== serviceToDelete.id)
      );
      setIsDeleteModalOpen(false);
      setServiceToDelete(null);
      toast.success("Service deleted successfully");
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("Error deleting service");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading && activeTab === "bookings") {
    return (
      <div className="p-6 flex flex-col gap-8">
        <div className="text-center py-8">Loading bookings...</div>
      </div>
    );
  }

  if (servicesLoading && activeTab === "services") {
    return (
      <div className="p-6 flex flex-col gap-8">
        <div className="text-center py-8">Loading services...</div>
      </div>
    );
  }

  if (error && activeTab === "bookings") {
    return (
      <div className="p-6 flex flex-col gap-8">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <div className="text-center py-8 text-red-500">
          Error loading bookings: {error}
        </div>
      </div>
    );
  }

  if (servicesError && activeTab === "services") {
    return (
      <div className="p-6 flex flex-col gap-8">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <div className="text-center py-8 text-red-500">
          Error loading services: {servicesError}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        <Button onClick={handleLogout} variation="link" size="small">
          Logout
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("bookings")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
            activeTab === "bookings"
              ? "bg-dark-3 text-white"
              : "text-gray-300 hover:text-white hover:bg-gray-700"
          }`}>
          Bookings
        </button>
        <button
          onClick={() => setActiveTab("services")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
            activeTab === "services"
              ? "bg-dark-3 text-white"
              : "text-gray-300 hover:text-white hover:bg-gray-700"
          }`}>
          Services
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === "bookings" && (
        <BookingsTable
          bookings={bookingsData?.data || []}
          paginationData={bookingsData}
          onPageChange={handlePageChange}
          onBookingUpdated={handleBookingUpdated}
          onBookingDeleted={handleBookingDeleted}
        />
      )}

      {activeTab === "services" && (
        <>
          {servicesLoading ? (
            <div className="text-center py-8">Loading services...</div>
          ) : servicesError ? (
            <div className="text-center py-8 text-red-500">
              Error loading services: {servicesError}
            </div>
          ) : (
            <ServicesTable
              services={servicesData}
              onAddService={handleAddService}
              onEdit={handleEditService}
              onDelete={handleDeleteService}
            />
          )}
        </>
      )}

      {/* Add/Edit Service Modal */}
      <AddServiceModal
        isOpen={isAddServiceModalOpen}
        onClose={handleCloseAddServiceModal}
        onSubmit={handleServiceSubmit}
        editingService={editingService}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        itemName={serviceToDelete?.title}
        itemType="service"
        isLoading={isDeleting}
      />
    </div>
  );
}

export default Dashboard;
