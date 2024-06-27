# CHANGELOG

## unpublished

- Fix: Features with categories that are not listed in `knownValues` are never displayed now. Previously, they were initially visible, but disappeared once any filter was touched.
- Fix: It was possible to have features visible that were loaded after the filter was applied and that would have been filtered out. This has been resolved.

## 1.1.1

- Fix: Configurations without time element could sometimes error on filtering operations.
- Fix: Filtering by custom timeframe added an additional day into the range.
- Fix: Filtering by a single day selected features of the next day only.

## 1.1.0

- Feature: Improved implementation to make plugin SPA-ready.

## 1.0.0

Initial release.
