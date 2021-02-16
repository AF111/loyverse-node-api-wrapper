# Loyverse Node.js API Wrapper

🚧🚧🚧 **WARNING: Work in progress (WIP)** 🚧🚧🚧

This is still WIP and not many of the API features are implemented yet.

The API resources are also not testsed.

| Resource      | implemented? | tests |
| ------------- | ------------ | ----- |
| Categories    | ✔️           | ❌    |
| Customers     | ❌           | ❌    |
| Discounts     | ❌           | ❌    |
| Employees     | ❌           | ❌    |
| Inventory     | ✔️           | ❌    |
| Items         | ✔️           | ❌    |
| Merchant      | ❌           | ❌    |
| Modifiers     | ❌           | ❌    |
| Payment types | ❌           | ❌    |
| POS devices   | ❌           | ❌    |
| Receipts      | ❌           | ❌    |
| Shifts        | ❌           | ❌    |
| Stores        | ✔️           | ❌    |
| Suppliers     | ❌           | ❌    |
| Taxes         | ❌           | ❌    |
| Webhooks      | ❌           | ❌    |
| Variants      | ❌           | ❌    |

# Install

```bash
npm install loyverse-api-wrapper
```

# Authentication/Authorization

Loyverse supports two Authorization methods.

## 1. Personal Access tokens

---

Enables you to create an access token that is unrestricted in scope to make authenticated requests against their API.

> The token is unrestricted in scope.

## 2. OAuth 2.0

---

This follows the OAuth 2.0 Authorization Code Flow. There are helper methods to simplify the process.

### Refresh tokens

The client will automatically refresh the access token when it expires.

# Examples

### ES6 import syntax

```js
import { PersonalAccessTokenAuth, Client } from 'loyverse-api-wrapper';
```

### Authentication using Personal Access Tokens

Example explicitly instantiating the PersonalAccessTokenAuth Provider.

```js
const { PersonalAccessTokenAuth, Client } = require('loyverse-api-wrapper"');

const auth = new PersonalAccessTokenAuth('YOUR_ACCESS_TOKEN');
const client = new Client(auth);
```

Let the client instantiate the Auth provider

```js
const { Client } = require('loyverse-api-wrapper"');

// sets up the (PersonalAccessTokenAuth) authorization Provider
const client = new Client('YOUR_ACCESS_TOKEN');
```

---

### Authentication/Authorization using OAuth 2.0

For OAuth2.0 you must explicity instantiate the OAuth2 provider.

```js
const { OAuth2, Client } = require('loyverse-api-wrapper');

const auth = new OAuth2(
  {
    clientID: 'YOUR_CLIENT_ID',
    clientSecret: 'YOUR_CLIENT_SECRET',
    loyverseAPIbaseURL: 'https://api.loyverse.com', // optional
    redirectURL: 'https://www.yoursite.com/api/auth/redirects/loyverse',
    scope: [OAuth2.Scope.ITEMS_READ, OAuth2.Scope.STORES_READ],
  },
  // you can also instantiate with an access token, (optional)
  {
    access_token: 'string',
    expires_in: 'seconds(number)',
    refresh_token: 'string',
    token_type: 'Bearer',
  },
);

// you may update credentials on the fly using auth.setCredentials
// providing the options obj above
// with required fields clientID, clientSecret, redirectURL and scope

const client = new Client(auth);
// At this point, client might not be ready to start interacting with
// loyvers API as you might still need to authenticate the user through loyverse first
```

### Redirecting user to loyverse for authentication

```js
// this method generates the redirect url you need to send the user
// to for authentication.
// You may specificy a unique state value that you can validate
// when the user gets redirected back to your site.

// auth.getAuthURL('SomeUniqueState');
auth.getAuthURL();
```

### Exchanging the authorization code for an access token

```js
// provide the authorization code sent back to your site
// to exchange it for an access token
// this method returns a promise
// and resolves with the scoped access token if successful
auth.authorize('authorization_code');

// if you provided state to the auth.getAuthURL method
// you might want to validate the state to make sure things are in order
```

### Setting the accessToken on the fly

```js
// with OAuth2.0 Provider
auth.setAccessToken({
  access_token: 'xaccess_token',
  expires_in: 1,
  scope: [],
  refresh_token: 'refresh_token',
  expires_at: 33,
  token_type: 'bearer',
});

// with PersonalAccessTokenAuth Provider
// auth.setAccessToken('PersonalAccessToken');
```

---

## Calling the API resources/Enpoints to get data

```js
// client contains all available resources
// client.items.getItem('itemID') // get single item
// client.categories.getCategory('categoryID') // get single Category
```

## Example using OAuth with Express JS

Please have a look in this repo ./examples/express.js

### API documentation: [Loyverse API documentation](https://developer.loyverse.com/docs/)

### For a full list of all available scopes see: [Loyverse OAuth 2.0](https://developer.loyverse.com/docs/#section/Authorization/OAuth-2.0)
