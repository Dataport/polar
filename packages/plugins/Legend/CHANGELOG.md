# CHANGELOG

## unpublished

- Breaking: As a result of the bundling with `rollup`, the styles of the package need to be imported via `@polar/plugin-legend/styles.css`.
- Feature: The package is now being bundled by `rollup` before being published. This allows for a smaller package size and better compatibility with other packages.
- Fix: The Legend plugin will keep working on the error that a layer without entry in the service register has been configured.
- Fix: Remove unused prop `maxWidth`.
- Chore: Upgrade peerDependency `@masterportal/masterportalapi` from `2.8.0` to `2.40.0`

## 1.1.0

- Feature: Locale string layer names are now translated.

## 1.0.0

Initial implementation.
