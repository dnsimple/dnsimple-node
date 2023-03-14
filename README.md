# DNSimple Node.JS Client

A Node.JS client for the [DNSimple API v2](https://developer.dnsimple.com/v2/).

[![Build Status](https://travis-ci.com/dnsimple/dnsimple-node.svg?branch=main)](https://travis-ci.com/dnsimple/dnsimple-node)
[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/standard/semistandard)
[![npm version](https://badge.fury.io/js/dnsimple.svg)](https://badge.fury.io/js/dnsimple)
[![npm downloads](https://img.shields.io/npm/dm/dnsimple.svg)](https://www.npmjs.com/package/dnsimple)

## Requirements

The dnsimple-node package requires Node.js 14.0.0 or higher.

You must also have an activated DNSimple account to access the DNSimple API.

## Installation

You can install this package directly from the github repo with `npm install dnsimple/dnsimple-node`.

Alternatively, install the latest stable version from NPM with `npm install dnsimple`.

## Usage

This library is a Node.js client you can use to interact with the [DNSimple API v2](https://developer.dnsimple.com/v2/). TypeScript definitions are provided for all API method signatures and responses.

Note that in all examples below, the `accessToken` must be an OAuth token as described in the [DNSimple API Access Token documentation](https://support.dnsimple.com/articles/api-access-token/).

All client methods that call out to the DNSimple API are async and will return a Promise. The examples below demonstrate basic usage.

```typescript
import { DNSimple } from "dnsimple";
// Or use this if not using TypeScript:
// const { DNSimple } = require("dnsimple");

const client = new DNSimple({
  accessToken: process.env.TOKEN,
});

// Fetch your details
const response = await client.identity.whoami();
const accountId = response.data.account.id;

// List your domains
const { data: domains } = await client.domains.listDomains(accountId);
const { data: domains } = await client.domains.listDomains(accountId, { page: 3 });
for await (const domain of client.domains.listDomains(accountId, { name_like: ".com" }).paginate()) {
  console.log(domain);
}

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

## Sandbox Environment

We highly recommend testing against our [sandbox environment](https://developer.dnsimple.com/sandbox/) before using our production environment. This will allow you to avoid real purchases, live charges on your credit card, and reduce the chance of your running up against rate limits.

The client supports both the production and sandbox environment. To switch to sandbox pass the sandbox API host using the `base_url` option when you construct the client:

```javascript
const { DNSimple } = require("dnsimple");
const client = new DNSimple({
  baseUrl: "https://api.sandbox.dnsimple.com",
  accessToken: process.env.TOKEN,
});
```

You will need to ensure that you are using an access token created in the sandbox environment. Production tokens will *not* work in the sandbox environment.

## Setting a custom `User-Agent` header

You customize the `User-Agent` header for the calls made to the DNSimple API:

```javascript
var client = require("dnsimple")({
  userAgent: "my-app",
  accessToken: process.env.TOKEN,
});
```

## License

Copyright (c) 2016-2022 DNSimple Corporation. This is Free Software distributed under the MIT license.
