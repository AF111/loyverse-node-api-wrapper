import { WithCursor } from '../typings';
import Resource from '../lib/Resource';
import { Store, GetQueryParams } from '../typings/Resources/Store';

export default class Stores extends Resource {
  baseURL = '/stores';

  /**
   * @description Gets a single Store
   * @see https://developer.loyverse.com/docs/#tag/Stores/paths/~1stores~1{store_id}/get
   * @param {string} storeID
   */
  async getStore(storeID: number) {
    const res = await this.httpClient.get<Store>(this.getURL(storeID));
    return res.body;
  }

  /**
   * @description Gets a list of Stores
   * @see https://developer.loyverse.com/docs/#tag/Stores/paths/~1stores/get
   * @param {GetQueryParams} opts
   */
  async getStores(opts?: GetQueryParams) {
    if (opts && opts.store_ids) {
      opts.store_ids = this.splitList(opts.store_ids) as any;
    }
    const res = await this.httpClient.get<WithCursor<{ stores: Store[] }>>(this.params(this.getURL(), opts));
    return res.body;
  }
}
