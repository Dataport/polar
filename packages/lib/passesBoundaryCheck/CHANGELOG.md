# CHANGELOG

## 2.0.1

- Chore: Upgrade devDependency `ol` from `^9.2.4` to `^10.3.1`.

## 2.0.0

- Breaking: `passesBoundaryCheck` now only resolves true or false when the result is indicative of the true-ness of the coordinate being contained within the boundary, and symbols indicative of occurring errors in other scenarios. (Previously: Errors resolved false.) It is now up to using plugins to decide how to respond to errors.
- Chore: Add missing `ol@^9.2.4` devDependency.

## 1.0.0

Initial release.
