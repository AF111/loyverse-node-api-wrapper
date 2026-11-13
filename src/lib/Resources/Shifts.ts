import CollectionResource, { ResourceEntity, ResourceQuery } from './CollectionResource';
export default class Shifts extends CollectionResource {
  baseURL = '/shifts';
  getShifts(opts?: ResourceQuery) { return this.list<ResourceEntity>('shifts', opts); }
  getShift(id: string) { return this.get<ResourceEntity>(id); }
}
