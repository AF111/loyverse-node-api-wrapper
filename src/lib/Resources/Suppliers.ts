import CollectionResource, { ResourceEntity, ResourceQuery } from './CollectionResource';
export default class Suppliers extends CollectionResource {
  baseURL = '/suppliers';
  getSuppliers(opts?: ResourceQuery) { return this.list<ResourceEntity>('suppliers', opts); }
  getSupplier(id: string) { return this.get<ResourceEntity>(id); }
  createSupplier(value: ResourceEntity) { return this.save<ResourceEntity>(value); }
  deleteSupplier(id: string) { return this.remove(id); }
}
