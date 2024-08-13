# CHANGELOG

## unpublished

- Feature: Add `afterResultComponent` to `AddressSearchConfiguration` for custom search result suffixes.
- Feature: Add `mapHasDimensions` to `CoreState` and `CoreGetters`.
- Feature: Add new getter `deviceIsHorizontal` to `CoreGetters`.
- Feature: Add `footer` to `RenderType` as an option to display attributions in a footer.
- Feature: Add new parameter `showZoomSlider` to `ZoomConfiguration`.
- Feature: Add new types `LoaderStyles` and `LoadingIndicatorConfiguration`.
- Feature: Add `loadingIndicator` to `MapConfig` to configure loader style.
- Fix: Add `string` as option for `SearchType` since arbitrary strings can be registered.
- Fix: Remove unused parameters `proxyUrl` and `loadingStrategy` from `LayerConfigurationOptions`.
- Fix: Properly document optional parameters of interfaces `AddressSearchConfiguration`, `FeatureList`, `FilterConfigurationTime`, `FilterConfigurationTimeOption`, `GeoLocationConfiguration`, `LayerConfigurationOptionLayers` and `PinsConfiguration`
- Fix: Add missing parameters `mode` and `renderType` to `GfiConfiguration`.
- Fix: Remove mpapi-search specific parameters from general interface `QueryParameters`.

## 1.4.1

- Fix: Increase type precision of EPSG codes from `string` to `EPSG:${string}`.

## 1.4.0

- Feature: Add `MasterportalapiPolygonFillHatch` to `MarkerStyle` as optional fill variant.
- Feature: Add `clusterSize` and `size` to `MarkerStyle` for adjustable marker size.

## 1.3.0

- Feature: Add `stylePath` to `MapConfig` for a cleaner style import.
- Feature: Add new parameter `closeIcon` to `MoveHandleProperties`.
- Feature: Add `moveHandleActionButton` to `CoreGetters` and `CoreState` and remove it as the optional parameter `actionButton` from `MoveHandleProperties`.

## 1.2.0

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
