import {Edit, Trash2, Plus} from "lucide-react";
import Table from "../../components/Table";
import {formatCurrency} from "../../utils/helpers";

function ServicesTable({services, onEdit, onDelete, onAddService}) {
  const handleEdit = (service) => {
    if (onEdit) {
      onEdit(service);
    }
  };

  const handleDelete = (service) => {
    if (onDelete) {
      onDelete(service);
    }
  };

  return (
    <Table>
      <Table.Header>
        <div className="flex items-center justify-between">
          <Table.Title>Services</Table.Title>
          <button
            onClick={onAddService}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 
            text-white rounded-lg transition-all duration-200 text-sm font-medium"
            title="Add new service"
          >
            <Plus size={16} />
            Add Service
          </button>
        </div>
      </Table.Header>
      <Table.Content>
        <Table.Element>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>Service Name</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Price</Table.HeaderCell>
              <Table.HeaderCell>Details</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {services.map((service) => (
              <Table.Row key={service.id}>
                <Table.Cell>{service.title}</Table.Cell>
                <Table.Cell>
                  {service.description.slice(0, 30) + "..."}
                </Table.Cell>
                <Table.Cell>{formatCurrency(service.price)}</Table.Cell>
                <Table.Cell>
                  {service.details[0].slice(0, 30) + "..."}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-gray-700 
                      rounded transition-all duration-200 cursor-pointer"
                      title="Edit service">
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(service)}
                      className="p-1.5 text-red-400 hover:text-red-300 hover:bg-gray-700 
                      rounded transition-all duration-200 cursor-pointer"
                      title="Delete service">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Element>
      </Table.Content>
    </Table>
  );
}

export default ServicesTable;
