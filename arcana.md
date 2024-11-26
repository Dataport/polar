# Arcane knowdlege 🧙🔮

Ideally, this file would be empty. However, there's some manual procedures not yet automated, and knowledge that's difficult to put as comment since comments will probably not be found in the situations that require reading them.

For these cases, this not-so-secret file denotes our not-anymore-arcane knowledge.

## Release process

1. Draw a dependency tree of POLAR packages with changes documented as `"unpublished"` in their respective `CHANGELOG.md` files.
2. Start with the leafs. Update the version from `"unpublished"` to the appropriate version indicated by the nature of changes. If required, change the package.json dependencies to refer to minimum versions of dependencies used.
3. Push to main. A pipeline is now running that detects the CHANGELOG change, updates the version, publishes the package to NPM, creates a tag `@polar/package-name@x.y.z`, and produces a GitHub release.
4. If it's a client, add the NPM package to the release artifacts for an easier download. See previous releases for formatting of contents and artifacts.
5. Delete leafs from tree made in `1`. Go back to `2` until the tree is empty.

## Update process

* Updating the `@masterportal/masterportalapi` requires a full test and API check in all using locations. The package does not follow SemVer, and thus it is up to us to make sure all endpoints fit appropriately. Also check the `scripts/overrideMasterportalapi.js`, which in the current version overrides the package's code to alter its behaviour.
* Updating `ol` (which may implicitly happen on updating `@masterportal/masterportalapi`) should result in updating the version across all packages using it. Furthermore, use the search function to find all code positions with comments containing "undocumented". These code positions refer to `ol` functionality that is not documented and may change without a breaking version.
