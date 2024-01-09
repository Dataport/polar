# CHANGELOG

## unpublished

- Feature: Improved implementation to make plugin SPA-ready.
- Feature: Improve WFS list highlighting with focus/hover styles that are easier to decipher for end users.
- Feature: Add the possibility to update the close-button to e.g. indicate movement to the vector layer feature list.
- Feature: Prevent tooltip windows on touch and pen events; now only mouse hover events produce such tooltips now.
- Feature: If a feature with related features (cluster) is selected in the feature list, users can now toggle between the features with forward/backward buttons, just like when selecting clustered features in the map.
- Feature: If a feature becomes clustered / is no longer clustered when zooming out / in, the selected features are updated properly now based on the selected cluster in the map.

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
