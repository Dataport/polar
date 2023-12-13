# CHANGELOG

## 1.0.0-beta.0

Beta release. Feature-complete, but some known (and unknown?) bugs remain.

- Feature: Add features for `COMPLETE` mode:
  - Feature List
  - AfM Button
  - Filter
  - Mobile views for small devices
- Fix: The listenable `mapState` field `vendor_maps_position` has been changed in its formatting. It now matches the formatting of the neighbouring `mapCenter` field (`number,number`) instead of being an array.
- Fix: The listenable `mapState` field `vendor_maps_address_to` has been renamed to `vendor_maps_distance_to` to match the previous name.

## 1.0.0-alpaka.0

Test release. Feature-complete for AfM integration.
