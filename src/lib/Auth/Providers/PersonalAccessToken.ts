import { BaseAuth, AuthMethod } from '../BaseAuth';

export interface IPersonalAccessTokenAuth extends BaseAuth<AuthMethod.PERSONAL_ACCESS_TOKEN> {}

/**
 * @description Personal access token Authorization - Simple to use (does not require OAuth Flow)
 * @see https://developer.loyverse.com/docs/#section/Authorization/Personal-access-tokens
 */
export class PersonalAccessTokenAuth
  extends BaseAuth<AuthMethod.PERSONAL_ACCESS_TOKEN>
  implements IPersonalAccessTokenAuth {
  constructor(personalAccessToken?: string) {
    super(AuthMethod.PERSONAL_ACCESS_TOKEN);

    if (personalAccessToken) {
      this.setAccessToken(personalAccessToken);
    }
  }
}
