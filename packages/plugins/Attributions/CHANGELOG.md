# CHANGELOG

## unpublished

- Feature: Add new option `'footer'` to configuration parameter `renderType` that changes the attributions to be displayed as a small version of the information box that is always visible.
- Refactor: Replace redundant props with computed properties.
- Chore: Correctly model `ol` as a devDependency and upgrade from `^7.1.0` to `^9.2.4`.

## 1.2.1

- Fix: There were incomplete changes regarding how to write current year and month references. They have been rolled back to `<YEAR>` and `<MONTH>` in both documentation and code.

## 1.2.0

- Feature: Improved implementation to make plugin SPA-ready.
- Fix: Update Attributions on zooming out of layer resolution boundaries.

## 1.1.0

- Feature: Add link to repository and license as required by EUPL v1.2.
- Feature: Include title in AttributionContent so users receive this information on all devices.
- Feature: `max-width` and `width` are now only set on the content if `renderType` is `independent` as the mobile view is rendered in the `MoveHandle`.
- Fix: Attributions are now being translated when the window is open.

## 1.0.0

Initial release.
