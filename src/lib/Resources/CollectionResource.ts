import Resource from '../Resource';
import { WithCursor, DeleteObjectIDs } from '../../typings';

export type ResourceQuery = Record<string, string | number | boolean | string[] | undefined>;
export type ResourceEntity = Record<string, any>;

export default class CollectionResource extends Resource {
  protected async list<T>(key: string, opts?: ResourceQuery) {
    const query = { ...(opts ?? {}) };
    Object.keys(query).forEach((name) => {
      if (Array.isArray(query[name])) query[name] = (query[name] as string[]).join(',');
    });
    const response = await this.httpClient.get<WithCursor<Record<string, T[]>>>(this.params(this.getURL(), query));
    return response.body as WithCursor<Record<typeof key, T[]>>;
  }
  protected async get<T>(id: string) {
    const response = await this.httpClient.get<T>(this.getURL(encodeURIComponent(id)));
    return response.body;
  }
  protected async save<T>(value: ResourceEntity) {
    const response = await this.httpClient.post<T>(this.getURL(), { json: value });
    return response.body;
  }
  protected async remove(id: string): Promise<DeleteObjectIDs> {
    const response = await this.httpClient.delete<DeleteObjectIDs>(this.getURL(encodeURIComponent(id)));
    return response.body;
  }
}
