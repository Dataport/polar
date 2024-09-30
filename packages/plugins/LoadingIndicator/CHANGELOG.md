# CHANGELOG

## unpublished

- Breaking: As a result of the bundling with `rollup`, the styles of the package need to be imported via `@polar/plugin-loading-indicator/styles.css`.
- Feature: The package is now being bundled by `rollup` before being published. This allows for a smaller package size and better compatibility with other packages.
- Refactor: Remove redundant prop-forwarding by only using one component.
- Feature: Add new optional parameter `loaderStyle` to choose between different loader styles.
- Feature: Add new mutation `setLoaderStyle` to choose between different loader styles at runtime.

## 1.1.0

- Feature: Improved implementation to make plugin SPA-ready.

## 1.0.1

- Fix: Documentation error regarding plugin state/getters.

## 1.0.0

Initial release.
