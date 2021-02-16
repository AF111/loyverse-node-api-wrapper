import { AuthMethod } from '../../lib/Auth/BaseAuth';
import { PersonalAccessTokenAuth } from '../../lib/Auth/Providers/PersonalAccessToken';

test('constructs properly', (done) => {
  expect(new PersonalAccessTokenAuth('xxx').authMethod).toBe(AuthMethod.PERSONAL_ACCESS_TOKEN);
  done();
});

test('accepts access token via constructor', async () => {
  const auth = new PersonalAccessTokenAuth('winxp');
  expect(auth.getAccessToken()).toEqual('winxp');
});
