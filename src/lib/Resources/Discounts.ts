import CollectionResource, { ResourceEntity, ResourceQuery } from './CollectionResource';
export default class Discounts extends CollectionResource {
  baseURL = '/discounts';
  getDiscounts(opts?: ResourceQuery) { return this.list<ResourceEntity>('discounts', opts); }
  getDiscount(id: string) { return this.get<ResourceEntity>(id); }
  createDiscount(value: ResourceEntity) { return this.save<ResourceEntity>(value); }
  deleteDiscount(id: string) { return this.remove(id); }
}
