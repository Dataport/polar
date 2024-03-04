# CHANGELOG

## unpublished

- Feature: The package is now being bundled by `rollup` before being published. This allows for a smaller package size and better compatibility with other packages.
- BREAKING: As a result of the bundling with `rollup`, the styles of the package need to be imported via `@polar/plugin-scale/styles.css`.

## 1.1.0

- Feature: Improved implementation to make plugin SPA-ready.
- Fix: Alignment of scales on narrow devices.

## 1.0.1

- Fix: Prevent linebreak on ratio scale on narrow devices.

## 1.0.0

Initial release.
