import {createContext, useContext} from "react";

const TableContext = createContext();

function Table({children, className = "", ...props}) {
  const baseClasses = "bg-dark-2 rounded-lg shadow-xl border border-gray-800";
  const combinedClasses = `${baseClasses} ${className}`;

  return (
    <TableContext.Provider value={{}}>
      <div className={combinedClasses} {...props}>
        {children}
      </div>
    </TableContext.Provider>
  );
}

function TableHeader({children, className = "", ...props}) {
  const baseClasses = "px-6 py-4 bg-dark-3 border-b border-gray-700";
  const combinedClasses = `${baseClasses} ${className}`;

  return (
    <div className={combinedClasses} {...props}>
      {children}
    </div>
  );
}

function TableTitle({children, className = "", ...props}) {
  const baseClasses = "text-lg font-semibold text-gray-100";
  const combinedClasses = `${baseClasses} ${className}`;

  return (
    <h2 className={combinedClasses} {...props}>
      {children}
    </h2>
  );
}

// Table Content wrapper
function TableContent({children, className = "", ...props}) {
  const baseClasses = "overflow-x-auto overflow-y-visible";
  const combinedClasses = `${baseClasses} ${className}`;

  return (
    <div className={combinedClasses} {...props}>
      {children}
    </div>
  );
}

// HTML Table element
function TableElement({children, className = "", ...props}) {
  const baseClasses = "min-w-full divide-y divide-gray-700";
  const combinedClasses = `${baseClasses} ${className}`;

  return (
    <table className={combinedClasses} {...props}>
      {children}
    </table>
  );
}

// Table Head
function TableHead({children, className = "", ...props}) {
  const baseClasses = "bg-dark-2";
  const combinedClasses = `${baseClasses} ${className}`;

  return (
    <thead className={combinedClasses} {...props}>
      {children}
    </thead>
  );
}

function TableBody({children, className = "", ...props}) {
  const baseClasses = "bg-dark-3 divide-y divide-gray-700";
  const combinedClasses = `${baseClasses} ${className}`;

  return (
    <tbody className={combinedClasses} {...props}>
      {children}
    </tbody>
  );
}

function TableRow({children, className = "", hover = true, ...props}) {
  const baseClasses = hover
    ? "hover:bg-dark-2 transition-colors duration-150"
    : "";
  const combinedClasses = `${baseClasses} ${className}`;

  return (
    <tr className={combinedClasses} {...props}>
      {children}
    </tr>
  );
}

function TableHeaderCell({children, className = "", ...props}) {
  const baseClasses =
    "px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider";
  const combinedClasses = `${baseClasses} ${className}`;

  return (
    <th className={combinedClasses} {...props}>
      {children}
    </th>
  );
}

function TableCell({children, className = "", variant = "default", ...props}) {
  const variants = {
    default: "px-6 py-4 whitespace-nowrap text-sm text-gray-100",
    primary: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100",
    secondary: "px-6 py-4 whitespace-nowrap text-sm text-gray-400",
  };

  const baseClasses = variants[variant] || variants.default;
  const combinedClasses = `${baseClasses} ${className}`;

  return (
    <td className={combinedClasses} {...props}>
      {children}
    </td>
  );
}

function TableEmpty({children, className = "", ...props}) {
  const baseClasses = "text-center py-12 text-gray-400";
  const combinedClasses = `${baseClasses} ${className}`;

  return (
    <div className={combinedClasses} {...props}>
      {children || "No data available"}
    </div>
  );
}

// Pagination component
function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = "",
  ...props
}) {
  const baseClasses =
    "px-6 py-4 bg-gray-800 border-t border-gray-700 flex items-center justify-between";
  const combinedClasses = `${baseClasses} ${className}`;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  return (
    <div className={combinedClasses} {...props}>
      <div className="flex items-center text-sm text-gray-300">
        <span>
          Showing {startItem} to {endItem} of {totalItems} results
        </span>
      </div>

      <div className="flex items-center space-x-2">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded 
            hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          Previous
        </button>

        {/* Page numbers */}
        <div className="flex space-x-1">
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                page === currentPage
                  ? "bg-dark-3 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}>
              {page}
            </button>
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded 
            hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          Next
        </button>
      </div>
    </div>
  );
}

Table.Header = TableHeader;
Table.Title = TableTitle;
Table.Content = TableContent;
Table.Element = TableElement;
Table.Head = TableHead;
Table.Body = TableBody;
Table.Row = TableRow;
Table.HeaderCell = TableHeaderCell;
Table.Cell = TableCell;
Table.Empty = TableEmpty;
Table.Pagination = TablePagination;

export default Table;
