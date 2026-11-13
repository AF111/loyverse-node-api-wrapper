import { Customers, Receipts } from '../lib/Resources/Additional';

describe('additional resources', () => {
  const http: any = {
    get: jest.fn(async () => ({ body: { customers: [], cursor: 'next' } })),
    post: jest.fn(async () => ({ body: { receipt_number: 'R-1' } })),
    delete: jest.fn(async () => ({ body: { deleted_object_ids: ['1'] } })),
  };
  test('list filters are serialized without mutating the caller options', async () => {
    const ids = ['a', 'b'];
    const options = { customer_ids: ids };
    const resource = new Customers({ _httpClient: http, auth: {} } as any);
    await resource.getCustomers(options);
    expect(options.customer_ids).toBe(ids);
    expect(http.get).toHaveBeenCalledWith('customers?customer_ids=a%2Cb');
  });
  test('refund posts to the receipt refund endpoint', async () => {
    const resource = new Receipts({ _httpClient: http, auth: {} } as any);
    await resource.refundReceipt('R-1', { store_id: 'S-1' });
    expect(http.post).toHaveBeenCalledWith('receipts/R-1/refund', { json: { store_id: 'S-1' } });
  });
});
