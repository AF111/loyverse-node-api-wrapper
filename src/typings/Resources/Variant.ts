import { DefaultPricingType } from '../Enums';
import { Store } from './Store';

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
