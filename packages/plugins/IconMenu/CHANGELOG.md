# CHANGELOG

## unpublished

- Feature: Add new configuration parameter `component` to be able to interchange the UI component of this plugin.
- Feature: Expose `IconMenuWrapper.vue` as a new export in order to use it in custom implementations.


## 1.3.1

- Chore: Update `@polar/lib-custom-types` to `v2.0.0`.

## 1.3.0

- Feature: Remove requirement of `isHorizontal` prop for plugins as the relevant logic is implemented in `@polar/core`.
- Fix: Resolve issue with `initiallyOpen` not working as expected.

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
