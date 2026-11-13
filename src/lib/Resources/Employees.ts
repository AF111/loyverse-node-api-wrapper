import CollectionResource, { ResourceEntity, ResourceQuery } from './CollectionResource';
export default class Employees extends CollectionResource {
  baseURL = '/employees';
  getEmployees(opts?: ResourceQuery) { return this.list<ResourceEntity>('employees', opts); }
  getEmployee(id: string) { return this.get<ResourceEntity>(id); }
}
