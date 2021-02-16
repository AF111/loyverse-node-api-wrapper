import { PaginationParams } from '../Pagination';

/**
 * @see https://developer.loyverse.com/docs/#tag/Stores/paths/~1stores/get
 */
export type Store = {
  id: string;
  name: string;
  address: string;
  phone_number: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
};

export type GetQueryParams = Omit<PaginationParams, 'limit' | 'cursor'> & {
  /**
   * @description comma-separated list of IDs
   */
  store_ids: string[];
};
