import fs from 'fs';
import stream from 'stream';
import { promisify } from 'util';
import { Item, GetQueryParams } from '../typings/Resources/Item';
import Resource from '../lib/Resource';
import { DeleteObjectIDs, WithCursor } from '../typings';

export default class Items extends Resource {
  baseURL = '/items';

  /**
   * @description Get a single item
   * @see https://developer.loyverse.com/docs/#tag/Items/paths/~1items~1{item_id}/get
   * @param itemID
   */
  async getItem(itemID: string) {
    const res = await this.httpClient.get<Item>(this.getURL(itemID));
    return res.body;
  }

  /**
   * @description Get a list of items
   * @see https://developer.loyverse.com/docs/#tag/Items/paths/~1items/get
   * @param {GetQueryParams} opts
   */
  async getItems(opts?: GetQueryParams) {
    if (opts && opts.items_ids) {
      // join filtered item ids as expected by endpoint
      opts.items_ids = this.splitList(opts.items_ids) as any;
    }
    const res = await this.httpClient.get<WithCursor<{ items: Item[] }>>(this.params(this.getURL(), opts));
    return res.body;
  }

  /**
   * @description Get a single item
   * @see https://developer.loyverse.com/docs/#tag/Items/paths/~1items/post
   * @param {Partial<Item> & {item_name: string}} item
   */
  async createItem(item: Partial<Item> & { item_name: string }) {
    const res = await this.httpClient.post<Item>(this.getURL(), {
      json: item,
    });
    return res.body;
  }

  /**
   * @description Delete a single item
   * @see https://developer.loyverse.com/docs/#tag/Items/paths/~1items~1{item_id}/delete
   * @param itemID
   */
  async deleteItem(itemID: string) {
    const res = await this.httpClient.delete<WithCursor<DeleteObjectIDs>>(this.getURL(itemID));
    return res.body;
  }

  /**
   * @description Upload Item Image
   * @see https://developer.loyverse.com/docs/#tag/Items/paths/~1items~1{item_id}~1image/post
   * @param itemID
   * @param imagePathOrStream absolute path to the image or a readable file stream
   */
  async uploadImage(itemID: string, imagePathOrStream: fs.ReadStream | string) {
    let readStream: fs.ReadStream;

    if (typeof imagePathOrStream === 'string') {
      readStream = fs.createReadStream(imagePathOrStream);
    } else {
      readStream = imagePathOrStream;
    }

    const pipeline = promisify(stream.pipeline);

    // For POST, PUT, PATCH, and DELETE methods, `got.stream` returns a `stream.Writable`.
    await pipeline(
      readStream,
      this.httpClient.stream.post(this.getURL(itemID, 'image'), { headers: { 'Content-Type': 'image/png' } }),
    );
  }

  /**
   * @description Download Item Image
   * @see https://developer.loyverse.com/docs/#tag/Items/paths/~1items~1{item_id}~1image/post
   * @param itemID
   * @param imagePathOrStream absolute path to save image to or a writable file stream
   */
  async downloadImage(itemID: string, imagePathOrStream: fs.WriteStream | string) {
    let writeStream: fs.WriteStream;

    if (typeof imagePathOrStream === 'string') {
      writeStream = fs.createWriteStream(imagePathOrStream);
    } else {
      writeStream = imagePathOrStream;
    }

    const pipeline = promisify(stream.pipeline);
    return pipeline(this.httpClient.stream(this.getURL(itemID, 'image'), { method: 'POST' }), writeStream);
  }

  /**
   * @description Delete Item Image
   * @see https://developer.loyverse.com/docs/#tag/Items/paths/~1items~1{item_id}~1image/delete
   * @param itemID
   */
  async deleteImage(itemID: string) {
    const res = await this.httpClient.delete<any>(this.getURL(itemID, 'image'));
    return res.body;
  }
}
