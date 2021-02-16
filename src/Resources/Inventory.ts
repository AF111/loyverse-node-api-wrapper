import { WithCursor } from '../typings';
import { InventoryLevel, UpdateInventoryLevel, GetQueryParams } from '../typings/Resources/Inventory';
import Resource from '../lib/Resource';
import { Store } from '../typings/Resources/Store';

export default class Inventory extends Resource {
  baseURL = '/inventory';

  /**
   * @description Gets Inventory levels for item variants
   * @see https://developer.loyverse.com/docs/#tag/Inventory
   * @param {GetQueryParams} opts
   */
  async getInventory(opts: GetQueryParams = {}) {
    if (opts.store_ids) {
      opts.store_ids = this.splitList(opts.store_ids) as any;
    }

    if (opts.variant_ids) {
      opts.variant_ids = this.splitList(opts.variant_ids) as any;
    }

    const res = await this.httpClient.get<WithCursor<{ inventory_levels: InventoryLevel[] }>>(
      this.params(this.getURL(), opts),
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
