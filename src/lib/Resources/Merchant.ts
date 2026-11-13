import CollectionResource, { ResourceEntity } from './CollectionResource';
export default class Merchant extends CollectionResource {
  baseURL = '/merchant';
  getMerchant() { return this.get<ResourceEntity>(''); }
}
