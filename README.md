# DNSimple Node.JS Client

A Node.JS client for the [DNSimple API v2](https://developer.dnsimple.com/v2/).

[![Build Status](https://travis-ci.org/dnsimple/dnsimple-node.svg)](https://travis-ci.org/dnsimple/dnsimple-go)


## Requirements

The dnsimple-node package requires node 6.0.0 or higher.

You must also have an activated DNSimple account to access the DNSimple API.

## Installation

You can install this package directly from the github repo with `npm install dnsimple/dnsimple-node`.

Alternatively, install the latest stable version from NPM with `npm install dnsimple`.

## Usage

This library is a nodejs client you can use to interact with the [DNSimple API v2](https://developer.dnsimple.com/v2/).

The DNSimple nodejs library uses promises exclusively, thus all client calls that call out to the DNSimple API will return a Promise. The examples below demonstrate basic usage.

```javascript
var client = require('dnsimple')({
  accessToken: process.env.TOKEN,
});

// Fetch your details
client.identity.whoami().then(function(response) {
  console.log(response.data);
}, function(error) {
  console.log(error);
});

// List your domains
var accountId = '1010';
client.domains.listDomains(accountId).then(function(response) {
  console.log(response.data);
}, function(error) {
  console.log(error);
});

client.domains.listDomains(accountId, {page: 3}).then(function(response) {
  console.log(response.data);
}, function(error) {
  console.log(error);
});

// Create a domain
client.domains.createDomain(accountId, "example.com").then(function(response) {
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

Take a look at [https://github.com/dnsimple/hello-domains-node](https://github.com/dnsimple/hello-domains-node) for an example app that authorizes via OAuth and displays your domain list.

## Sandbox Usage

If you would like to test in the [DNSimple sandbox environment](https://developer.dnsimple.com/sandbox/) then pass the 'baseUrl' option when creating the client:

```javascript
var client = require('dnsimple')({
  baseUrl: 'https://api.sandbox.dnsimple.com',
  accessToken: process.env.TOKEN,
});
```

You will need to ensure you are using an access token created in the sandbox environment. Production tokens will *not* work in the sandbox environment.
