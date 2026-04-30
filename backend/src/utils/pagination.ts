import { PaginationQuery, PaginatedResult } from '../types/common';

export const getPaginationParams = (query: PaginationQuery) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
  const skip = (page - 1) * limit;
  const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';
  const sortBy = query.sortBy ?? 'createdAt';

  return { page, limit, skip, sortBy, sortOrder };
};

export const buildPaginatedResult = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResult<T> => ({
  data,
  meta: {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page < Math.ceil(total / limit),
    hasPrevPage: page > 1,
  },
});
