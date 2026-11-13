import CollectionResource, { ResourceEntity, ResourceQuery } from './CollectionResource';
export default class Webhooks extends CollectionResource {
  baseURL = '/webhooks';
  getWebhooks(opts?: ResourceQuery) { return this.list<ResourceEntity>('webhooks', opts); }
  getWebhook(id: string) { return this.get<ResourceEntity>(id); }
  createWebhook(value: ResourceEntity) { return this.save<ResourceEntity>(value); }
}
