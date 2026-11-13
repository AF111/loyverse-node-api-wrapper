export { LoyverseAPIError } from './Errors';
export { HTTPError } from 'got/dist/source';
export { PersonalAccessTokenAuth } from './lib/Auth/Providers/PersonalAccessToken';
export { OAuth2 } from './lib/Auth/Providers/OAuth2.0';
export * from './lib/Client';

export { default as Customers } from './lib/Resources/Customers';
export { default as Discounts } from './lib/Resources/Discounts';
export { default as Employees } from './lib/Resources/Employees';
export { default as Merchant } from './lib/Resources/Merchant';
export { default as Modifiers } from './lib/Resources/Modifiers';
export { default as PaymentTypes } from './lib/Resources/PaymentTypes';
export { default as POSDevices } from './lib/Resources/POSDevices';
export { default as Receipts } from './lib/Resources/Receipts';
export { default as Shifts } from './lib/Resources/Shifts';
export { default as Suppliers } from './lib/Resources/Suppliers';
export { default as Taxes } from './lib/Resources/Taxes';
export { default as Webhooks } from './lib/Resources/Webhooks';
export { default as Variants } from './lib/Resources/Variants';
