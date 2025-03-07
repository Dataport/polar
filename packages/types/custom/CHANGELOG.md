# CHANGELOG

## unpublished

- Feature: Add `snapTo` to `DrawConfiguration` for specification of layers to snap to.
- Feature: Add `lassos` to `DrawConfiguration`. With this, `addLoading`, `removeLoading`, and `toastAction` have also been introduced to allow the feature to use other plugins via API calls, and `Lasso` itself has been introduced.
- Feature: Add new interface `LayerChooserConfiguration` and the parameter `layerChooser` to `MapConfig` for the configurability of `@polar/plugin-layer-chooser`.

## 2.0.0

- Breaking: The type `LanguageOption` has been renamed to `Locale`.
- Feature: The `PluginContainer` now specifies `language` as deprecated. Please use the new key `locales` instead.
- Feature: Add new optional parameters `icons` to `AttributionConfiguration` and `ZoomConfiguration` to override plugin specific icons.
- Feature: Add new type `ZoomIcons`.
- Feature: Add new interface `LegendConfiguration` including new available configuration options to override icons for `@polar/plugin-legend`.
- Feature: Add new optional property `legend` to `MapConfig`.
- Feature: Add new parameter `measureOptions` to `DrawConfiguration`.
- Feature: Add new type `MeasureOptions`.
- Feature: Add new type `MeasureMode`.
- Feature: Add optional property `measure` to `DrawStyle`.
- Feature: Add new property `multiSelect` to `GfiConfiguration`.
- Fix: Make `selectionStyle`, `hoverStyle`, `defaultStyle` and `unselectableStyle` optional and edit type for `dispatchOnMapSelect` in interface `ExtendedMasterportalapiMarkers`.

## 1.5.0

- Feature: Add `selectedCoordinate` to core store getters; it returns `null` or the `selected` feature's point coordinates.
- Feature: Add new parameters `unselectableStyle` and `isSelectable` with new type `ExtendedMasterportalapiMarkersIsSelectableFunction` to interface `ExtendedMasterportalapiMarkers`.
- Feature: Add new parameter `isSelectable` with new type `GfiIsSelectableFunction` to interface `GfiLayerConfiguration`.
- Feature: Add new parameter `enableOptions` to interface `DrawConfiguration`.
- Feature: Add new interface `ScaleConfiguration` and new property `scale` to `mapConfiguration`.
- Feature: Add `afterResultComponent` to `AddressSearchConfiguration` for custom search result suffixes.
- Feature: Add `mapHasDimensions` to `CoreState` and `CoreGetters`.
- Feature: Add new getter `deviceIsHorizontal` to `CoreGetters`.
- Feature: Add `footer` to `RenderType` as an option to display attributions in a footer.
- Feature: Add new parameter `showZoomSlider` to `ZoomConfiguration`.
- Feature: Add new types `LoaderStyles` and `LoadingIndicatorConfiguration`.
- Feature: Add `loadingIndicator` to `MapConfig` to configure loader style.
- Feature: Add new utility type `PartialBy`.
- Feature: Add new type `MasterportalApiConfig`.
- Feature: Change `MapConfig` to allow for partial configuration as some parameters have default values and have it be extended from `MasterportalApiConfig`.
- Feature: Add new configuration parameter `directSelect` and `boxSelect` to `GfiConfiguration`.
- Feature: Add new configuration parameter `featureStyles` to `MapConfig`.
- Feature: Add new configuration parameter `styleId` to `LayerConfiguration`.
- Fix: Document missing return type to `afterLoadFunction`, which may also return a Promise.
- Fix: Add `string` as option for `SearchType` since arbitrary strings can be registered.
- Fix: Remove unused parameters `proxyUrl` and `loadingStrategy` from `LayerConfigurationOptions`.
- Fix: Properly document optional parameters of interfaces `AddressSearchConfiguration`, `FeatureList`, `FilterConfigurationTime`, `FilterConfigurationTimeOption`, `GeoLocationConfiguration`, `LayerConfigurationOptionLayers` and `PinsConfiguration`
- Fix: Add missing parameters `mode` and `renderType` to `GfiConfiguration`.
- Fix: Remove mpapi-search specific parameters from general interface `QueryParameters`.
- Fix: Extend `SelectResultPayload` with fitting vuex parameters, and `SelectResultFunction` with `title` field as used in `@polar/plugin-address-search`.
- Fix: Use correct type `VueConstructor` for properties `GfiConfiguration.gfiContentComponent`, `MoveHandleProperties.component` and `MoveHandleActionButton.component`.
- Fix: Add missing `gfiMode` to `LayerConfiguration`.
- Fix: Add missing `maxFeatures` to `GfiLayerConfiguration`.

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
