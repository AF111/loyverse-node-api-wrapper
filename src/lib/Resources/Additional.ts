import Resource from '../Resource';
import { WithCursor, DeleteObjectIDs } from '../../typings';

type Query = Record<string, string | number | boolean | string[] | undefined>;
type Entity = Record<string, any>;
class CollectionResource extends Resource {
  protected async list<T, K extends string>(path: string, key: K, opts?: Query): Promise<WithCursor<Record<K, T[]>>> {
    const query = { ...(opts ?? {}) };
    Object.keys(query).forEach((name) => {
      if (Array.isArray(query[name])) query[name] = (query[name] as string[]).join(',');
    });
    const response = await this.httpClient.get<WithCursor<Record<K, T[]>>>(this.params(path ? this.getURL(path) : this.getURL(), query));
    return response.body;
  }
  protected async get<T>(path: string, id: string): Promise<T> {
    const response = await this.httpClient.get<T>((path ? this.getURL(path, encodeURIComponent(id)) : this.getURL(encodeURIComponent(id))));
    return response.body;
  }
  protected async save<T>(path: string, value: Entity): Promise<T> {
    const response = await this.httpClient.post<T>(path ? this.getURL(path) : this.getURL(), { json: value });
    return response.body;
  }
  protected async remove(path: string, id: string): Promise<DeleteObjectIDs> {
    const response = await this.httpClient.delete<DeleteObjectIDs>((path ? this.getURL(path, encodeURIComponent(id)) : this.getURL(encodeURIComponent(id))));
    return response.body;
  }
}

export class Customers extends CollectionResource {
  baseURL = '/customers';
  getCustomers(opts?: Query) { return this.list<Entity>('', 'customers', opts); }
  getCustomer(id: string) { return this.get<Entity>('', id); }
  createCustomer(customer: Entity) { return this.save<Entity>('', customer); }
}
export class Discounts extends CollectionResource {
  baseURL = '/discounts';
  getDiscounts(opts?: Query) { return this.list<Entity>('', 'discounts', opts); }
  getDiscount(id: string) { return this.get<Entity>('', id); }
}
export class Employees extends CollectionResource {
  baseURL = '/employees';
  getEmployees(opts?: Query) { return this.list<Entity>('', 'employees', opts); }
  getEmployee(id: string) { return this.get<Entity>('', id); }
}
export class Merchant extends CollectionResource {
  baseURL = '/merchant';
  getMerchant() { return this.httpClient.get<Entity>(this.getURL()).then((r) => r.body); }
}
export class Modifiers extends CollectionResource {
  baseURL = '/modifiers';
  getModifiers(opts?: Query) { return this.list<Entity>('', 'modifiers', opts); }
  getModifier(id: string) { return this.get<Entity>('', id); }
  createModifier(modifier: Entity) { return this.save<Entity>('', modifier); }
  deleteModifier(id: string) { return this.remove('', id); }
}
export class PaymentTypes extends CollectionResource {
  baseURL = '/payment_types';
  getPaymentTypes(opts?: Query) { return this.list<Entity>('', 'payment_types', opts); }
  getPaymentType(id: string) { return this.get<Entity>('', id); }
}
export class POSDevices extends CollectionResource {
  baseURL = '/pos_devices';
  getPOSDevices(opts?: Query) { return this.list<Entity>('', 'pos_devices', opts); }
  getPOSDevice(id: string) { return this.get<Entity>('', id); }
  updatePOSDevice(device: Entity) { return this.save<Entity>('', device); }
}
export class Receipts extends CollectionResource {
  baseURL = '/receipts';
  getReceipts(opts?: Query) { return this.list<Entity>('', 'receipts', opts); }
  getReceipt(receiptNumber: string) { return this.get<Entity>('', receiptNumber); }
  createReceipt(receipt: Entity) { return this.save<Entity>('', receipt); }
  async refundReceipt(receiptNumber: string, refund: Entity) {
    const response = await this.httpClient.post<Entity>(this.getURL(encodeURIComponent(receiptNumber), 'refund'), { json: refund });
    return response.body;
  }
}
export class Shifts extends CollectionResource {
  baseURL = '/shifts';
  getShifts(opts?: Query) { return this.list<Entity>('', 'shifts', opts); }
  getShift(id: string) { return this.get<Entity>('', id); }
}
export class Suppliers extends CollectionResource {
  baseURL = '/suppliers';
  getSuppliers(opts?: Query) { return this.list<Entity>('', 'suppliers', opts); }
  getSupplier(id: string) { return this.get<Entity>('', id); }
  createSupplier(supplier: Entity) { return this.save<Entity>('', supplier); }
  deleteSupplier(id: string) { return this.remove('', id); }
}
export class Taxes extends CollectionResource {
  baseURL = '/taxes';
  getTaxes(opts?: Query) { return this.list<Entity>('', 'taxes', opts); }
  getTax(id: string) { return this.get<Entity>('', id); }
  createTax(tax: Entity) { return this.save<Entity>('', tax); }
  deleteTax(id: string) { return this.remove('', id); }
}
export class Webhooks extends CollectionResource {
  baseURL = '/webhooks';
  getWebhooks(opts?: Query) { return this.list<Entity>('', 'webhooks', opts); }
  getWebhook(id: string) { return this.get<Entity>('', id); }
  createWebhook(webhook: Entity) { return this.save<Entity>('', webhook); }
  deleteWebhook(id: string) { return this.remove('', id); }
}
