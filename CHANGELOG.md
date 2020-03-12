# Changelog

## master

- NEW: Adds NodeJS v13 to Travis build
- CHANGED: Simplifies testing instructions
- CHANGED: Bump lodash from 4.17.14 to 4.17.15
- CHANGED: Bump chai from 4.1.2 to 4.2.0
- CHANGED: Bump mocha from 5.2.0 to 7.1.0
- CHANGED: Bump nock from 9.3.2 to 12.0.2
- FIX: Fixes typo in test helper

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
