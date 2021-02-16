import Got, { ExtendOptions, Got as IGot } from 'got';
import { OAuth2, IOAuth2 } from '../Auth/Providers/OAuth2.0';
import { PersonalAccessTokenAuth, IPersonalAccessTokenAuth } from '../Auth/Providers/PersonalAccessToken';

import { LoyverseAPIError, LoyverseError } from '../../Errors';
import { AuthMethod } from '../Auth/BaseAuth';
import { HTTPClient } from '../../typings';
import { ResourceConstructor } from '../Resource';

import Items from '../../Resources/Items';
import Stores from '../../Resources/Stores';
import Categories from '../../Resources/Categories';
import Inventory from '../../Resources/Inventory';

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
            // Referesh access token if expired;
            if (res.statusCode === 401) {
              if (this.auth instanceof PersonalAccessTokenAuth) {
                throw new Error(
                  'API server return a 401 UNAUTHORIZED response, is your Personal access token still valid?',
                );
              }

              const auth = this.auth as IOAuth2;
              let accessToken = auth.getAccessToken();

              const opts = {
                headers: {
                  Authorization: '',
                },
              };

              if (auth.hasTokenExpired(accessToken)) {
                accessToken = await auth.refreshAccessToken(accessToken.refresh_token);
              }

              opts.headers.Authorization = `Bearer ${accessToken.access_token}`;

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
  }

  #initResource = (R: ResourceConstructor) => {
    (this as any)[R.name.toLowerCase()] = new R({ _httpClient: this._httpClient, auth: this.auth });
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
}
