import React from 'react';

const Table = ({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  className = '',
}) => {
  if (loading) {
    return (
      <div className="min-w-full overflow-hidden rounded-lg shadow">
        <div className="bg-white p-4 text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="space-y-3 mt-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="min-w-full overflow-hidden rounded-lg shadow">
        <div className="bg-white p-4 text-center text-gray-500">
          {emptyMessage}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-w-full overflow-hidden rounded-lg shadow ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={column.key || index}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.className || ''
                }`}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, rowIndex) => (
            <tr
              key={item.id || rowIndex}
              onClick={() => onRowClick && onRowClick(item)}
              className={`${
                onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''
              }`}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={`${item.id || rowIndex}-${column.key || colIndex}`}
                  className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${
                    column.cellClassName || ''
                  }`}
                >
                  {column.render
                    ? column.render(item[column.key], item)
                    : item[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table; 