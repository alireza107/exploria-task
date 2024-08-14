'use client';

import { useMemo } from 'react';

export const usePagination = (
  data: any[],
  rowsPerPage: number,
  currentPage: number
) => {
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return data.slice(start, end);
  }, [data, rowsPerPage, currentPage]);

  const goToNextPage = () => {
    if (currentPage < totalPages) return currentPage + 1;
    return currentPage;
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) return currentPage - 1;
    return currentPage;
  };

  return {
    paginatedData,
    totalPages,
    goToNextPage,
    goToPreviousPage,
  };
};
