import { IAccessToken } from './AccessToken';

export enum AuthMethod {
  OAUTH = 'OAUTH',
  PERSONAL_ACCESS_TOKEN = 'PERSONAL_ACCESS_TOKEN',
}

export interface IBaseAuth {
  authMethod: AuthMethod;
}

interface AccessTokens {
  [AuthMethod.PERSONAL_ACCESS_TOKEN]: string;
  [AuthMethod.OAUTH]: IAccessToken;
}

export class BaseAuth<T extends AuthMethod> implements IBaseAuth {
  #accessToken: AccessTokens[T];
  apiBaseURL = 'https://api.loyverse.com';
  apiVersion = 'v1.0';

  constructor(public authMethod: T) {}

  getAccessToken() {
    return this.#accessToken;
  }

  setAccessToken(accessToken: AccessTokens[T]) {
    if (this.authMethod === AuthMethod.PERSONAL_ACCESS_TOKEN) {
      if (typeof accessToken !== 'string') {
        throw new Error(`[setAccessToken] personal access token must be a string but got ${typeof accessToken}`);
      }
      this.#accessToken = accessToken;
      return;
    }

    const validKeys = ['access_token', 'token_type', 'expires_in', 'refresh_token', 'expires_at', 'scope'];

    for (const k in accessToken) {
      /* istanbul ignore next */
      if (Object.prototype.hasOwnProperty.call(accessToken, k)) {
        if (!validKeys.includes(k)) {
          throw new Error(`[setAccessToken] Unknown key ${k}`);
        }

        const valueType = typeof (accessToken as any)[k];

        switch (k) {
          case 'scope':
            if (!Array.isArray(accessToken[k])) {
              throw new Error('Scope should be an array');
            }
            break;
          case 'expires_in':
          case 'expires_at':
            if (valueType !== 'number') {
              throw new Error(`[setAccessToken] ${k} should be a number but got ${valueType}`);
            }
            break;
          default:
            if (valueType !== 'string') {
              throw new Error(`[setAccessToken] ${k} should be a string but got ${valueType}`);
            }
        }
      }
    }

    this.#accessToken = { ...(this.#accessToken as any), ...(accessToken as any) } as any;
  }
}
