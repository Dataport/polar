# CHANGELOG

## unpublished

- Feature: Add currently active language key as parameter `language` to `CoreState `.
- Feature: Add types for new plugin `Filter`, namely `FilterConfiguration`; also to `MapConfig` as configurable plugin.
- Feature: Add types for new core state and getters. (`zoomLevel`, `hovered`, `selected`)
- Feature: Add parameters `renderType`, `featureList`, and `activeLayerPath` to `GfiConfiguration`.
- Feature: Add type `FeatureList` for `GfiConfiguration`.
- Feature: Add parameter `showTooltip` to `GfiLayerConfiguration`.
- Feature: Add parameter `renderType` to `GeoLocationConfiguration`.
- Feature: Add export of `RenderType`.
- Feature: Add parameter `focusAfterSearch` to `AddressSearchConfiguration`.
- Feature: Add parameter `hasSmallDisplay` to `CoreState`.
- Feature: Add types for new `MoveHandle`-handling for usage in e.g. `CoreGetters`; namely the interfaces `MoveHandleProperties` and `MoveHandleActionButton` as well as the type `MoveHandleProps`. 
- Feature: Add `layerConf` to `MapConfig`.
- Fix: Add missing `CoreGetter` fields `clientHeight`, `clientWidth`, `center`, `zoomLevel`.

## 1.1.0

- Feature: Add parameter `boundaryOnError` to `PinsConfiguration`.
- Feature: Add parameter `boundaryOnError` to `GeoLocationConfiguration`.
- Feature: Add flag `showTooltip` to `GeoLocationConfiguration`.
- Feature: Add type for CoreState's `center` field.
- Feature: Remodel type structure to deduplicate fields now modeled in `LayerBoundPluginOptions`.
- Feature: Add new optional parameter `initial` to `PinsConfiguration` including related interface `InitialPin`.
- Feature: Added new configuration variation for `movable` in `PinsConfiguration`.
- Fix: Add type for CoreState's nested `.plugin` container.

## 1.0.0

Initial release.
