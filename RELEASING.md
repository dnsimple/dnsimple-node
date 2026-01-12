# Releasing

This document describes the steps to release a new version of DNSimple/Node.

## Prerequisites

- You have commit access to the repository
- You have push access to the repository
- You have a GPG key configured for signing tags

## Release process

1. **Determine the new version** using [Semantic Versioning](https://semver.org/)

   ```shell
   VERSION=X.Y.Z
   ```

   - **MAJOR** version for incompatible API changes
   - **MINOR** version for backwards-compatible functionality additions
   - **PATCH** version for backwards-compatible bug fixes

2. **Run tests** and confirm they pass

   ```shell
   npm test
   ```

3. **Set the version** in `package.json`

   ```json
   {
     "version": "$VERSION",
   }
   ```

4. **Run tests** again and confirm they pass

   ```shell
   npm test
   ```

5. **Update the changelog** with the new version

   Finalize the `## main` section in `CHANGELOG.md` assigning the version.

6. **Commit and push the changes**

   ```shell
   git commit -a -m "Release $VERSION"
   git push origin main
   ```

7. **Wait for CI to complete**

8. **Create a signed tag**

   ```shell
   git tag -a v$VERSION -s -m "Release $VERSION"
   git push origin --tags
   ```

GitHub Actions will take it from here and publish to npm.

## Post-release

- Verify the new version appears on [npm](https://www.npmjs.com/package/dnsimple)
- Verify the GitHub release was created
