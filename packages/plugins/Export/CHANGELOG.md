# CHANGELOG

## unpublished

- Chore: The dependency `jspdf` was updated from `^2.5.2` to `^4.2.1` due to multiple security issues ([issue one](https://github.com/parallax/jsPDF/security/advisories/GHSA-f8cm-6447-x5h2) and [issue two](https://github.com/parallax/jsPDF/security/advisories/GHSA-wfv2-pwc8-crg5)). The security issues did not affect POLAR builds, and no further action is required.

## 1.2.2

- Chore: Update `@polar/lib-custom-types` to `v2.0.0`.

## 1.2.1

- Fix: PDF export with download:false now works correctly.
- Fix: Adjust documentation to properly describe optionality of configuration parameters.
- Fix: Disable map interactions during the export process so potential interaction features won't be exported.
- Chore: Update dependencies to latest versions.

## 1.2.0

- Feature: Improved implementation to make plugin SPA-ready.

## 1.1.0

- Feature: Hide obstructive tooltip on small devices.
- Fix: Documentation error regarding plugin state.

## 1.0.0

Initial release.
