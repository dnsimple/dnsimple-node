# Node JS DNSimple API Wrapper

A node client for the [DNSimple API v2](https://developer.dnsimple.com/v2/).

[DNSimple](https://dnsimple.com/) provides DNS hosting and domain registration that is simple and friendly.
We provide a full API and an easy-to-use web interface so you can get your domain registered and set up with a minimal amount of effort.


## :warning: Beta Warning

This library is currently in beta version, the methods and the implementation should be considered a work-in-progress. Changes in the method naming, method signatures, public or internal APIs may happen during the beta period.

## Installation

There are no dependencies to install.

## Usage

This library is a nodejs client you can use to interact with the [DNSimple API v2](https://developer.dnsimple.com/v2/). Here are some examples.

:warning: Note: This library is currently not exposed in NPM. To make them work you must create a `node_modules` directory in your home directory and soft link from there to the directory where you checked out the `dnsimple-node` repository. Example: `ln -s /Users/you/development/aeden/dnsimple-node /Users/you/node_modules/dnsimple`.

```javascript
var client = require('dnsimple')({
  accessToken: process.env.TOKEN,
});

// Fetch your details
client.identity.whoami({}, function(error, response) {
  console.log(response.data);
});

// List your domains
var accountId = '1010';
client.domains.listDomains(accountId, {}, function(error, response) {
  console.log(response.data);
});

client.domains.listDomains(accountId, {page: 3}, function(error, response) {
  console.log(response.data);
});

// Create a domain
client.domains.createDomain(accountId, "example.com", {}, function(error, response) {
  console.log(response.data);
});

// Get a domain
client.domains.domain(accountId, "example.com", {}, function(error, response) {
  console.log(response.data);
});
```

## Sandbox Usage

If you would like to test in the [DNSimple sandbox environment](https://developer.dnsimple.com/sandbox/) then pass the 'baseUrl' option when creating the client:

```javascript
var client = require('dnsimple')({
  baseUrl: 'https://api.sandbox.dnsimple.com',
  accessToken: process.env.TOKEN,
});
```

You will need to ensure you are using an access token created in the sandbox environment. Production tokens will *not* work in the sandbox environment.
