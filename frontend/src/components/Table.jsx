const Table = ({ columns, data, actions, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-amber-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider"
                  >
                    {column.label}
                  </th>
                ))}
                {actions && (
                  <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-right text-xs font-medium text-amber-800 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.length > 0 ? (
                data.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-amber-50 transition-colors">
                    {columns.map((column) => (
                      <td key={column.key} className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-700">
                        <div className="truncate max-w-xs">
                          {column.render ? column.render(row) : row[column.key]}
                        </div>
                      </td>
                    ))}
                    {actions && (
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                        <div className="flex flex-col sm:flex-row sm:justify-end space-y-1 sm:space-y-0 sm:space-x-2">
                          {onEdit && (
                            <button
                              onClick={() => onEdit(row)}
                              className="text-amber-600 hover:text-amber-800"
                            >
                              Edit
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(row)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="px-3 sm:px-6 py-2 sm:py-4 text-center text-xs sm:text-sm text-gray-500"
                  >
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Table;
