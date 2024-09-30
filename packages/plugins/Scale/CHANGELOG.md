# CHANGELOG

## unpublished

- Breaking: Upgrade peerDependency `ol` from `^7.1.0` to `^9.2.4`.
- Breaking: As a result of the bundling with `rollup`, the styles of the package need to be imported via `@polar/plugin-scale/styles.css`.
- Feature: Add the option to configure a scale switcher via the new configuration parameters `showScaleSwitcher` and `zoomMethod`.
- Feature: The package is now being bundled by `rollup` before being published. This allows for a smaller package size and better compatibility with other packages.

## 1.1.0

- Feature: Improved implementation to make plugin SPA-ready.
- Fix: Alignment of scales on narrow devices.

## 1.0.1

- Fix: Prevent linebreak on ratio scale on narrow devices.

## 1.0.0

Initial release.
