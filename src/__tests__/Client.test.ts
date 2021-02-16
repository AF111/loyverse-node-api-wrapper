import { AuthMethod } from '../lib/Auth/BaseAuth';
import { OAuth2 } from '../lib/Auth/Providers/OAuth2.0';
import { PersonalAccessTokenAuth } from '../lib/Auth/Providers/PersonalAccessToken';
import { Client } from '../lib/Client';
import mockHTTPClient from '../__mocks__/got';

describe('test client', () => {
  const mockClient = mockHTTPClient({});

  test('works with an instance of OAuth2.0', (done) => {
    const auth = new OAuth2({ clientID: '', clientSecret: '', redirectURL: '', scope: [] });
    expect(new Client(auth, mockClient).authMethod).toBe(AuthMethod.OAUTH);
    done();
  });

  test('works with an instance of PersonalAccessTokenAuth', (done) => {
    const auth = new PersonalAccessTokenAuth('AccessToken');
    expect(new Client(auth, mockClient).authMethod).toBe(AuthMethod.PERSONAL_ACCESS_TOKEN);
    done();
  });

  test('client implicitly instantiates PersonalAccessTokenAuth when provided a string', (done) => {
    expect(new Client('AccessToken', mockClient).authMethod).toBe(AuthMethod.PERSONAL_ACCESS_TOKEN);
    done();
  });

  test('mutates debug state', (done) => {
    const client = new Client('AccessToken', mockClient);
    expect(client.debug(true)).toEqual(true);
    done();
  });

  test('gets debug status without mutating debug state', (done) => {
    const client = new Client('AccessToken', mockClient);
    expect(client.debug()).toEqual(false);
    done();
  });
});
