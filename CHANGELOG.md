# Changelog

## main

- CHANGED: Bump semistandard from 14.2.2 to 14.2.3
- CHANGED: Bump lodash from 4.17.15 to 4.17.20
- CHANGED: Bump nock from 13.0.0 to 13.0.4
- CHANGED: Bump mocha from 8.0.1 to 8.1.3

## 4.2.1 - 2020-06-29

- CHANGED: Bump semistandard from 14.2.0 to 14.2.2
- CHANGED: Bump nock from 12.0.3 to 13.0.0

## 4.2.0 - 2020-06-22

- CHANGED: Bump mocha from 7.1.2 to 8.0.1
- CHANGED: Bump js-yaml from 3.13.1 to 3.14.0
- CHANGED: Domain object deprecates `expires_on` attribute in favor of `expires_at`. (dnsimple/dnsimple-node#43)
- CHANGED: Certificate object deprecates `expires_on` attribute in favor of `expires_at`. (dnsimple/dnsimple-node#45)

## 4.1.0 - 2020-05-18

- NEW: Adds NodeJS v14 to Travis build
- NEW: Added `registrar.getDomainTransfer` to retrieve a domain transfer. (dnsimple/dnsimple-node#40)
- NEW: Added `registrar.cancelDomainTransfer` to cancel an in progress domain transfer. (dnsimple/dnsimple-node#40)
- CHANGED: Bump mocha from 7.1.1 to 7.1.2

## 4.0.0 - 2020-03-19

- NEW: Adds NodeJS v13 to Travis build
- CHANGED: Deprecates support for NodeJS v8
- CHANGED: Deprecates JSCS usage. Implements https://www.npmjs.com/package/semistandard
- CHANGED: Simplifies testing instructions
- CHANGED: Bump lodash from 4.17.14 to 4.17.15
- CHANGED: Bump chai from 4.1.2 to 4.2.0
- CHANGED: Bump mocha from 5.2.0 to 7.1.1
- CHANGED: Bump nock from 9.3.2 to 12.0.3
- FIX: Fixes typo in test helper
- FIX: Fixes bad Certificates endpoint specs

## 3.0.3 - 2020-02-27

- CHANGED: Default timeout is now hard-coded to ensure compatibility with Node.js 13. (GH-25) @jonchurch

## 3.0.2 - 2020-02-11

- CHANGED: User-agent format has been changed to prepend custom token before default token.

## 3.0.1 - 2019-07-29

- CHANGED: Dropped dependency on `npm`

## 3.0.0 - 2019-07-18

- NEW: Updates to support Node v8. Node v6 is deprecated.

## 2.9.0 - 2019-02-01

- NEW: Added WHOIS privacy renewal (GH-17)

## 2.8.0 - 2018-10-16

- NEW: Added zone distribution and zone record distribution (GH-16)

## 2.7.0 - 2018-01-28

- NEW: Added Let's Encrypt certificate methods (GH-14)

- CHANGED: Updated registrar URLs (GH-12)
