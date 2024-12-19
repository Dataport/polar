# CHANGELOG

## unpublished

- Feature: If a user is geolocated outside of the map's extent, the client will inform the user of why geolocation did not take effect via a textbox.
- Feature: The map can now be used for internal use with specific configurations. See the configuration section in the README for relevant configuration information.
- Feature: Add new searches for address and parcels added.
- Feature: Add new background and specialist data layers added.
- Feature: Add new plugins DishExportMap and InternGfi for intern mode use added.
- Fix: Extend typing for search result function according to type package update.
- Fix: Import types `AddressSearchState` and `AddressSearchGetters` from correct position.
- Fix: Import enum `SearchResultSymbols` from correct position.
- Chore: Change value of `pins.movable` configuration to `'drag'` as using a boolean has been deprecated in a future release.
- Chore: Upgrade `@masterportal/masterportalapi` from `2.8.0` to `2.40.0` and subsequently `ol` from `^7.1.0` to `^9.2.4`.
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
