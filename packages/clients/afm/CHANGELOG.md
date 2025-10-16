# CHANGELOG

## unpublished

- Feature: Add `@polar/plugin-reverse-geocoder` to the client. For details about this plugin, see [the plugin's documentation](https://dataport.github.io/polar/docs/afm/plugin-reverse-geocoder.html).
- Chore: `AddressSearch` is now visible by default in the example configuration to illustrate a working default scenario for the added `ReverseGeocoder`. This did not result in a change to the software's defaults, but merely to the example.

## 2.0.3

- Fix: Use v3.2.2 of `@polar/core` and v3.1.1 of `@polar/plugin-address-search` to resolve issues when using `+` and `-` characters in the search window or using the arrow keys to navigate the entered input.

## 2.0.2

- Fix: Use v3.1.1 of `polar/lib-get-features` that includes a fix for reading a service's WFS response's CRS from its features if it's not available on the root node.

## 2.0.1

- Fix: Use v3.0.1 of `@polar/plugin-gfi` that includes a fix for the usage of `directSelect`, `multiSelect` and their usage in conjunction with `@polar/plugin-pins`.

## 2.0.0

- Breaking: Update `@polar`-dependencies to the latest versions. This includes an update of `ol` from `^7.1.0` to `^10.3.1`.
- Feature: This client now supports the `@polar/core`'s field `stylePath`. The usage is documented in the API.md file.
- Feature: Update icon of `layerChooser` in `iconMenu` to `fa-layer-group` to clear-up the content hidden behind the menu button.
- Chore: Change value of `pins.movable` configuration to `'drag'` as using a boolean has been deprecated.

## 1.0.1

- Fix: The included example files have been updated to the new syntax and work again.

## 1.0.0

Initial release.
