import CollectionResource, { ResourceEntity, ResourceQuery } from './CollectionResource';
export default class POSDevices extends CollectionResource {
  baseURL = '/pos_devices';
  getPOSDevices(opts?: ResourceQuery) { return this.list<ResourceEntity>('pos_devices', opts); }
  getPOSDevice(id: string) { return this.get<ResourceEntity>(id); }
  updatePOSDevice(value: ResourceEntity) { return this.save<ResourceEntity>(value); }
  deletePOSDevice(id: string) { return this.remove(id); }
}
