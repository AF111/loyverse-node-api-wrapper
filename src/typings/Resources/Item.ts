import { ObjectShape, ObjectColor, DefaultPricingType } from '../Enums';
import { Store } from './Store';
import { WithPaginationParams } from '../Pagination';

export type Variant = {
  variant_id: string;
  item_id: string;
  sku: string;
  reference_variant_id: string;
  option1_value: string;
  option2_value: string;
  option3_value: string;
  barcode: string;
  cost: number;
  purchase_cost: number;
  default_pricing_type: keyof typeof DefaultPricingType;
  default_price: number | null;
  stores: Store[];
  created_at: string;
  updated_at: string;
  deleted_at: string;
};

/**
 * @see https://developer.loyverse.com/docs/#tag/Items/paths/~1items/get
 */
export type Item = {
  id: string;
  handle: string;
  item_name: string;
  reference_id: string;
  category_id: string | null;
  track_stock: boolean;
  sold_by_weight: boolean;
  is_composite: boolean;
  use_production: boolean;
  components: {
    variant_id: string;
    quantity: number;
  }[];
  primary_supplier_id: string;
  tax_ids: string[];
  modifiers_ids: string[];
  form: keyof typeof ObjectShape;
  color: keyof typeof ObjectColor;
  image_url: string;
  option1_name: string;
  option2_name: string;
  option3_name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  variants: Variant[];
};

export type GetQueryParams = WithPaginationParams<{
  items_ids?: string[];
}>;
