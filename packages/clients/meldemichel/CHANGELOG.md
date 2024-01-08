# CHANGELOG

## unpublished

- Feature: This client now supports the `@polar/core`'s field `stylePath`. The usage is documented in the API.md file.
- Feature: Update icon of `layerChooser` in `iconMenu` to `fa-layer-group` to clear-up the content hidden behind the menu button.
- Feature: Update the close-button of the GFI window to indicate more clearly that it leads to the FeatureList.
- Feature: Move attributions from the `iconMenu` to the bottom-right, use a smaller icon and a different colour to clear-up the secondary nature of the content.
- Feature: The client is now SPA-ready. The `API.md` has been extended with example code.
- Fix: Size and colours of GFI navigation arrows have been aligned to neighbouring items in mobile mode.
- Fix: Fixed an issue on narrow devices sometimes showing undefined content in the gfi after clicking somewhere in the map where no feature is present.

## 1.0.0-beta.1

- Fix: The modes `SINGLE` and `REPORT` falsely ran the GFI plugin dependent upon configuration only available in `COMPLETE` mode. This issue has been resolved.

## 1.0.0-beta.0

Beta release. Feature-complete, but some known (and unknown?) bugs remain.

- Feature: Add features for `COMPLETE` mode:
  - Feature List
  - AfM Button
  - Filter
  - Mobile views for small devices
- Fix: The listenable `mapState` field `vendor_maps_position` has been changed in its formatting. It now matches the formatting of the neighbouring `mapCenter` field (`number,number`) instead of being an array.
- Fix: The listenable `mapState` field `vendor_maps_address_to` has been renamed to `vendor_maps_distance_to` to match the previous name.

### Dependency updates

Please check the package changelogs regarding details.

|Package|Previous|Current|
|-|-|-|
| `@polar/core | ^1.1.0 | ^1.2.1 |
| `@polar/lib-custom-types | ^1.1.0 | ^1.2.0 |
| `@polar/lib-invisible-style | * | ^1.0.0 |
| `@polar/plugin-address-search | ^1.0.0 | ^1.1.0 |
| `@polar/plugin-attributions | ^1.0.0 |  ^1.1.0 |
| `@polar/plugin-filter | * |  ^1.0.0 |
| `@polar/plugin-fullscreen | ^1.0.0 |  ^1.1.0 |
| `@polar/plugin-geo-location | ^1.1.0 | ^1.2.0 |
| `@polar/plugin-gfi | ^1.0.0 |  ^1.1.0 |
| `@polar/plugin-icon-menu | ^1.0.1 | ^1.1.0 |
| `@polar/plugin-layer-chooser | ^1.0.0 | ^1.1.0 |
| `@polar/plugin-loading-indicator | ^1.0.0 | ^1.0.1 |
| `@polar/plugin-pins | ^1.1.0 |  ^1.1.1 |
| `@polar/plugin-reverse-geocoder | ^1.0.0 | ^1.0.1 |
| `@polar/plugin-scale | ^1.0.0 |  ^1.0.1 |
| `@polar/plugin-toast | ^1.0.0 |  ^1.0.1 |
| `@polar/plugin-zoom | ^1.0.0 | ^1.1.0 |

## 1.0.0-alpaka.0

Test release. Feature-complete for AfM integration.
