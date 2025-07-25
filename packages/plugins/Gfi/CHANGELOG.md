# CHANGELOG

## 3.1.0

- Feature: Extend detection if a `Draw`-interaction is currently active to also check for `@polar/plugin-routing`.
- Fix: When using the gfi with `renderType` set to `'independent'` the window was not added to the MoveHandle to be displayed on mobile devices. Also, the closeIcon was incorrectly set if `ƒeatureList` was configured. This has been fixed by watching for changes to `windowFeatures`.

## 3.0.2

- Fix: Allow layers that have `singleTile` set to `true` and thus being an `ImageLayer` instead a `TileLayer` to be used for GFI-requests as well.

## 3.0.1

- Fix: Clean-up internal flag used for `multiSelect` if a drawing is aborted. This is always the case if a user simply clicks into the map holding CTRL / Command.

## 3.0.0

- Breaking: Upgrade `@masterportal/masterportalapi` from `2.40.0` to `2.45.0` and subsequently `ol` from `^9.2.4` to `^10.3.1`.
- Feature: Add new configuration parameter `multiSelect` to enable the possibility to choose between the selecting multiple features through a box or through a circle. The addition of this parameter deprecates the previously used parameter `boxSelect`.
- Fix: Correctly disable `directSelect` if the user is currently using functionality of `@polar/plugin-draw`.

## 2.1.0

- Feature: Add new action `setFeatureInformation` to be able to set feature information in the store and trigger all relevant processes so that the information displayed to the user is as if he has selected the features himself.

## 2.0.0

- Breaking: Upgrade `@masterportal/masterportalapi` from `2.8.0` to `2.40.0` and subsequently `ol` from `^7.1.0` to `^9.2.4`.
- Feature: Add new configuration parameter `isSelectable` that can be used to filter features to be unselectable.
- Feature: Add new configuration parameters `directSelect` and `boxSelect` to be able to select multiple features at once.
- Fix: Adjust documentation to properly describe optionality of configuration parameters.
- Fix: Add missing configuration parameters `featureList` and `maxFeatures` to the general documentation and `filterBy` and `format` to `gfi.gfiLayerConfiguration`
- Fix: Add missing entry of `gfiContentComponent` to `GfiGetters`.
- Fix: Fix issue rendering properties of a feature if a value is not a string.
- Refactor: Replace redundant prop-forwarding with `getters`.
- Refactor: Use core getter `clientWidth` instead of local computed value.
- Chore: expand on the description to `gfiContentComponent` in the Readme.md.

## 1.2.2

- Fix: The `close` method previously always removed the pin when not in `extendedMasterportalapiMarkers` mode. This issue has been resolved by distinguishing whether a close operation happened in effect to a direct closing user interaction or was technically motivated.

## 1.2.1

- Fix: Add missing deregistration of event listeners on destruction.

## 1.2.0

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
