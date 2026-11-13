import mockHTTPClient from '../__mocks__/got';
import { Customers, Receipts, Merchant } from '../lib/Resources/Additional';

describe('additional resource wrappers', () => {
  const http: any = mockHTTPClient({});
  test('customer list sends array filters without mutating caller options', async () => {
    const ids = ['one', 'two'];
    const options = { customer_ids: ids };
    const resource = new Customers({ _httpClient: http, auth: {} } as any);
    await resource.getCustomers(options);
    expect(options.customer_ids).toBe(ids);
    expect(http.get).toHaveBeenCalled();
  });
  test('receipt refund targets the refund endpoint', async () => {
    const resource = new Receipts({ _httpClient: http, auth: {} } as any);
    await resource.refundReceipt('receipt/1', { store_id: 'store' });
    expect(http.post).toHaveBeenCalled();
  });
  test('merchant resource is constructible', () => {
    expect(new Merchant({ _httpClient: http, auth: {} } as any)).toBeInstanceOf(Merchant);
  });
});
