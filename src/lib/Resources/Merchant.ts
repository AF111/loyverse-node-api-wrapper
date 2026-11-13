import CollectionResource, { ResourceEntity } from './CollectionResource';
export default class Merchant extends CollectionResource {
  baseURL = '/merchant';
  async getMerchant() {
    const response = await this.httpClient.get<ResourceEntity>(this.getURL());
    return response.body;
  }
}
