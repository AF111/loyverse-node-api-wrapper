import { PaginationParams } from '../Pagination';

export interface InventoryLevel {
  variant_id: string;
  store_id: string;
  in_stock: number;
  updated_at: string;
}

export type GetQueryParams = Pick<PaginationParams, 'updated_at_min' | 'updated_at_max' | 'cursor' | 'limit'> & {
  /**
   * @description Show inventory levels only for specified stores
   */
  store_ids?: string[];

  /**
   * @description Show inventory levels only for specified variants
   */
  variant_ids?: string[];
};

export interface UpdateInventoryLevel extends Exclude<InventoryLevel, 'in_stock' | 'updated_at'> {
  stock_after: number;
}
