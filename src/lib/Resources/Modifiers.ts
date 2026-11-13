import CollectionResource, { ResourceEntity, ResourceQuery } from './CollectionResource';
export default class Modifiers extends CollectionResource {
  baseURL = '/modifiers';
  getModifiers(opts?: ResourceQuery) { return this.list<ResourceEntity>('modifiers', opts); }
  getModifier(id: string) { return this.get<ResourceEntity>(id); }
  createModifier(value: ResourceEntity) { return this.save<ResourceEntity>(value); }
  deleteModifier(id: string) { return this.remove(id); }
}
