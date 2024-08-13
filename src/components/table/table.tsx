'use client';

import './table.css';
import { TableProps } from './table.types';
import { useState } from 'react';
import { usePagination } from './usePagination';
import { useFilter } from './useFilter';
import { useSort } from './useSort';

export const Table: React.FC<TableProps> = ({
  columns,
  rows,
  rowsPerPageOptions = [5, 10, 20],
}: TableProps) => {
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const { filteredData, onFilterChange, filters } = useFilter(rows);
  const { sortedData, onSort, sortConfig } = useSort(filteredData);

  const {
    paginatedData,
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
  } = usePagination(sortedData, rowsPerPage);

  return (
    <div>
      <table className='e-table'>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.field} onClick={() => onSort(col.field)}>
                {col.headerName}
                {sortConfig.find((config) => config.key === col.field)
                  ?.order === 'asc'
                  ? ' 🔼'
                  : sortConfig.find((config) => config.key === col.field)
                      ?.order === 'desc'
                  ? ' 🔽'
                  : null}
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
                      onFilterChange(
                        column.field,
                        new RegExp(value.slice(1, -1), 'i')
                      );
                    } else {
                      onFilterChange(column.field, value);
                    }
                  }}
                  className='p-2 border rounded w-full text-slate-950'
                />
                {filters[column.field] && (
                  <button
                    onClick={() => onFilterChange(column.field, '')}
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
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className='bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50'
        >
          Previous
        </button>
        <select
          onChange={(event) => {
            setRowsPerPage(parseInt(event.target.value));
          }}
          className='bg-slate-500 rounded py-2 px-4 cursor-pointer'
        >
          {rowsPerPageOptions.map((rowsPerPageOption) => (
            <option key={rowsPerPageOption} value={rowsPerPageOption}>
              {rowsPerPageOption}
            </option>
          ))}
        </select>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className='bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50'
        >
          Next
        </button>
      </div>
    </div>
  );
};
