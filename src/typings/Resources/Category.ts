import { ObjectColor } from '../Enums';
import { PaginationParams } from '../Pagination';

export interface Category {
  id: string;
  name: string;
  color: ObjectColor;
  created_at: string;
  deleted_at: string;
}

export type GetQueryParams = Pick<PaginationParams, 'limit' | 'cursor' | 'show_deleted'> & {
  /**
   * @description comma-separated list of IDs
   */
  categories_ids: string[];
};
