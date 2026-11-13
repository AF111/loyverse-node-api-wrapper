import CollectionResource, { ResourceEntity, ResourceQuery } from './CollectionResource';
export default class Taxes extends CollectionResource {
  baseURL = '/taxes';
  getTaxes(opts?: ResourceQuery) { return this.list<ResourceEntity>('taxes', opts); }
  getTax(id: string) { return this.get<ResourceEntity>(id); }
  createTax(value: ResourceEntity) { return this.save<ResourceEntity>(value); }
  deleteTax(id: string) { return this.remove(id); }
}
