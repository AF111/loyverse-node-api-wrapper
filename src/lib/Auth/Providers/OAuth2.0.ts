/* eslint-disable max-len */
import got from 'got';
import qs from 'querystring';
import { BaseAuth, AuthMethod } from '../BaseAuth';
import { AccessToken, AccessTokenResult, IAccessToken } from '../AccessToken';
import { Scope } from '../../../typings/Enums';
import { HTTPClient } from '../../../typings';

export type TokenExpiryProps = Pick<AccessToken, 'expires_at'> & Partial<Exclude<AccessToken, 'expires_at'>>;
export type RefreshTokenListener = (accessToken: AccessToken) => any;

export interface OAuth2Credentials {
  clientID: string;
  clientSecret: string;
  redirectURL: string;
  scope: Scope[];
}

export interface IOAuth2 extends BaseAuth<AuthMethod.OAUTH> {
  getAuthURL(state?: string): string;
  authorize(authorizationCode: string, timeNow?: number): Promise<AccessToken>;
  refreshAccessToken(refreshToken: string, timeNow?: number): Promise<AccessToken>;
  hasTokenExpired(token: TokenExpiryProps): boolean;
  addRefreshTokenListener(cb: RefreshTokenListener): void;
  getCredentials(): OAuth2Credentials;
  setCredentials(credentials: OAuth2Credentials): void;
  removeRefreshTokenListener(cb: RefreshTokenListener): void;
}
/**
 * @description OAuth 2.0 Flow
 * @see https://developer.loyverse.com/docs/#section/Authorization/OAuth-2.0
 */
export class OAuth2 extends BaseAuth<AuthMethod.OAUTH> implements IOAuth2 {
  private isRefreshing = false;
  private httpClient: HTTPClient;
  #refreshTokenListeners: RefreshTokenListener[] = [];
  #credentials: OAuth2Credentials = {
    clientID: '',
    clientSecret: '',
    redirectURL: '',
    scope: [],
  };

  static Scope = Scope;
  private endpoints = {
    TOKEN: '/oauth/token',
    AUTHORIZE: '/oauth/authorize',
  };

  constructor(credentials: OAuth2Credentials, accessToken?: AccessToken);
  constructor(credentials: OAuth2Credentials, httpClient?: HTTPClient);
  constructor(credentials: OAuth2Credentials, accessToken?: AccessToken, httpClient?: HTTPClient);
  constructor(
    credentials: OAuth2Credentials,
    accessTokenOrClient?: IAccessToken | HTTPClient,
    httpClient?: HTTPClient | undefined,
  ) {
    super(AuthMethod.OAUTH);

    this.setCredentials(credentials);

    if (accessTokenOrClient) {
      if (accessTokenOrClient instanceof Function) {
        this.httpClient = accessTokenOrClient;
      } else {
        this.setAccessToken(accessTokenOrClient);
        this.httpClient = httpClient ?? got;
      }
    } else {
      this.httpClient = httpClient ?? got;
    }
  }

  getCredentials() {
    return this.#credentials;
  }

  setCredentials(credentials: OAuth2Credentials) {
    const validKeys = ['clientID', 'clientSecret', 'redirectURL', 'scope'];

    for (const k in credentials) {
      /* istanbul ignore next */
      if (Object.prototype.hasOwnProperty.call(credentials, k)) {
        if (!validKeys.includes(k)) {
          throw new Error(`[setCredentials] Unknown key ${k}`);
        }

        if (k === 'scope') {
          if (!Array.isArray(credentials.scope)) {
            throw new Error(
              `[setCredentials] scopes must be an array of scopes (string) but got ${typeof (credentials as any)
                .scope}`,
            );
          }
        } else if (typeof (credentials as any)[k] !== 'string') {
          throw new Error(`[setCredentials] ${k} must be a string but got ${typeof (credentials as any)[k]}`);
        }
      }
    }

    this.#credentials = { ...(this.#credentials as any), ...(credentials as any) };
  }

  hasTokenExpired = (token: TokenExpiryProps) => {
    const now = Date.now();
    return token.expires_at - now <= 0;
  };

  /**
   * @description Generates Auth URL for the user to authorize your app to access Loyverse API on their behalf
   * @param {string} state provide a unique value to identify the request when the user is redirected back to your app (optional but recommended)
   * You are responsible for how you do the check
   * @returns {String} https://api.loyverse.com/oauth/authorize?client_id={your_client_id}&scope={your_scopes}&response_type=code&redirect_uri=https://www.yoursite.com/callback
   */
  getAuthURL(state?: string) {
    const creds = this.getCredentials();

    const opts: Record<string, string> = {
      client_id: creds.clientID,
      scope: creds.scope.join(' '),
      response_type: 'code',
      redirect_uri: creds.redirectURL,
    };

    if (state) opts.state = state;

    const query = qs.stringify(opts);

    return `${this.apiBaseURL}${this.endpoints.AUTHORIZE}?${query}`;
  }

  /**
   * @description Requests access token using the authorizationCode code
   * @param {string} authorizationCode the code sent back from Loyverse
   */
  async authorize(authorizationCode: string, timeNow?: number): Promise<AccessToken> {
    const creds = this.getCredentials();

    const res = await this.httpClient.post<IAccessToken>(`${this.apiBaseURL}${this.endpoints.TOKEN}`, {
      form: {
        client_id: creds.clientID,
        client_secret: creds.clientSecret,
        redirect_uri: creds.redirectURL,
        code: authorizationCode,
        grant_type: 'authorization_code',
      },
      responseType: 'json',
    });

    const accessToken = new AccessToken(res.body);
    /* istanbul ignore next */
    accessToken.expires_at = (timeNow ?? Date.now()) + accessToken.expires_in * 1000;

    this.setAccessToken(accessToken);
    return accessToken;
  }

  refreshAccessToken(refreshToken: string, timeNow?: number): Promise<AccessToken> {
    return new Promise((resolve, reject) => {
      if (this.isRefreshing) {
        // wait until refreshed
        let count = 0;
        const timerID = setInterval(() => {
          if (!this.isRefreshing) {
            if (count >= 5) {
              reject(
                new Error(
                  '[OAuth2.0:refreshAccessToken] Reached max timeout while awaiting token to be refreshed',
                ),
              );
              return;
            }

            clearInterval(timerID);
            resolve(this.getAccessToken());
          }
          count++;
        }, 500);
        return;
      }

      this.isRefreshing = true;

      const creds = this.getCredentials();

      this.httpClient
        .post<AccessTokenResult>(`${this.apiBaseURL}${this.endpoints.TOKEN}`, {
          form: {
            client_id: creds.clientID,
            client_secret: creds.clientSecret,
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
          },
          responseType: 'json',
        })
        .then((res) => {
          /* istanbul ignore next */
          const expires_at = (timeNow ?? Date.now()) + res.body.expires_in * 1000;
          const accessToken = new AccessToken({
            ...res.body,
            expires_at,
          });

          this.setAccessToken(accessToken);
          this.#invokeRefreshTokenListeners(accessToken);
          resolve(accessToken);
        })
        .catch(reject)
        .finally(() => {
          this.isRefreshing = false;
        });
    });
  }

  /* istanbul ignore next */
  #invokeRefreshTokenListeners = (accessToken: AccessToken) => {
    if (this.#refreshTokenListeners.length) {
      for (const listener of this.#refreshTokenListeners) {
        listener(accessToken);
      }
    }
  };

  addRefreshTokenListener(listener: RefreshTokenListener) {
    if (typeof listener !== 'function') {
      throw new Error('Listener must be a function');
    }
    this.#refreshTokenListeners.push(listener);
  }

  removeRefreshTokenListener(listener: RefreshTokenListener) {
    this.#refreshTokenListeners = this.#refreshTokenListeners.filter((l) => l !== listener);
  }
}
