# CHANGELOG

## unpublished

- Breaking: Upgrade peerDependency `ol` from `^7.1.0` to `^9.2.4`.
- Breaking: As a result of the bundling with `rollup`, the styles of the package need to be imported via `@polar/plugin-draw/styles.css`.
- Feature: The package is now being bundled by `rollup` before being published. This allows for a smaller package size and better compatibility with other packages.
- Fix: Adjust documentation to properly describe optionality of configuration parameters.
- Feature: Make the stroke color for drawn geometry features selectable and editable.

## 1.1.0

- Feature: Improved implementation to make plugin SPA-ready.

## 1.0.1

- Fix: Documentation error regarding plugin state.

## 1.0.0

Initial release.
