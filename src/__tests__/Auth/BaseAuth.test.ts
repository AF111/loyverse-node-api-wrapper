import { AuthMethod, BaseAuth } from '../../lib/Auth/BaseAuth';
import { AccessToken } from '../../lib/Auth/AccessToken';
import { OAuth2 } from '../../lib/Auth/Providers/OAuth2.0';
import { PersonalAccessTokenAuth } from '../../lib/Auth/Providers/PersonalAccessToken';

describe('base Auth class tests', () => {
  test('can get and set access tokens using both PersonalAcessTokenAuth and OAuth2.0', (done) => {
    const oauth2 = new OAuth2({ clientID: '', clientSecret: '', redirectURL: '', scope: [] });
    const personalAuth = new PersonalAccessTokenAuth('');
    const OAuthAccessToken = new AccessToken();

    oauth2.setAccessToken(OAuthAccessToken);
    personalAuth.setAccessToken('personal_token');

    expect(oauth2.getAccessToken()).toEqual(OAuthAccessToken);
    expect(personalAuth.getAccessToken()).toEqual('personal_token');
    done();
  });

  test('throws when provided wrong value type to setAccessToken (using PersonalAcessTokenAuth)', (done) => {
    const auth = new BaseAuth(AuthMethod.PERSONAL_ACCESS_TOKEN);
    expect(() => auth.setAccessToken(null as any)).toThrow();
    done();
  });

  test('throws when setting invalid key for access token', (done) => {
    const auth = new BaseAuth(AuthMethod.OAUTH);
    expect(() => auth.setAccessToken({ access_token: 'xx', doesNotExist: null } as any)).toThrow();
    done();
  });

  test('throws when setting wrong value type to a number field for access token', (done) => {
    const auth = new BaseAuth(AuthMethod.OAUTH);
    expect(() => auth.setAccessToken({ expires_in: 'xx' } as any)).toThrow();
    done();
  });

  test('throws when setting wrong value type to a string field for access token', (done) => {
    const auth = new BaseAuth(AuthMethod.OAUTH);
    expect(() => auth.setAccessToken({ access_token: 21 } as any)).toThrow();
    done();
  });
});
