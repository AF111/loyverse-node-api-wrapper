export interface PaginationParams {
  /**
   * @description return items limit
   * @default 50, max = 250
   */
  limit?: number;
  /**
   * @description Current page? Used for pagination
   */
  cursor?: string;
  /**
   * @description Show deleted resources
   * @default false
   */
  show_deleted?: boolean;
  /**
   * @description Show resources created after date (ISO 8601 format, e.g: 2020-03-30T18:30:00.000Z)
   */
  created_at_min?: string;
  /**
   * @description Show resources created before date
   * (ISO 8601 format, e.g: 2020-03-30T18:30:00.000Z)
   */
  created_at_max?: string;
  /**
   * @description Show resources updated after date (ISO 8601 format, e.g: 2020-03-30T18:30:00.000Z)
   */
  updated_at_min?: string;
  /**
   * @description Show resources updated before date
   * (ISO 8601 format, e.g: 2020-03-30T18:30:00.000Z)
   */
  updated_at_max?: string;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type WithPaginationParams<T = any> = T & PaginationParams;
