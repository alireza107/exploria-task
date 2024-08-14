'use client';

import './table.css';
import { TableProps } from './table.types';
import { usePagination } from './usePagination';
import { useFilter } from './useFilter';
import { useSort } from './useSort';
import { useQueryParams } from './useQueryParams';

export const Table: React.FC<TableProps> = ({
  columns,
  rows,
  rowsPerPageOptions = [5, 10, 20],
}: TableProps) => {
  const { params, setQueryParam } = useQueryParams({
    initialParams: {
      page: '1',
      sort: null,
      rowsPerPage: '5',
      ...Object.fromEntries(columns.map((col) => [col.field, ''])),
    },
  });

  const filters = Object.fromEntries(
    columns.map((column) => [column.field, params[column.field] || ''])
  );

  const sortConfig = params.sort ? JSON.parse(params.sort) : null;
  const currentPage = parseInt(params.page || '1', 10);

  const rowsPerPage = params.rowsPerPage;

  const { filteredData } = useFilter(rows, filters);
  const { sortedData, onSort } = useSort(filteredData, sortConfig);

  const { paginatedData, totalPages, goToNextPage, goToPreviousPage } =
    usePagination(sortedData, rowsPerPage, currentPage);

  return (
    <div className='overflow-x-auto bg-gray-50 p-4 rounded-lg shadow-lg'>
      <table className='e-table min-w-full bg-white rounded-lg shadow-md table-auto'>
        <thead className='bg-gray-200 text-gray-600 text-sm uppercase font-semibold'>
          <tr>
            {columns.map((col) => (
              <th
                key={col.field}
                onClick={() => {
                  const newSortConfig = onSort(col.field);
                  if (newSortConfig === null) {
                    setQueryParam('sort', '');
                  } else {
                    setQueryParam('sort', JSON.stringify(newSortConfig));
                  }
                }}
                className='cursor-pointer px-6 py-3 border-b border-gray-300 text-left'
              >
                <div className='flex items-center'>
                  {col.headerName}
                  {sortConfig && sortConfig.key === col.field
                    ? sortConfig.order === 'asc'
                      ? ' 🔼'
                      : ' 🔽'
                    : null}
                </div>
              </th>
            ))}
          </tr>
          <tr>
            {columns.map((column) => (
              <th
                key={`${column.field}-filter`}
                className='px-6 py-2 border-b-2 border-gray-300 relative bg-slate-600'
              >
                <input
                  type='text'
                  placeholder={`Filter ${column.headerName}`}
                  value={filters[column.field]?.toString() || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (
                      value.startsWith('/') &&
                      value.endsWith('/') &&
                      value.length > 1
                    ) {
                      setQueryParam(
                        column.field,
                        new RegExp(value.slice(1, -1), 'i')
                      );
                    } else {
                      setQueryParam(column.field, value);
                    }
                    setQueryParam('page', 1);
                  }}
                  className='p-2 border rounded w-full text-slate-950 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none'
                />
                {filters[column.field] && (
                  <button
                    onClick={() => {
                      setQueryParam(column.field, '');
                      setQueryParam('page', 1);
                    }}
                    className='absolute bg-red-600 right-8 top-1/2 transform rounded
                     -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M6 18L18 6M6 6l12 12'
                      />
                    </svg>
                  </button>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, i) => (
            <tr key={row.id} className={i % 2 ? 'row-even' : 'row-odd'}>
              {columns.map((col) => (
                <td key={col.field + row.id}>{row[col.field]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className='flex justify-between items-center mt-4'>
        <button
          onClick={() => {
            const newPage = goToPreviousPage();
            setQueryParam('page', newPage.toString());
          }}
          disabled={currentPage === 1}
          className='bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-blue-600'
        >
          Previous
        </button>
        <div className='flex gap-4 items-center'>
          <select
            value={rowsPerPage}
            onChange={(event) => {
              setQueryParam('rowsPerPage', event.target.value);
            }}
            className='bg-slate-500 rounded py-2 px-4 cursor-pointer'
          >
            {rowsPerPageOptions.map((rowsPerPageOption) => (
              <option key={rowsPerPageOption} value={rowsPerPageOption}>
                {rowsPerPageOption}
              </option>
            ))}
          </select>
          <span className='text-sm text-gray-600'>
            Page {currentPage} of {totalPages}
          </span>
        </div>
        <button
          onClick={() => {
            const newPage = goToNextPage();
            setQueryParam('page', newPage.toString());
          }}
          disabled={currentPage === totalPages}
          className='bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-blue-600'
        >
          Next
        </button>
      </div>
    </div>
  );
};
