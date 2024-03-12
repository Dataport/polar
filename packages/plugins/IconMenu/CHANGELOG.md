# CHANGELOG

## 2.0.0-alpha.1

- Breaking: As a result of the bundling with `rollup`, the styles of the package need to be imported via `@polar/plugin-icon-menu/styles.css`.
- Feature: The package is now being bundled by `rollup` before being published. This allows for a smaller package size and better compatibility with other packages.

## 1.2.0

- Feature: Improved implementation to make plugin SPA-ready.

## 1.1.0

- Feature: Add default locale for filter plugin as child.
- Feature: Add default locale for gfi plugin as child.
- Feature: Hide obstructive tooltip on small devices.
- Feature: Added action `openMenuById` that expects an id as payload and opens the matching icon menu entry.
- Feature: Render mobile content in `MoveHandle` of `@polar/core`. This also means, that `initiallyOpen` only works on large devices.
- Fix: Resolved internal error. (No effect on client behaviour.)

## 1.0.1

- Fix: Plugin contents were rendered above map in certain circumstances. This has been resolved.

## 1.0.0

Initial release.
