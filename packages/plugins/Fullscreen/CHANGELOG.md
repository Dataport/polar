# CHANGELOG

## 1.2.2

- Fix: Adjust documentation to properly describe optionality of configuration parameters.
- Refactor: Remove redundant props regarding positioning of the tooltip.
- Chore: Remove unused dependency `@masterportal/masterportalapi`.

## 1.2.1

- Fix: Add missing deregistration of event listeners on destruction.
- Fix: Aria-label was missing on fullscreen button.

## 1.2.0

- Feature: Improved implementation to make plugin SPA-ready.

## 1.1.0

- Feature: Hide obstructive tooltip on small devices.
- Fix: Documentation error regarding plugin state.
- Fix: Since iPhones do not support fullscreen mode, the fullscreen button is hidden on such devices. See [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API#browser_compatibility) for more information.

## 1.0.0

Initial release.
