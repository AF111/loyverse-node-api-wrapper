import qs from 'querystring';
import { AccessToken } from '../../lib/Auth/AccessToken';
import { OAuth2 } from '../../lib/Auth/Providers/OAuth2.0';
import MockHTTPClient from '../../__mocks__/got';
import { OAuth2Credentials } from '../../../dist/lib/Auth/Providers/OAuth2.0';
import { AuthMethod } from '../../lib/Auth/BaseAuth';

const OAuthProps: OAuth2Credentials = {
  clientID: 'the_client_id',
  clientSecret: 'the_secret',
  redirectURL: 'https:/www.redirects.com',
  scope: [OAuth2.Scope.ITEMS_READ],
};

const auth = new OAuth2(OAuthProps);

describe('OAuth2.0 works', () => {
  test('initialized with correct config', (done) => {
    expect(auth.getCredentials()).toEqual(OAuthProps);
    done();
  });

  test('has the correct auth method set', (done) => {
    expect(auth.authMethod).toEqual(AuthMethod.OAUTH);
    done();
  });

  test('sets access token when intialized with as prop to constructor', (done) => {
    const accessToken: AccessToken = {
      access_token: 'atoken',
      refresh_token: 'rtoken',
      expires_at: Date.now() + 86400 * 1000,
      expires_in: 86400,
      scope: [''],
      token_type: 'Bearer',
    };

    expect(new OAuth2(OAuthProps, accessToken).getAccessToken()).toEqual(accessToken);
    done();
  });

  test('returns false when given an unexpired token', (done) => {
    const dateIn5Days = Date.now() + 86400 * 5 * 1000;
    expect(auth.hasTokenExpired({ expires_at: dateIn5Days })).toBe(false);
    done();
  });

  test('returns true when given an expired token', (done) => {
    const date1MinInThePast = Date.now() - 60 * 1000;
    expect(auth.hasTokenExpired({ expires_at: date1MinInThePast })).toBe(true);
    done();
  });

  test('properly constructs authorization url', (done) => {
    const q = qs.stringify({
      client_id: OAuthProps.clientID,
      scope: OAuthProps.scope.join(' '),
      response_type: 'code',
      redirect_uri: OAuthProps.redirectURL,
    });

    expect(auth.getAuthURL()).toEqual(`${auth.apiBaseURL}/oauth/authorize?${q}`);
    done();
  });

  test('constructs authorization url with state', (done) => {
    const state = 'x__state__x';
    const q = qs.stringify({
      client_id: OAuthProps.clientID,
      scope: OAuthProps.scope.join(' '),
      response_type: 'code',
      redirect_uri: OAuthProps.redirectURL,
      state,
    });

    expect(auth.getAuthURL(state)).toEqual(`${auth.apiBaseURL}/oauth/authorize?${q}`);
    done();
  });

  describe('mock tests', () => {
    test('correctly calls authorization endpoint and gets access token', () => {
      const expireAt = Date.now();
      const expectedResponse = new AccessToken({
        access_token: 'token',
        expires_at: expireAt + 3600 * 1000, // 1hr in the future
        expires_in: 3600, // 1hour in seconds
        refresh_token: 'rtoken',
        scope: [''],
        token_type: 'Bearer',
      });

      const auth = new OAuth2(OAuthProps, new MockHTTPClient({ expectedResponse }));
      return auth.authorize('auth_code', expireAt).then((r) => expect(r).toEqual(expectedResponse));
    });

    test('correctly calls refresh access token endpoint and gets token', () => {
      const timeNow = Date.now();
      const expiresIn = 3600;

      const expectedResponse = new AccessToken({
        access_token: 'token',
        expires_at: timeNow + expiresIn * 1000, // 1hr in the future
        expires_in: expiresIn, // 1hour in seconds
        refresh_token: 'rtoken',
        scope: [''],
        token_type: 'Bearer',
      });

      const auth = new OAuth2(OAuthProps, MockHTTPClient({ expectedResponse }));
      return auth.refreshAccessToken('refresh_token', timeNow).then((r) => {
        expect(r).toEqual(expectedResponse);
      });
    });

    describe('handles token refresh race condition (refreshing state)', () => {
      const timeNow = Date.now();
      const expiresIn = 3600;

      const expectedResponse = new AccessToken({
        access_token: 'token',
        expires_at: timeNow + expiresIn * 1000, // 1hr in the future
        expires_in: expiresIn, // 1hour in seconds
        refresh_token: 'rtoken',
        scope: [''],
        token_type: 'Bearer',
      });

      test('concurrently call refreshAccessToken', async () => {
        const auth = new OAuth2(OAuthProps, MockHTTPClient({ expectedResponse }));
        expect.assertions(2);
        const results = await Promise.all([
          auth.refreshAccessToken('refresh_token_1', timeNow),
          auth.refreshAccessToken('refresh_token_2', timeNow),
        ]);

        results.forEach((r) => expect(r).toEqual(expectedResponse));
      });

      test('times out after waiting upto 2.5s for refresh state reset', () => {
        const auth = new OAuth2(OAuthProps, MockHTTPClient({ expectedResponse }, 2600));
        auth.refreshAccessToken('refresh_token_1', timeNow);
        return expect(auth.refreshAccessToken('refresh_token_2', timeNow)).rejects.toThrow();
      });
    });

    test('throws when provided an invalid value to setCredentials (using OAuth2.0)', (done) => {
      expect(() => auth.setCredentials({ clientID: '', thisShouldNotExist: '' } as any)).toThrow();
      done();
    });

    test('throws when provided wrong scope to setCredentials (using OAuth2.0)', (done) => {
      const creds = { clientID: '', clientSecret: '', redirectURL: '', scope: 'wrong type' as any };
      expect(() => auth.setCredentials(creds)).toThrow();
      done();
    });

    test('throws when provided a wrong value type to a string field | setCredentials (using OAuth2)', (done) => {
      const creds = { clientID: -1 as any, clientSecret: '', redirectURL: '', scope: [] };
      expect(() => auth.setCredentials(creds)).toThrow();
      done();
    });

    describe('refresh token listeners tests', () => {
      test('adds a listener and gets token when refreshed', async () => {
        const timeNow = Date.now();
        const expiresIn = 3600;

        const expectedResponse = new AccessToken({
          access_token: 'token',
          expires_at: timeNow + expiresIn * 1000, // 1hr in the future
          expires_in: expiresIn, // 1hour in seconds
          refresh_token: 'rtoken',
          scope: [''],
          token_type: 'Bearer',
        });

        const a = new OAuth2(OAuthProps, MockHTTPClient({ expectedResponse }, 2600));

        a.addRefreshTokenListener((token) => {
          expect(token).toEqual(expectedResponse);
        });

        await a.refreshAccessToken('x', timeNow);
      });

      test('throws when provided a non function to addRefreshTokenListener', (done) => {
        expect(() => auth.addRefreshTokenListener(null as any)).toThrow('Listener must be a function');
        done();
      });

      test('can get and set credentials', async () => {
        const credentialsOne: OAuth2Credentials = {
          clientID: 'id1',
          clientSecret: 'secret1',
          redirectURL: 'redirect1',
          scope: [OAuth2.Scope.CUSTOMERS_READ],
        };

        const credentialsTwo: OAuth2Credentials = {
          clientID: 'id2',
          clientSecret: 'secret2',
          redirectURL: 'redirect2',
          scope: [OAuth2.Scope.CUSTOMERS_WRITE],
        };

        const auth = new OAuth2(credentialsOne);

        expect(auth.getCredentials()).toEqual(credentialsOne);
        auth.setCredentials(credentialsTwo);
        expect(auth.getCredentials()).toEqual(credentialsTwo);
      });

      test('removes a registered listener', async () => {
        const timeNow = Date.now();
        const expiresIn = 3600;

        const expectedResponse = new AccessToken({
          access_token: 'token',
          expires_at: timeNow + expiresIn * 1000, // 1hr in the future
          expires_in: expiresIn, // 1hour in seconds
          refresh_token: 'rtoken',
          scope: [''],
          token_type: 'Bearer',
        });

        const a = new OAuth2(OAuthProps, MockHTTPClient({ expectedResponse }, 2600));

        const listener = jest.fn((token: AccessToken) => {
          expect(token).toEqual(expectedResponse);
        });

        a.addRefreshTokenListener(listener);
        a.removeRefreshTokenListener(listener);

        await a.refreshAccessToken('x', timeNow);
        expect(listener).not.toHaveBeenCalled();
      });
    });
  });
});
