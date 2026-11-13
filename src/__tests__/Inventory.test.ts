import Inventory from '../lib/Resources/Inventory';

describe('inventory request payload', () => {
  test('wraps batch changes in inventory_levels', async () => {
    const http: any = { post: jest.fn(async () => ({ body: { inventory_levels: [] } })) };
    const resource = new Inventory({ _httpClient: http, auth: {} } as any);
    const changes = [{ variant_id: 'v-1', store_id: 's-1', stock_after: 12 }];
    await resource.updateInventoryLevels(changes);
    expect(http.post).toHaveBeenCalledWith('/inventory', { json: { inventory_levels: changes } });
  });
});
