import Variants from '../lib/Resources/Variants';

describe('variant resource', () => {
  const http: any = {
    get: jest.fn(async () => ({ body: { variants: [] } })),
    post: jest.fn(async () => ({ body: { variant_id: 'v-1' } })),
    delete: jest.fn(async () => ({ body: { deleted_object_ids: ['v-1'] } })),
  };
  const resource = new Variants({ _httpClient: http, auth: {} } as any);
  test('creates and deletes variants', async () => {
    await resource.createVariant({ item_id: 'i-1' });
    await resource.deleteVariant('v/1');
    expect(http.post).toHaveBeenCalledWith('variants', { json: { item_id: 'i-1' } });
    expect(http.delete).toHaveBeenCalledWith('variants/v%2F1');
  });
});
