# DNSimple Node.js Client

A Node.js client for the [DNSimple API v2](https://developer.dnsimple.com/v2/) with TypeScript definitions.

[![Build Status](https://travis-ci.com/dnsimple/dnsimple-node.svg?branch=main)](https://travis-ci.com/dnsimple/dnsimple-node)
[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/standard/semistandard)
[![npm version](https://badge.fury.io/js/dnsimple.svg)](https://badge.fury.io/js/dnsimple)
[![npm downloads](https://img.shields.io/npm/dm/dnsimple.svg)](https://www.npmjs.com/package/dnsimple)

## Requirements

The [dnsimple-node](https://npmjs.org/package/dnsimple-node) package requires Node.js 20 or higher.

You must also have an activated DNSimple account to access the DNSimple API.

## Installation

You can install this package directly from the GitHub repo with `npm install dnsimple/dnsimple-node`.

Alternatively, install the latest stable version from NPM with `npm install dnsimple`.

## Usage

This library is a Node.js client you can use to interact with the [DNSimple API v2](https://developer.dnsimple.com/v2/). TypeScript definitions are provided for all API method parameters and responses.

Note that in all examples below, the `accessToken` must be an OAuth token as described in the [DNSimple API Access Token documentation](https://support.dnsimple.com/articles/api-access-token/).

All client methods that call out to the DNSimple API are async and will return a Promise. The examples below demonstrate basic usage.

```js
const { DNSimple } = require("dnsimple");
// Or use this if you're using TypeScript:
// import { DNSimple } from "dnsimple";

const client = new DNSimple({
  accessToken: process.env.TOKEN,
});

// Fetch your details
const response = await client.identity.whoami();
// All responses have a `data` property if there's response data.
const accountId = response.data.account.id;

// List your domains
const { data: domains1 } = await client.domains.listDomains(accountId);
const { data: domains3 } = await client.domains.listDomains(accountId, { page: 3 });

// Create a domain
const { data: createdDomain } = await client.domains.createDomain(accountId, { name: "example.com" });

// Get a domain
const { data: domain } = await client.domains.getDomain(accountId, "example.com");
```

To be run like this:

```shell
TOKEN=[TOKEN VALUE GOES HERE] node test.js
```

Take a look at [https://github.com/dnsimple/hello-domains-node](https://github.com/dnsimple/hello-domains-node) for an example app that authorizes via OAuth and displays your domain list.

## Configuration

### Sandbox Environment

We highly recommend testing against our [sandbox environment](https://developer.dnsimple.com/sandbox/) before using our production environment. This will allow you to avoid real purchases, live charges on your credit card, and reduce the chance of your running up against rate limits.

The client supports both the production and sandbox environment. To switch to sandbox pass the sandbox API host using the `baseUrl` property when you construct the client:

```javascript
const { DNSimple } = require("dnsimple");
const client = new DNSimple({
  baseUrl: "https://api.sandbox.dnsimple.com",
  accessToken: process.env.TOKEN,
});
```

You will need to ensure that you are using an access token created in the sandbox environment. Production tokens will *not* work in the sandbox environment.

### Setting a custom `User-Agent` header

You customize the `User-Agent` header for the calls made to the DNSimple API:

```javascript
const { DNSimple } = require("dnsimple");
const client = new DNSimple({
  userAgent: "my-app",
  accessToken: process.env.TOKEN,
});
```

The value you provide will be appended to the default `User-Agent` the client uses. For example, if you use `my-app`, the final header value will be `dnsimple-node/x.x.x my-app` (note that it will vary depending on the client version).

## Pagination

There are helper submethods available on API methods that are paginated to assist with fetching items across all pages.

For an API that returns a `paginate` property, you can use either the `iterateAll` or `collectAll` submethods:

- **iterateAll**: return an asynchronous iterator of items that are returned from the API. When the last item on a page is iterated, the next page will be fetched. This continues until there are no more pages.

- **collectAll**: fetch all pages and collect all the items in order into an array.

Examples:

```typescript
// iterateAll
for await (const certificate of client.certificates.listCertificates.iterateAll(1010, "bingo.pizza")) {
  console.log(certificate);
}
// collectAll
const certificates: Array<Certificate> = await client.certificates.listCertificates.collectAll(1010, "bingo.pizza");
console.log(certificates.length);
```

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for details.

## License

Copyright (c) 2016-2026 DNSimple Corporation. This is Free Software distributed under the [MIT License](LICENSE.txt).
