# CHANGELOG

## unpublished

- Feature: The package is now being bundled by `rollup` before being published. This allows for a smaller package size and better compatibility with other packages.
- BREAKING: As a result of the bundling with `rollup`, the styles of the package need to be imported via `@polar/plugin-filter/styles.css`.
- Fix: Configurations without time element could sometimes error on filtering operations.

## 1.1.0

- Feature: Improved implementation to make plugin SPA-ready.

## 1.0.0

Initial release.
