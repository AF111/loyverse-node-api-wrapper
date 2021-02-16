import { AccessToken } from '../lib/Auth/AccessToken';

describe('AccessToken tests', () => {
  test('accepts token via constructor', (done) => {
    const token = {
      access_token: 'x',
      expires_at: 1,
      expires_in: 2,
      refresh_token: 'y',
      scope: ['PL'],
      token_type: 'B',
    };

    expect(new AccessToken(token)).toEqual(token);
    done();
  });

  test('works without providing token to constructor', (done) => {
    const token = {
      access_token: '',
      expires_at: -1,
      expires_in: -1,
      refresh_token: '',
      scope: [],
      token_type: 'Bearer',
    };

    expect(new AccessToken()).toEqual(token);
    done();
  });

  test('correctly parses scope as an array if constructed with scope as a string', (done) => {
    const token = {
      access_token: '',
      expires_at: -1,
      expires_in: -1,
      refresh_token: '',
      scope: 'READ_ALL',
      token_type: 'Bearer',
    };

    expect(new AccessToken(token as any)).toEqual({ ...token, scope: ['READ_ALL'] });
    done();
  });
});
