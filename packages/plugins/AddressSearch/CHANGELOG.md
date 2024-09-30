# CHANGELOG

## unpublished

- Breaking: Upgrade `@masterportal/masterportalapi` from `2.8.0` to `2.40.0` and subsequently `ol` from `7.1.0` to `^9.2.4`.
- Breaking: Remove deprecated search method `gazetteer`. Please use search method `mpapi` instead.
- Feature: Add new optional configuration parameter `afterResultComponent` that allows to display a custom component for each search result.
- Feature: There is now a new optional configuration parameter `searchMethods.queryParameters.likeFilterAttributes` for the WfsSearch that allows to add custom key/value pairs which are mapped to attributes of the like filter operator.
- Feature: `AddressSearchState`, `AddressSearchGetters`, and `MpApiParameters` types have been additionally exposed as root export since using packages frequently rely on them.
- Feature: When using the search type `mpapi`, a second search using a wildcard is now being triggered when the first search yielded no results.
- Feature: When navigating through the search results by keyboard, pressing `Escape` will now result in closing the available results. Browser interactions on `Escape` may take precedence (i.e. in fullscreen mode, the browser will exit fullscreen mode instead of letting us use the input).
- Fix: Adjust documentation and types to properly describe optionality of configuration parameters.
- Fix: Use correct getter for `minLength`.
- Fix: `SearchResultSymbols` has been additionally exposed as root export since using packages frequently rely on it.
- Chore: expand on the description to `afterResultComponent` in the Readme.md.
- Chore: Clarify the description to `addLoading` and `removeLoading` within the readme.

## 2.0.0-alpha.5

Fix: Revert back to previous dependency modelling.

## 2.0.0-alpha.4

- Fix: Model every dependency as a devDependency.

## 2.0.0-alpha.3

- Fix: Remove vuetify plugin for rollup.
- Fix: Import vuetify components, so they can be externalized by rollup.

## 2.0.0-alpha.2

- Fix: Add vuetify plugin for rollup.

## 2.0.0-alpha.1

- Breaking: As a result of the bundling with `rollup`, the styles of the package need to be imported via `@polar/plugin-address-search/styles.css`.
- Feature: Add title internationalization; i.e. features may now contain locale keys as titles.
- Feature: The package is now being bundled by `rollup` before being published. This allows for a smaller package size and better compatibility with other packages.

## 1.2.1

- Fix: Keyboard navigation of results to work on all browsers.

## 1.2.0

- Feature: Improved implementation to make plugin SPA-ready.
- Fix: Remove `z-index` on container element to ensure proper order of displayed elements.

## 1.1.0

- Feature: Add aria-description to the input for improved accessibility.
- Feature: Render results as a native html list.
- Feature: Change navigation of search results to use arrow keys instead of tabbing. If multiple groups are configured, the expand buttons can be navigated via arrow keys as well as tabbing. This should improve the usability for large result lists.
- Feature: Add configuration parameter `focusAfterSearch` to be able to focus on the first result after a successful search.
- Fix: Hide results if they are rendered as part of a group and the results exceed the configured limited amount.
- Fix: Documentation error regarding plugin state.

## 1.0.0

Initial release.
