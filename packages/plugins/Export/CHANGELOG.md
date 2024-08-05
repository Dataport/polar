# CHANGELOG

## unpublished

- Breaking: As a result of the bundling with `rollup`, the styles of the package need to be imported via `@polar/plugin-export/styles.css`.
- Feature: The package is now being bundled by `rollup` before being published. This allows for a smaller package size and better compatibility with other packages.
- Fix: PDF export with download:false now works correctly.
- Fix: Adjust documentation to properly describe optionality of configuration parameters.
- Fix: Disable map interactions during the export process so potential interaction features won't be exported.
- Chore: Update dependencies to latest versions.

## 1.2.0

- Feature: Improved implementation to make plugin SPA-ready.

## 1.1.0

- Feature: Hide obstructive tooltip on small devices.
- Fix: Documentation error regarding plugin state.

## 1.0.0

Initial release.
