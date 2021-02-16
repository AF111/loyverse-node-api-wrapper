export enum DefaultPricingType {
  FIXED = 'FIXED',
  VARIABLE = 'VARIABLE',
}

export enum ObjectShape {
  SQUARE = 'SQUARE',
  CIRCLE = 'CIRCLE',
  SUN = 'SUN',
  OCTAGON = 'OCTAGON',
}

export enum ObjectColor {
  GREY = 'GREY',
  RED = 'RED',
  PINK = 'PINK',
  ORANGE = 'ORANGE',
  YELLOW = 'YELLOW',
  GREEN = 'GREEN',
  BLUE = 'BLUE',
  PURPLE = 'PURPLE',
}

/**
 * @description A list of permissions to the retailer's account that your app needs.
 * Separated by the space character %20
 * @see https://developer.loyverse.com/docs/#oauth-authentication-flow Permissions list
 */
export enum Scope {
  /**
   * @description Read customer information
   */
  CUSTOMERS_READ = 'CUSTOMERS_READ',
  /**
   * @description Edit customer information
   */
  CUSTOMERS_WRITE = 'CUSTOMERS_WRITE',
  /**
   * @description Read employee information
   */
  EMPLOYEES_READ = 'EMPLOYEES_READ',
  /**
   * @description Read items, categories, discounts and modifiers
   */
  ITEMS_READ = 'ITEMS_READ',
  /**
   * @description Read inventory
   */
  INVENTORY_READ = 'INVENTORY_READ',
  /**
   * @description Edit inventory
   */
  INVENTORY_WRITE = 'INVENTORY_WRITE',
  /**
   * @description Edit items, discounts, categories and modifiers
   */
  ITEMS_WRITE = 'ITEMS_WRITE',
  /**
   * @description Read merchant information
   */
  MERCHANT_READ = 'MERCHANT_READ',
  /**
   * @description Read payment types
   */
  PAYMENT_TYPES_READ = 'PAYMENT_TYPES_READ',
  /**
   * @description Read POS devices information
   */
  POS_DEVICES_READ = 'POS_DEVICES_READ',
  /**
   * @description Update POS devices information
   */
  POS_DEVICES_WRITE = 'POS_DEVICES_WRITE',
  /**
   * @description Read receipts
   */
  RECEIPTS_READ = 'RECEIPTS_READ',
  /**
   * @description Create receipts
   */
  RECEIPTS_WRITE = 'RECEIPTS_WRITE',
  /**
   * @description Read shifts
   */
  SHIFTS_READ = 'SHIFTS_READ',
  /**
   * @description Read store information
   */
  STORES_READ = 'STORES_READ',
  /**
   * @description Read supplier information
   */
  SUPPLIERS_READ = 'SUPPLIERS_READ',
  /**
   * @description Edit supplier information
   */
  SUPPLIERS_WRITE = 'SUPPLIERS_WRITE',
  /**
   * @description Read taxes
   */
  TAXES_READ = 'TAXES_READ',
  /**
   * @description Edit taxes
   */
  TAXES_WRITE = 'TAXES_WRITE',
}
