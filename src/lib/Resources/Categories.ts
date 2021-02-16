import { DeleteObjectIDs, WithCursor } from '../../typings';
import Resource from '../Resource';
import { Category, GetQueryParams } from '../../typings/Resources/Category';

export default class Categories extends Resource {
  baseURL = '/categories';

  /**
   * @description Gets a single Category
   * @see https://developer.loyverse.com/docs/#tag/Categories/paths/~1categories~1{category_id}/get
   * @param {string} categoryID
   */
  async getCategory(categoryID: number) {
    const res = await this.httpClient.get<Category>(this.getURL(categoryID));
    return res.body;
  }

  /**
   * @description Gets a list of Categories
   * @see https://developer.loyverse.com/docs/#tag/Categories/paths/~1categories/get
   * @param {GetQueryParams} opts
   */
  async getCategories(opts?: GetQueryParams) {
    if (opts?.categories_ids) {
      opts.categories_ids = this.splitList(opts.categories_ids) as any;
    }
    const res = await this.httpClient.get<WithCursor<{ categories: Category[] }>>(
      this.params(this.getURL(), opts),
    );
    return res.body;
  }

  /**
   * @description Create or update a single Category
   * @see https://developer.loyverse.com/docs/#tag/Categories/paths/~1categories/post
   * @param {Partial<Category> & {name: string}} category
   */
  async createCategory(category: Partial<Category> & { name: string }) {
    const res = await this.httpClient.post<Category>(this.getURL(), { json: category });
    return res.body;
  }

  /**
   * @description Delete a single Category
   * @see https://developer.loyverse.com/docs/#tag/Categories/paths/~1categories~1{category_id}/delete
   * @param {string} categoryID
   */
  async deleteCategory(categoryID: number) {
    const res = await this.httpClient.delete<DeleteObjectIDs>(this.getURL(categoryID));
    return res.body;
  }
}
