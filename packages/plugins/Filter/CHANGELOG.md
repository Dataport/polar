# CHANGELOG

## 2.0.0-alpha.3

- Chore: Add `compileTemplate` to `rollup-plugin-vue`.

## 2.0.0-alpha.2

- Chore: Release the package without minifying.

## 2.0.0-alpha.1

- Breaking: As a result of the bundling with `rollup`, the styles of the package need to be imported via `@polar/plugin-filter/styles.css`.
- Feature: The package is now being bundled by `rollup` before being published. This allows for a smaller package size and better compatibility with other packages.

## 1.1.2

- Fix: Features with categories that are not listed in `knownValues` are never displayed now. Previously, they were initially visible, but disappeared once any filter was touched.
- Fix: It was possible to have features visible that were loaded after the filter was applied and that would have been filtered out. This has been resolved.
- Fix: Adjust documentation to properly describe optionality of configuration parameters.
- Fix: Correctly log an error if required parameter `layers` is not provided.

## 1.1.1

- Fix: Configurations without time element could sometimes error on filtering operations.
- Fix: Filtering by custom timeframe added an additional day into the range.
- Fix: Filtering by a single day selected features of the next day only.

## 1.1.0

- Feature: Improved implementation to make plugin SPA-ready.

## 1.0.0

Initial release.
