import Resource from '../Resource';
import { WithCursor } from '../../typings';

export default class Variants extends Resource {
  baseURL = '/variants';
  async getVariants(opts?: Record<string, any>) {
    const query = { ...(opts ?? {}) };
    for (const key of Object.keys(query)) if (Array.isArray(query[key])) query[key] = query[key].join(',');
    const response = await this.httpClient.get<WithCursor<{ variants: Record<string, any>[] }>>(this.params(this.getURL(), query));
    return response.body;
  }
  async getVariant(id: string) {
    const response = await this.httpClient.get<Record<string, any>>(this.getURL(encodeURIComponent(id)));
    return response.body;
  }
}
