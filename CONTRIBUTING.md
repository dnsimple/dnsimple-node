# Contributing to DNSimple/node

## Getting started

#### 1. Clone the repository

Clone the repository and move into it:

```shell
git clone git@github.com:dnsimple/dnsimple-node.git
cd dnsimple-node
```

#### 2. Install the dependencies

Install the test dependencies:

```shell
npm install jscs
npm install mocha
npm install chai
npm install chai-as-promised
npm install nock
```

#### 3. Build and test

[Run the test suite](#testing) to check everything works as expected.


## Releasing

The following instructions uses `$VERSION` as a placeholder, where `$VERSION` is a `MAJOR.MINOR.BUGFIX` release such as `1.2.0`.

1. Run the test suite and ensure all the tests pass.

1. Set the version in `lib/dnsimple.js`:

    ```javascript
    Dnsimple.VERSION = '$VERSION';
    ```

1. Finalize the `## master` section in `CHANGELOG.md` assigning the version.

1. Commit and push the changes

    ```shell
    git commit -a -m "Release $VERSION"
    git push origin master
    ```

1. Wait for CI to complete.

1. Create a signed tag.

    ```shell
    git tag -a v$VERSION -s -m "Release $VERSION"
    git push origin --tags
    ```

1. Release to npm.

    ```shell
    npm publish
    ```


## Testing

To run the test suite:

```shell
npm test
```

## Tests

Submit unit tests for your changes. You can test your changes on your machine by [running the test suite](#testing).
