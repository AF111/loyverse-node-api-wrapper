import { WithCursor } from '../../typings';
import Resource from '../Resource';
import { Store, GetQueryParams } from '../../typings/Resources/Store';

export default class Stores extends Resource {
  baseURL = '/stores';

  /**
   * @description Gets a single Store
   * @see https://developer.loyverse.com/docs/#tag/Stores/paths/~1stores~1{store_id}/get
   * @param {string} storeID
   */
  async getStore(storeID: string | number) {
    const res = await this.httpClient.get<Store>(this.getURL(encodeURIComponent(String(storeID))));
    return res.body;
  }

  /**
   * @description Gets a list of Stores
   * @see https://developer.loyverse.com/docs/#tag/Stores/paths/~1stores/get
   * @param {GetQueryParams} opts
   */
  async getStores(opts?: GetQueryParams) {
    const query = opts ? { ...opts } : undefined;
    if (query && query.store_ids) {
      query.store_ids = this.splitList(query.store_ids) as any;
    }
    const res = await this.httpClient.get<WithCursor<{ stores: Store[] }>>(this.params(this.getURL(), query));
    return res.body;
  }
}
