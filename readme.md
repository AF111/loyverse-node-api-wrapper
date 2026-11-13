# Loyverse Node.js API Wrapper

[![CI](https://github.com/AF111/loyverse-node-api-wrapper/actions/workflows/ci.yml/badge.svg)](https://github.com/AF111/loyverse-node-api-wrapper/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/loyverse-api-wrapper)](https://www.npmjs.com/package/loyverse-api-wrapper)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A TypeScript Node.js client for the [Loyverse REST API](https://developer.loyverse.com/docs/). It provides authentication helpers, a shared HTTP client, typed resource access and pagination-friendly responses.

> API coverage follows the official Loyverse API. Availability of endpoints and fields is governed by your Loyverse account permissions and API scopes.

## Requirements

- Node.js 18 or newer
- A Loyverse Personal Access Token or OAuth 2.0 application

## Installation

```bash
npm install loyverse-api-wrapper
```

## Quick start

```ts
import { Client } from 'loyverse-api-wrapper';

const client = new Client(process.env.LOYVERSE_ACCESS_TOKEN!);
const { items = [] } = await client.items.getItems({ limit: 50 });
console.log(items);
```

The constructor accepts either a token string or an authentication provider instance.

## Authentication

### Personal access token

```ts
import { Client, PersonalAccessTokenAuth } from 'loyverse-api-wrapper';

const auth = new PersonalAccessTokenAuth(process.env.LOYVERSE_ACCESS_TOKEN);
const client = new Client(auth);
```

### OAuth 2.0

```ts
import { Client, OAuth2 } from 'loyverse-api-wrapper';

const auth = new OAuth2({
  clientID: process.env.LOYVERSE_CLIENT_ID!,
  clientSecret: process.env.LOYVERSE_CLIENT_SECRET!,
  redirectURL: 'https://example.com/oauth/loyverse/callback',
  scope: [OAuth2.Scope.ITEMS_READ, OAuth2.Scope.STORES_READ],
});

const authorizationUrl = auth.getAuthURL('csrf-state');
// Redirect the merchant to authorizationUrl and validate state on callback.
const token = await auth.authorize(authorizationCode);
const client = new Client(auth);
```

OAuth access-token refresh is handled by the client when the API responds with an authentication failure and a refresh token is available. Store tokens securely; never commit credentials.

## Resource coverage

The client exposes the following resource groups:

| Resource | Methods |
| --- | --- |
| Items | List, get, create, delete, upload/download/delete image |
| Categories | List, get, create/update, delete |
| Inventory | List levels, batch update levels |
| Stores | List, get |
| Variants | List, get |
| Customers | List, get, create/update, delete |
| Discounts | List, get, create/update, delete |
| Employees | List, get |
| Merchant | Get merchant |
| Modifiers | List, get, create/update, delete |
| Payment types | List, get |
| POS devices | List, get, create/update, delete |
| Receipts | List, get, create, refund |
| Shifts | List, get |
| Suppliers | List, get, create/update, delete |
| Taxes | List, get, create/update, delete |
| Webhooks | List, get, create |

Some Loyverse endpoints are read-only or expose only the operations supported by the official API. Check the linked API reference for required scopes, payload schemas and endpoint constraints.

## Pagination and filters

List methods accept endpoint-specific filters and pagination options such as `limit` and `cursor`. Loyverse uses cursor-based pagination. Pass the returned cursor to the next request:

```ts
const firstPage = await client.items.getItems({ limit: 100 });
if (firstPage.cursor) {
  const nextPage = await client.items.getItems({ limit: 100, cursor: firstPage.cursor });
}
```

Array filters are serialized as comma-separated IDs. Input option objects are not modified.

## Errors

Requests reject with the underlying Got HTTP errors for transport and HTTP failures. Loyverse API error payloads are represented by `LoyverseAPIError`, which exposes `errors` and `statusCode`.

```ts
import { LoyverseAPIError } from 'loyverse-api-wrapper';

try {
  await client.items.getItems();
} catch (error) {
  if (error instanceof LoyverseAPIError) {
    console.error(error.statusCode, error.errors);
  }
  throw error;
}
```

## Development

```bash
npm install
npm test -- --runInBand
npm run build
```

Tests use Jest and mock the HTTP client; they do not require live Loyverse credentials.

### Changelog and versioning

Use [Conventional Commits](https://www.conventionalcommits.org/) (for example, `feat:`, `fix:`, `docs:`, `test:`). Generate or update the changelog with:

```bash
npm run changelog
```

Update the package version using npm's SemVer commands (`npm version patch|minor|major`) when preparing a release. Changelog generation does not publish the package or create a GitHub release.

### GitHub Actions

- **CI** runs the build and test suite on Node.js 18, 20 and 22.
- **npm Publish (manual)** is a manually dispatched workflow. It requires the explicit input `PUBLISH` and an `NPM_TOKEN` repository secret. It is not triggered by pushes, tags or releases and has not been run as part of this work.

## API reference

- [Loyverse API documentation](https://developer.loyverse.com/docs/)
- [Loyverse OAuth 2.0 documentation](https://developer.loyverse.com/docs/#section/Authorization/OAuth-2.0)

## License

MIT
