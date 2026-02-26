# Changelog

This project uses [Semantic Versioning 2.0.0](http://semver.org/), the format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## 12.1.0 - 2026-02-26

### Added

- Added `getDomainResearchStatus` to research a domain for availability and registration status. (#272)

## 12.0.0 - 2026-01-26

### Added

- Add rate limit information to all API responses via `rateLimit` property, exposing `limit`, `remaining`, and `reset` values from response headers

### Changed

- `ZoneRecord.type`, `TemplateRecord.type`, and `createZoneRecord` type parameter changed from enum to `string`

### Removed

- Removed deprecated `getDomainPremiumPrice`. Use `getDomainPrices` instead. (dnsimple/dnsimple-developer#916)
- Removed `ZoneRecordType` and `TemplateRecordType` type enumerations
- Removed deprecated `getWhoisPrivacy` (dnsimple/dnsimple-developer#919)
- Removed deprecated `renewWhoisPrivacy` (dnsimple/dnsimple-developer#919)

## 11.0.0 - 2025-08-20

### Changed

- Add active attribute to Email Forward
- Update dependencies

### Removed

- **Breaking:** Remove from and to from Email Forward

## 10.0.0 - 2025-05-09

### Changed

- **Breaking:** Upgrade NodeJS runtime requirements to Node JS 20 or higher
- Update dependencies

### Added

- Add support for node 24.x

### Removed

- **Breaking:** Remove `DomainCollaborators`. Please use our Domain Access Control feature.
- **Breaking:** Drop support for node 18.x

## 9.0.0 - 2024-12-12

### Changed

- Deprecate `DomainCollaborators`. Will be removed in the next major version. Please use our Domain Access Control feature.
- Update dependencies

### Added

- Add support for node 22.x

## 8.1.0 - 2024-10-11

### Changed

- Make the built-in `Fetcher` default instance for the `DNSimple` class constructor more robust to cover more scenarios where `fetch` might be present. Now it also throws an actionable user error when no built-in `Fetcher` instance can be produced so that end-users can provide an implementation through the constructor's `fetcher` parameter.
- Update development stack, including a migration of the test suite to Jest and `fetchMock`

## 8.0.0 - 2024-03-08

### Changed

- **Breaking:** Upgrade NodeJS runtime requirements to Node JS 18 or higher

## 7.4.0 - 2023-12-12

### Added

- Add `secondary`, `last_transferred_at`, `active` to `Zone` (#196)

## 7.3.0 - 2023-12-06

### Added

- Add `Billing.listCharges` to retrieve the list of billing charges for an account (#189)

## 7.2.0 - 2023-09-07

### Added

- Add `listRegistrantChanges`, `createRegistrantChange`, `checkRegistrantChange`, `getRegistrantChange`, and `deleteRegistrantChange` APIs to manage registrant changes (#181)
- Add `getDomainTransferLock`, `enableDomainTransferLock`, `disableDomainTransferLock` APIs to manage domain transfer locks (#183)

## 7.1.1 - 2023-08-10

### Added

- Add `Zones.activateDns` to activate DNS services (resolution) for a zone (#180)
- Add `Zones.deactivateDns` to deactivate DNS services (resolution) for a zone (#180)

## 7.1.0 - 2023-03-30

### Changed

- Name and export most TypeScript types, instead of using inline anonymous types that are hard to reference and use (#175)
- Declare enum type values, instead of a generic `string` or `number`, allowing for better type checking and autocomplete (#175)

As enums are now typed, incorrect or unknown values will be rejected by the TypeScript type checker. Instead of strings, the types are unions of valid constant string values. `as const` can be used to make TypeScript infer a literal string as a constant string type.

## 7.0.0 - 2023-03-21

This is a major change that brings TypeScript support as well as many quality-of-life improvements and internal improvements. For details on important changes and how to migrate, see [UPGRADE.md](./UPGRADE.md). For the full breakdown of all changes in detail, see the PR (#170).

### Changed

- **Breaking:** Type all method parameters and return types with TypeScript. Usages can be checked and bugs can be detected before runtime, and text editors and IDEs can now provide automatic completions and hints on all of DNSimple's APIs easily and accurately.
- **Breaking:** Make request errors full JS classes that allow more type-safe and ergonomic error handling.
- **Breaking:** Make all exports named and written in ESM syntax, which allows for future migration to the new standard that has better browser and tooling support. The output JS still uses CommonJS syntax for compatibility with most of today's programs (including Node.js and Webpack).
- Remove dependencies on Node.js libraries. The client can also run in the browser. The HTTP requester is now abstract and varies depending on the platform (browser or Node.js), and can also be replaced with custom logic, such as other libraries, retry strategies, intercepting and mutating, or logging and tracing.

### Added

- Add helper submethods to all paginated API methods that provide an async iterator or array of all items across all pages effortlessly, transparently fetching each page request in the background

## 6.2.0 - 2023-03-03

### Changed

- Bump dependency version

### Added

- Add support for getDomainRegistration and getDomainRenewal Registrar APIs (#169)

## 6.1.0 - 2022-09-20

### Changed

- Add getter for attribute errors in `error` object (#150)
- Deprecate Certificate's `contact_id` (#133)

## 6.0.0 - 2022-05-04

### Changed

- **Breaking:** Deprecate support for NodeJS v12 (EOL)

### Added

- Add NodeJS v18 to Travis build

## 5.1.1 - 2022-01-20

### Changed

- Bump dependency versions

## 5.1.0 - 2021-11-29

### Changed

- Update DNSSEC-related test to reflect DS record key-data interface (#110)

## 5.0.0 - 2021-06-07

### Changed

- **Breaking:** Deprecate support for NodeJS v10 (EOL)
- Move lockfileVersion to v2
- Deprecate `registrar.getDomainPremiumPrice` in favour of `registrar.getDomainPrices`

### Added

- Add NodeJS v16 to Travis build
- Add NodeJS node (latest) to Travis build

## 4.4.0 - 2021-04-22

### Added

- Add `registrar.getDomainPrices` to retrieve whether a domain is premium and the prices to register, transfer, and renew (#88)

### Removed

- Drop the inexistent `domains.resetDomainToken` method (#89)

## 4.3.0 - 2020-11-20

### Changed

- Remove NodeJS v13 from Travis build

### Added

- Add NodeJS v15 to Travis build

## 4.2.1 - 2020-06-29

### Changed

- Bump semistandard from 14.2.0 to 14.2.2
- Bump nock from 12.0.3 to 13.0.0

## 4.2.0 - 2020-06-22

### Changed

- Bump mocha from 7.1.2 to 8.0.1
- Bump js-yaml from 3.13.1 to 3.14.0
- Deprecate Domain object `expires_on` attribute in favor of `expires_at` (#43)
- Deprecate Certificate object `expires_on` attribute in favor of `expires_at` (#45)

## 4.1.0 - 2020-05-18

### Changed

- Bump mocha from 7.1.1 to 7.1.2

### Added

- Add NodeJS v14 to Travis build
- Add `registrar.getDomainTransfer` to retrieve a domain transfer (#40)
- Add `registrar.cancelDomainTransfer` to cancel an in progress domain transfer (#40)

## 4.0.0 - 2020-03-19

### Changed

- **Breaking:** Deprecate support for NodeJS v8
- Deprecate JSCS usage. Implement [semistandard](https://www.npmjs.com/package/semistandard)
- Simplify testing instructions
- Bump lodash from 4.17.14 to 4.17.15
- Bump chai from 4.1.2 to 4.2.0
- Bump mocha from 5.2.0 to 7.1.1
- Bump nock from 9.3.2 to 12.0.3

### Added

- Add NodeJS v13 to Travis build

### Fixed

- Fix typo in test helper
- Fix bad Certificates endpoint specs

## 3.0.3 - 2020-02-27

### Changed

- Hard-code default timeout to ensure compatibility with Node.js 13 (GH-25)

## 3.0.2 - 2020-02-11

### Changed

- Change user-agent format to prepend custom token before default token

## 3.0.1 - 2019-07-29

### Changed

- Drop dependency on `npm`

## 3.0.0 - 2019-07-18

### Changed

- **Breaking:** Deprecate Node v6

### Added

- Add support for Node v8

## 2.9.0 - 2019-02-01

### Added

- Add WHOIS privacy renewal (GH-17)

## 2.8.0 - 2018-10-16

### Added

- Add zone distribution and zone record distribution (GH-16)

## 2.7.0 - 2018-01-28

### Changed

- Update registrar URLs (GH-12)

### Added

- Add Let's Encrypt certificate methods (GH-14)
