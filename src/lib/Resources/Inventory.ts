import { WithCursor } from '../../typings';
import { InventoryLevel, UpdateInventoryLevel, GetQueryParams } from '../../typings/Resources/Inventory';
import Resource from '../Resource';
import { Store } from '../../typings/Resources/Store';

export default class Inventory extends Resource {
  baseURL = '/inventory';

  /**
   * @description Gets Inventory levels for item variants
   * @see https://developer.loyverse.com/docs/#tag/Inventory
   * @param {GetQueryParams} opts
   */
  async getInventory(opts: GetQueryParams = {}) {
    const query = { ...opts };
    if (query.store_ids) {
      query.store_ids = this.splitList(query.store_ids) as any;
    }

    if (query.variant_ids) {
      query.variant_ids = this.splitList(query.variant_ids) as any;
    }

    const res = await this.httpClient.get<WithCursor<{ inventory_levels: InventoryLevel[] }>>(
      this.params(this.getURL(), query),
    );
    return res.body;
  }

  /**
   * @description Batch updates inventory levels for item variants
   * @see https://developer.loyverse.com/docs/#tag/Inventory/paths/~1inventory/post
   * @param {InventoryLevel} inventoryLevels
   */
  async updateInventoryLevels(inventoryLevels: UpdateInventoryLevel[]) {
    const res = await this.httpClient.post<{ inventory_levels: Store[] }>(this.getURL(), {
      json: inventoryLevels,
    });
    return res.body;
  }
}
