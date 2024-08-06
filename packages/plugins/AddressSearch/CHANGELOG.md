# CHANGELOG

## unpublished

- Feature: Add title internationalization; i.e. features may now contain locale keys as titles.
- Feature: Add new optional configuration parameter `afterResultComponent` that allows to display a custom component for each search result.
- Feature: There is now a new optional configuration parameter `searchMethods.queryParameters.likeFilterAttributes` for the WfsSearch Add new that allows to add custom key/value pairs which are mapped to attributes to the like filter operator.
- Fix: Adjust documentation and types to properly describe optionality of configuration parameters.

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
