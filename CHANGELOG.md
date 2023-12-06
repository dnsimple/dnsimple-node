# Changelog

## main

## 7.3.0

FEATURES:

- NEW: Added `Billing.listCharges` to retrieve the list of billing charges for an account. (#189)

## 7.2.0

FEATURES:

- NEW: Added `listRegistrantChanges`, `createRegistrantChange`, `checkRegistrantChange`, `getRegistrantChange`, and `deleteRegistrantChange` APIs to manage registrant changes. (dnsimple/dnsimple-node#181)
- NEW: Added `getDomainTransferLock`, `enableDomainTransferLock`, `disableDomainTransferLock` APIs to manage domain transfer locks. (dnsimple/dnsimple-node#183)

## 7.1.1

FEATURES:

- NEW: Added `Zones.activateDns` to activate DNS services (resolution) for a zone. (dnsimple/dnsimple-node#180)
- NEW: Added `Zones.deactivateDns` to deactivate DNS services (resolution) for a zone. (dnsimple/dnsimple-node#180)

## 7.1.0

FEATURES

- Most TypeScript types have been named and exported, instead of being inline anonymous types that are hard to reference and use. (dnsimple/dnsimple-node#175)
- Enum type values are now declared, instead of a generic `string` or `number`, allowing for better type checking and autocomplete. (dnsimple/dnsimple-node#175)

NOTES

- As enums are now typed, incorrect or unknown values will be rejected by the TypeScript type checker. Instead of strings, the types are unions of valid constant string values. `as const` can be used to make TypeScript infer a literal string as a constant string type.

## 7.0.0

This is a major change that brings TypeScript support as well as many quality-of-life improvements and internal improvements. For details on important changes and how to migrate, see [UPGRADE.md](./UPGRADE.md). For the full breakdown of all changes in detail, see the PR (dnsimple/dnsimple-node#170). Here are the major noteworthy changes:

- All method parameters and return types are now typed by TypeScript. This means that usages can be checked and bugs can be detected before runtime, and text editors and IDEs can now provide automatic completions and hints on all of DNSimple's APIs easily and accurately.

- Request errors are now full JS classes that allow more type-safe and ergonomic error handling.

- The client has no dependencies on Node.js libraries and can also run in the browser, which we will work towards creating builds for in the future. The HTTP requester is now abstract and varies depending on the platform (browser or Node.js), and can also be replaced with custom logic, such as other libraries, retry strategies, intercepting and mutating, or logging and tracing.

- All paginated API methods have helper submethods that provide an async iterator or array of all items across all pages effortlessly, transparently fetching each page request in the background. Use the new async iterator method for efficient retrieval that doesn't make requests until necessary, or use the array method to quickly fetch all values into a familar Array object with its methods. Both are also fully typed by TypeScript.

- All exports are now named and written in ESM syntax, which allows for future migration to the new standard that has better browser and tooling support. The output JS still uses CommonJS syntax for compatibility with most of today's programs (including Node.js and Webpack).

Not all changes have been listed here. For more details, view the PR (dnsimple/dnsimple-node#170) and [UPGRADE.md](./UPGRADE.md).

## 6.2.0

- NEW: Add support for getDomainRegistration and getDomainRenewal Registrar APIs (dnsimple/dnsimple-node#169)
- CHANGED: Bump dependency version

## 6.1.0

- CHANGED: Add getter for attribute errors in `error` object (dnsimple/dnsimple-node#150)
- CHANGED: Deprecate Certificate's `contact_id` (dnsimple/dnsimple-node#133)

## 6.0.0

- NEW: Adds NodeJS v18 to Travis build
- CHANGED: Deprecates support for NodeJS v12 (EOL)

## 5.1.1

- CHANGED: Bump dependency versions

## 5.1.0

- CHANGED: Updated DNSSEC-related test to reflect DS record key-data interface. (dnsimple/dnsimple-node#110)

## 5.0.0

- NEW: Adds NodeJS v16 to Travis build
- NEW: Adds NodeJS node (latest) to Travis build
- CHANGED: Moves lockfileVersion to v2
- CHANGED: Deprecates support for NodeJS v10 (EOL)
- CHANGED: Deprecates `registrar.getDomainPremiumPrice` in favour of `registrar.getDomainPrices`

## 4.4.0

- NEW: Added `registrar.getDomainPrices` to retrieve whether a domain is premium and the prices to register, transfer, and renew. (dnsimple/dnsimple-node#88)
- REMOVED: Drop the inexistent `domains.resetDomainToken` method (dnsimple-node#89)

## 4.3.0

- NEW: Adds NodeJS v15 to Travis build
- CHANGED: Removes NodeJS v13 from Travis build

## 4.2.1

- CHANGED: Bump semistandard from 14.2.0 to 14.2.2
- CHANGED: Bump nock from 12.0.3 to 13.0.0

## 4.2.0

- CHANGED: Bump mocha from 7.1.2 to 8.0.1
- CHANGED: Bump js-yaml from 3.13.1 to 3.14.0
- CHANGED: Domain object deprecates `expires_on` attribute in favor of `expires_at`. (dnsimple/dnsimple-node#43)
- CHANGED: Certificate object deprecates `expires_on` attribute in favor of `expires_at`. (dnsimple/dnsimple-node#45)

## 4.1.0

- NEW: Adds NodeJS v14 to Travis build
- NEW: Added `registrar.getDomainTransfer` to retrieve a domain transfer. (dnsimple/dnsimple-node#40)
- NEW: Added `registrar.cancelDomainTransfer` to cancel an in progress domain transfer. (dnsimple/dnsimple-node#40)
- CHANGED: Bump mocha from 7.1.1 to 7.1.2

## 4.0.0

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

## 3.0.3

- CHANGED: Default timeout is now hard-coded to ensure compatibility with Node.js 13. (GH-25) @jonchurch

## 3.0.2

- CHANGED: User-agent format has been changed to prepend custom token before default token.

## 3.0.1

- CHANGED: Dropped dependency on `npm`

## 3.0.0

- NEW: Updates to support Node v8. Node v6 is deprecated.

## 2.9.0

- NEW: Added WHOIS privacy renewal (GH-17)

## 2.8.0

- NEW: Added zone distribution and zone record distribution (GH-16)

## 2.7.0

- NEW: Added Let's Encrypt certificate methods (GH-14)

- CHANGED: Updated registrar URLs (GH-12)
