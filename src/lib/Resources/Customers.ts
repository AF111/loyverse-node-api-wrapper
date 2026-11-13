import CollectionResource, { ResourceEntity, ResourceQuery } from './CollectionResource';
export default class Customers extends CollectionResource {
  baseURL = '/customers';
  getCustomers(opts?: ResourceQuery) { return this.list<ResourceEntity>('customers', opts); }
  getCustomer(id: string) { return this.get<ResourceEntity>(id); }
  createCustomer(value: ResourceEntity) { return this.save<ResourceEntity>(value); }
  deleteCustomer(id: string) { return this.remove(id); }
}
