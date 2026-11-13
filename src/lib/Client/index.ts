import Got, { ExtendOptions, Got as IGot } from 'got';
import { OAuth2, IOAuth2 } from '../Auth/Providers/OAuth2.0';
import { PersonalAccessTokenAuth, IPersonalAccessTokenAuth } from '../Auth/Providers/PersonalAccessToken';

import { LoyverseAPIError, LoyverseError } from '../../Errors';
import { AuthMethod } from '../Auth/BaseAuth';
import { HTTPClient } from '../../typings';
import { ResourceConstructor } from '../Resource';

import Items from '../Resources/Items';
import Stores from '../Resources/Stores';
import Categories from '../Resources/Categories';
import Inventory from '../Resources/Inventory';
import Variants from '../Resources/Variants';
import Customers from '../Resources/Customers';
import Discounts from '../Resources/Discounts';
import Employees from '../Resources/Employees';
import Merchant from '../Resources/Merchant';
import Modifiers from '../Resources/Modifiers';
import PaymentTypes from '../Resources/PaymentTypes';
import POSDevices from '../Resources/POSDevices';
import Receipts from '../Resources/Receipts';
import Shifts from '../Resources/Shifts';
import Suppliers from '../Resources/Suppliers';
import Taxes from '../Resources/Taxes';
import Webhooks from '../Resources/Webhooks';

export interface IClientResource {
  auth: IOAuth2 | IPersonalAccessTokenAuth;
  _httpClient: IGot;
}

type Authenticators = IPersonalAccessTokenAuth | IOAuth2 | string;

export class Client<T extends Authenticators> {
  private _httpClient: IGot;
  auth: T extends IOAuth2
    ? IOAuth2
    : T extends IPersonalAccessTokenAuth
    ? IPersonalAccessTokenAuth
    : IPersonalAccessTokenAuth;
  authMethod: AuthMethod;
  #debug = false;

  constructor(auth: T, httpClient?: HTTPClient) {
    this.auth = typeof auth === 'string' ? new PersonalAccessTokenAuth(auth) : (auth as any);
    this.authMethod =
      typeof auth === 'string'
        ? AuthMethod.PERSONAL_ACCESS_TOKEN
        : auth instanceof OAuth2
        ? AuthMethod.OAUTH
        : AuthMethod.PERSONAL_ACCESS_TOKEN;

    /* istanbul ignore next */
    const httpClientOpts: ExtendOptions = {
      prefixUrl: `${this.auth.apiBaseURL}/${this.auth.apiVersion}`,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Loyverse Node.js API wrapper | https://github.com/AF111/loyverse-api-wrapper',
      },
      responseType: 'json',
      hooks: {
        beforeRequest: [
          (opts) => {
            const bearerToken =
              this.auth.authMethod === AuthMethod.PERSONAL_ACCESS_TOKEN
                ? this.auth.getAccessToken()
                : (this.auth as IOAuth2).getAccessToken().access_token;

            if (this.debug()) {
              // eslint-disable-next-line no-console
              console.log(`HTTPClient:${opts.method} ${opts.url.pathname}${opts.url.search}`);
            }

            if (!bearerToken) {
              throw new Error('[httpClient]: No access token has been set');
            } else {
              opts.headers.Authorization = `Bearer ${bearerToken}`;
            }
          },
        ],
        afterResponse: [
          async (res, retryWithMergedOptions) => {
            // Refresh an expired OAuth token once. A still-valid token receiving 401 is not blindly retried.
            if (res.statusCode === 401) {
              if (this.auth instanceof PersonalAccessTokenAuth) {
                throw new Error(
                  'API server return a 401 UNAUTHORIZED response, is your Personal access token still valid?',
                );
              }

              const auth = this.auth as IOAuth2;
              const accessToken = auth.getAccessToken();
              if (!auth.hasTokenExpired(accessToken)) {
                throw new Error('Loyverse rejected the OAuth access token. Verify its validity and granted scopes.');
              }
              if (!accessToken.refresh_token) {
                throw new Error('The OAuth access token has expired and no refresh token is available.');
              }

              const opts = {
                headers: {
                  Authorization: '',
                },
              };

              const refreshedToken = await auth.refreshAccessToken(accessToken.refresh_token);

              opts.headers.Authorization = `Bearer ${refreshedToken.access_token}`;

              // Save for further requests
              this._httpClient.defaults.options = Got.mergeOptions(this._httpClient.defaults.options, opts);
              // Make a new retry
              return retryWithMergedOptions(opts);
            }

            const result = res.body as any;
            const errors = result.errors as LoyverseError[];

            if (errors) {
              throw new LoyverseAPIError(
                errors.map((err) => new LoyverseError(err)),
                res.statusCode,
              );
            }
            return res;
          },
        ],
      },
    };

    /* istanbul ignore next */
    this._httpClient = httpClient ? httpClient.extend(httpClientOpts) : Got.extend(httpClientOpts);
    const init = this.#initResource;

    init(Items);
    init(Stores);
    init(Inventory);
    init(Categories);
    init(Variants);
    init(Customers); init(Discounts); init(Employees); init(Merchant); init(Modifiers);
    init(PaymentTypes); init(POSDevices); init(Receipts); init(Shifts); init(Suppliers); init(Taxes); init(Webhooks);
  }

  #initResource = (R: ResourceConstructor) => {
    const name = R.name === 'PaymentTypes' ? 'paymentTypes' : R.name === 'POSDevices' ? 'posDevices' : R.name.toLowerCase();
    (this as any)[name] = new R({ _httpClient: this._httpClient, auth: this.auth });
  };

  debug(newVal?: boolean) {
    if (typeof newVal === 'boolean') {
      this.#debug = newVal;
    }
    return this.#debug;
  }

  items: Items;
  stores: Stores;
  inventory: Inventory;
  categories: Categories;
  variants: Variants;
  customers: Customers;
  discounts: Discounts;
  employees: Employees;
  merchant: Merchant;
  modifiers: Modifiers;
  paymentTypes: PaymentTypes;
  posDevices: POSDevices;
  receipts: Receipts;
  shifts: Shifts;
  suppliers: Suppliers;
  taxes: Taxes;
  webhooks: Webhooks;
}
