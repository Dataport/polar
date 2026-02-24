# CHANGELOG

## unpublished

- Feature: Split gfi field "Flurstück" into "Flurstückszähler" and "Flurstücknenner".
- Fix: Use only `basemapGrau` as background service for `DishExportMap` Plugin.

## 1.4.0

- Feature: Add client-specific `DishAttributions` plugin that wraps the standard Attributions plugin, adding a "Benutzungshinweise" link and a close button.
- Feature: Add 'Flur' to gfi and remove 'Flurstückskennzeichen' from it.
- Feature: Change highlighting Style for gfi.
- Feature: Use different background layer as default.
- Fix: Edit attributions due to current terms of use and add missing search services to static attributions.

## 1.3.2

- Fix: Don't check service availability in `INTERN` mode because some services do not allow HEAD requests.

## 1.3.1

- Fix: Correct parameter detection for `NewTab` in DishMapExport Plugin.

## 1.3.0

- Feature: Monumental label layer toggles its visibility depending on visible monumental layer geometries.
- Feature: Alkis layer is switched to visible after parcel search result is picked.
- Feature: Search results for 'Flurstückssuche' are sorted by the server.
- Fix: Add new configuration parameters for DishExportMap to configure different host (backend host might differ from `internalHost`) and to simplify adjustments for backend changes.
- Fix: Add terms of use for internal map.
- Fix: Open links for BKG and their terms of use in new tab.
- Fix: Only a new Tab for the print-function if newTab is wanted.
- Fix: The search now returns results regardless of case(upper/lower).
- Chore: Edit urlParams configuration for new testing environment.
- Feature: Configuration changed. A maximum of 120 features per search (BKG (address search) results) are now displayed.
- Enhancement: Add 'Gemeinde' to the searchresults from the intern-Denkmal-search
- Enhancement: Changed search result to display 'ONR' before the Objektnummer
- Enhancement: The search results are now beautifully sorted, just like in DA Nord.
- Enhancement: It is now possible to search ('Flurstücksuche') for 'Gemeinde'.

## 1.2.0

- Feature: If a user is geolocated outside the map's extent, the client will inform the user of why geolocation did not take effect via a textbox.
- Feature: The map can now be used for internal use with specific configurations. See the configuration section in the README for relevant configuration information.
- Feature: Add new searches for address and parcels.
- Feature: Add new background and specialist data layers.
- Feature: Add new plugin `DishExportMap` for intern mode use.
- Feature: Expand plugin `Gfi` for intern mode.
- Feature: dish search now disregards the character '/' in user inputs.
- Feature: Add new plugin `SelectObject` for intern mode use.
- Fix: Extend typing for search result function according to type package update.
- Fix: Import types `AddressSearchState` and `AddressSearchGetters` from correct position.
- Fix: Import enum `SearchResultSymbols` from correct position.
- Fix: The alt text to the "Landesdachmarke" for screen readers was missing.
- Fix: Image in gfi will only be shown if there is enough space for the minimum width.
- Chore: Change value of `pins.movable` configuration to `'drag'` as using a boolean has been deprecated in a future release.
- Chore: Upgrade `@masterportal/masterportalapi` from `2.8.0` to `2.45.0` and subsequently `ol` from `^7.1.0` to `^10.3.1`.
- Chore: Update `@polar`-dependencies to the latest versions.

## 1.1.1

- Fix: The marker previously disappeared on being moved/reclicked on a second feature. This issue has been resolved.
- Fix: The pin colour was off.

## 1.1.0

- Feature: Update icon of `layerChooser` in `iconMenu` to `fa-layer-group` to clear-up the content hidden behind the menu button.
- Chore: Various small changes to keep up with library updates.
- Chore: Changing internal URLs to new addresses.

## 1.0.0

Initial release.
