# CHANGELOG

## unpublished

- Breaking: `getWfsFeatures` now throws errors if required parameters on the wfs configuration are missing instead of only printing error messages on the console.
- Feature: The package is now being bundled by `rollup` before being published. This allows for a smaller package size and better compatibility with other packages.

## 1.0.1

- Fix: Increase type precision of EPSG codes from `string` to `EPSG:${string}`.

## 1.0.0

Initial release.
