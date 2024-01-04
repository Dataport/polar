# CHANGELOG

## unpublished

- Feature: Improved implementation to make plugin SPA-ready.
- Feature: Add the possibility to update the close-button to e.g. indicate movement to the vector layer feature list.

## 1.1.0

- Feature: Add cluster-ready vector layer feature list with pagination, see configuration parameter `gfiLayerConfiguration.featureList`.
- Feature: Can now be rendered as child of icon menu, see configuration parameter `renderType`.
- Feature: Add optional configuration parameter `activeLayerPath` to allow checking for whether any fitting layer is active.
- Feature: Add support for type `GeoJSON` layers.
- Feature: Render mobile content in `MoveHandle` of `@polar/core`.
- Fix: Add space to dev GFI window to fully contain close button effects.
- Fix: Documentation error regarding plugin state.
- Fix: `<img>`s constantly firing `onload`-event thus constantly firing `resize`.

## 1.0.0

Initial release.
