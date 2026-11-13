import CollectionResource, { ResourceEntity, ResourceQuery } from './CollectionResource';
export default class PaymentTypes extends CollectionResource {
  baseURL = '/payment_types';
  getPaymentTypes(opts?: ResourceQuery) { return this.list<ResourceEntity>('payment_types', opts); }
  getPaymentType(id: string) { return this.get<ResourceEntity>(id); }
}
