# CHANGELOG

## unpublished

- Breaking: Upgrade peerDependency of `ol` from `^7.1.0` to `^9.2.4`.
- Breaking: `getGazetteerFeatures` has been removed. All uses within POLAR have been deprecated and replaced. If you still need this function, please refer to the masterportalApi implementation that features it as root export `search`.
- Breaking: `getWfsFeatures` now throws errors if required parameters on the wfs configuration are missing instead of only printing error messages on the console.
- Feature: `getWfsFeatures` now offers the possibility to set custom attributes for the `PropertyIsLike` operator.
- Fix: Properly extend interface `WfsParameters` from `QueryParameters` to reflect actual usage.

## 1.0.1

- Fix: Increase type precision of EPSG codes from `string` to `EPSG:${string}`.

## 1.0.0

Initial release.
