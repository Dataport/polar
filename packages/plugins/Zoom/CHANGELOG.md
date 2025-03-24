# CHANGELOG

## unpublished

- Feature: Add new configuration parameter `component` to be able to interchange the UI component of this plugin.
- Feature: Expose `ZoomButtonContainer.vue` as a new export in order to use it in custom implementations.

## 1.4.0

- Feature: Add option to configure used icons.

## 1.3.0

- Feature: Add easing between zoom levels.
- Feature: Add new configuration parameter `showZoomSlider` to configure a zoom slider display.
- Refactor: Remove redundant prop `isHorizontal` from `Zoom` component. Logic is now placed in `@polar/core`.

## 1.2.0

- Feature: Improved implementation to make plugin SPA-ready.

## 1.1.0

- Feature: Hide obstructive tooltip on small devices.
- Fix: Documentation error regarding plugin state/getters.

## 1.0.0

Initial release.
