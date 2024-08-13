'use client';

import { TableProps } from './table.types';
import './table.css';
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
                className='px-6 py-2 border-b-2 border-gray-300'
              >
                <input
                  type='text'
                  placeholder={`Filter ${column.headerName}`}
                  value={filters[column.field] || ''}
                  onChange={(e) => onFilterChange(column.field, e.target.value)}
                  className='p-2 border rounded w-full text-slate-950'
                />
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
