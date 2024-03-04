# CHANGELOG

## unpublished

- Feature: The package is now being bundled by `rollup` before being published. This allows for a smaller package size and better compatibility with other packages.

## 2.0.0

- Breaking: `passesBoundaryCheck` now only resolves true or false when the result is indicative of the true-ness of the coordinate being contained within the boundary, and symbols indicative of occurring errors in other scenarios. (Previously: Errors resolved false.) It is now up to using plugins to decide how to respond to errors.

## 1.0.0

Initial release.
