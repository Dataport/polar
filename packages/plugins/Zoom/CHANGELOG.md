# CHANGELOG

## unpublished

- Breaking: As a result of the bundling with `rollup`, the styles of the package need to be imported via `@polar/plugin-zoom/styles.css`.
- Feature: The package is now being bundled by `rollup` before being published. This allows for a smaller package size and better compatibility with other packages.
- Feature: Add new configuration parameter `showZoomSlider` to configure a zoom slider display.
- Refactor: Remove redundant prop `isHorizontal` from `Zoom` component. Logic is now placed in `@polar/core`.

## 1.2.0

- Feature: Improved implementation to make plugin SPA-ready.

## 1.1.0

- Feature: Hide obstructive tooltip on small devices.
- Fix: Documentation error regarding plugin state/getters.

## 1.0.0

Initial release.
