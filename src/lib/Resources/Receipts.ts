import CollectionResource, { ResourceEntity, ResourceQuery } from './CollectionResource';
export default class Receipts extends CollectionResource {
  baseURL = '/receipts';
  getReceipts(opts?: ResourceQuery) { return this.list<ResourceEntity>('receipts', opts); }
  getReceipt(receiptNumber: string) { return this.get<ResourceEntity>(receiptNumber); }
  createReceipt(value: ResourceEntity) { return this.save<ResourceEntity>(value); }
  async refundReceipt(receiptNumber: string, refund: ResourceEntity) {
    const response = await this.httpClient.post<ResourceEntity>(this.getURL(encodeURIComponent(receiptNumber), 'refund'), { json: refund });
    return response.body;
  }
}
