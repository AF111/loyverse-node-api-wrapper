export interface IAccessToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  expires_at: number;
  scope: string[];
}

/**
 * @description API Refresh Token Result
 */
export type AccessTokenResult = IAccessToken & {
  errors?: any[];
};

export class AccessToken implements IAccessToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  expires_at: number;
  scope: string[];

  constructor(props?: IAccessToken) {
    this.access_token = props?.access_token ?? '';
    this.expires_at = props?.expires_at ?? -1;
    this.expires_in = props?.expires_in ?? -1;
    this.refresh_token = props?.refresh_token ?? '';
    const scope = props?.scope ?? [];

    this.scope = Array.isArray(scope) ? scope : (scope as string).split(' ');
    this.token_type = props?.token_type ?? 'Bearer';
  }
}
