# DNSimple Node.JS Client

A Node.JS client for the [DNSimple API v2](https://developer.dnsimple.com/v2/).

[![Build Status](https://travis-ci.org/dnsimple/dnsimple-node.svg)](https://travis-ci.org/dnsimple/dnsimple-node)


## Requirements

The dnsimple-node package requires node 8.0.0 or higher.

You must also have an activated DNSimple account to access the DNSimple API.

## Installation

You can install this package directly from the github repo with `npm install dnsimple/dnsimple-node`.

Alternatively, install the latest stable version from NPM with `npm install dnsimple`.

## Usage

This library is a nodejs client you can use to interact with the [DNSimple API v2](https://developer.dnsimple.com/v2/).

Note that in all examples below, the `accessToken` must be an OAuth token as described in the [DNSimple API Access Token documentation](https://support.dnsimple.com/articles/api-access-token/). 

The DNSimple nodejs library uses promises exclusively, thus all client calls that call out to the DNSimple API will return a Promise. The examples below demonstrate basic usage.

```javascript
"use strict";

var client = require("dnsimple")({
  accessToken: process.env.TOKEN,
});

// Fetch your details
client.identity.whoami().then(function(response) {
  console.log(response.data);
}, function(error) {
  console.log(error);
});

// List your domains
var accountId = "1010";
client.domains.listDomains(accountId).then(function(response) {
  console.log(response.data);
}, function(error) {
  console.log(error);
});

client.domains.listDomains(accountId, { page: 3 }).then(function(response) {
  console.log(response.data);
}, function(error) {
  console.log(error);
});

// Create a domain
client.domains.createDomain(accountId, { name: "example.com" }).then(function(response) {
  console.log(response.data);
}, function(error) {
  console.log(error);
});

// Get a domain
client.domains.getDomain(accountId, "example.com").then(function(response) {
  console.log(response.data);
}, function(error) {
  console.log(error);
});
```

To be run like this:

```shell
$ TOKEN=[TOKEN VALUE GOES HERE] node test.js
```

Take a look at [https://github.com/dnsimple/hello-domains-node](https://github.com/dnsimple/hello-domains-node) for an example app that authorizes via OAuth and displays your domain list.

## Sandbox Environment

We highly recommend testing against our [sandbox environment](https://developer.dnsimple.com/sandbox/) before using our production environment. This will allow you to avoid real purchases, live charges on your credit card, and reduce the chance of your running up against rate limits.

The client supports both the production and sandbox environment. To switch to sandbox pass the sandbox API host using the `base_url` option when you construct the client:

```javascript
var client = require('dnsimple')({
  baseUrl: 'https://api.sandbox.dnsimple.com',
  accessToken: process.env.TOKEN,
});
```

You will need to ensure that you are using an access token created in the sandbox environment. Production tokens will *not* work in the sandbox environment.


## Setting a custom `User-Agent` header

You customize the `User-Agent` header for the calls made to the DNSimple API:

```javascript
var client = require('dnsimple')({
  user_agent: 'my-app',
  accessToken: process.env.TOKEN,
});
```

The value you provide will be appended to the default `User-Agent` the client uses. For example, if you use `my-app`, the final header value will be `dnsimple-node/x.x.x my-app` (note that it will vary depending on the client version).


## License

Copyright (c) 2016-2020 DNSimple Corporation. This is Free Software distributed under the MIT license.
