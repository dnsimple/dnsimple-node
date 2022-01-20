# Changelog

## main

## Release 5.1.1

- CHANGED: Bump dependency versions

## Release 5.1.0

- CHANGED: Updated DNSSEC-related test to reflect DS record key-data interface. (dnsimple/dnsimple-node#110)

## Release 5.0.0

- NEW: Adds NodeJS v16 to Travis build
- NEW: Adds NodeJS node (latest) to Travis build
- CHANGED: Moves lockfileVersion to v2
- CHANGED: Deprecates support for NodeJS v10 (EOL)
- CHANGED: Deprecates `registrar.getDomainPremiumPrice` in favour of `registrar.getDomainPrices`

## Release 4.4.0

- NEW: Added `registrar.getDomainPrices` to retrieve whether a domain is premium and the prices to register, transfer, and renew. (dnsimple/dnsimple-node#88)
- REMOVED: Drop the inexistent `domains.resetDomainToken` method (dnsimple-node#89)

## Release 4.3.0

- NEW: Adds NodeJS v15 to Travis build
- CHANGED: Removes NodeJS v13 from Travis build

## Release 4.2.1

- CHANGED: Bump semistandard from 14.2.0 to 14.2.2
- CHANGED: Bump nock from 12.0.3 to 13.0.0

## Release 4.2.0

- CHANGED: Bump mocha from 7.1.2 to 8.0.1
- CHANGED: Bump js-yaml from 3.13.1 to 3.14.0
- CHANGED: Domain object deprecates `expires_on` attribute in favor of `expires_at`. (dnsimple/dnsimple-node#43)
- CHANGED: Certificate object deprecates `expires_on` attribute in favor of `expires_at`. (dnsimple/dnsimple-node#45)

## Release 4.1.0

- NEW: Adds NodeJS v14 to Travis build
- NEW: Added `registrar.getDomainTransfer` to retrieve a domain transfer. (dnsimple/dnsimple-node#40)
- NEW: Added `registrar.cancelDomainTransfer` to cancel an in progress domain transfer. (dnsimple/dnsimple-node#40)
- CHANGED: Bump mocha from 7.1.1 to 7.1.2

## Release 4.0.0

- NEW: Adds NodeJS v13 to Travis build
- CHANGED: Deprecates support for NodeJS v8
- CHANGED: Deprecates JSCS usage. Implements [https://www.npmjs.com/package/semistandard](https://www.npmjs.com/package/semistandard)
- CHANGED: Simplifies testing instructions
- CHANGED: Bump lodash from 4.17.14 to 4.17.15
- CHANGED: Bump chai from 4.1.2 to 4.2.0
- CHANGED: Bump mocha from 5.2.0 to 7.1.1
- CHANGED: Bump nock from 9.3.2 to 12.0.3
- FIX: Fixes typo in test helper
- FIX: Fixes bad Certificates endpoint specs

## Release 3.0.3

- CHANGED: Default timeout is now hard-coded to ensure compatibility with Node.js 13. (GH-25) @jonchurch

## Release 3.0.2

- CHANGED: User-agent format has been changed to prepend custom token before default token.

## Release 3.0.1

- CHANGED: Dropped dependency on `npm`

## Release 3.0.0

- NEW: Updates to support Node v8. Node v6 is deprecated.

## Release 2.9.0

- NEW: Added WHOIS privacy renewal (GH-17)

## Release 2.8.0

- NEW: Added zone distribution and zone record distribution (GH-16)

## Release 2.7.0

- NEW: Added Let's Encrypt certificate methods (GH-14)

- CHANGED: Updated registrar URLs (GH-12)
