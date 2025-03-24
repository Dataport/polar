# CHANGELOG

## unpublished

- Fix: Fixed a bug where keyboard navigation in radio groups didn't work.
- Chore: Update `@polar`-dependencies to the latest versions.
- Chore: Add missing `ol` peerDependency.

## 1.0.0

- Breaking: Adapt client to new backend API. Previous versions are no longer runnable due the backend API change.
- Feature: Implement document search, that is, the AddressSearch bar now also offers results for documents and clicking on one will retrieve a list of toponyms from the backend and resolve them against the gazetteer. Previously, we had a "get all documents regarding place" functionality. Now, a "get all places regarding document" feature is implemented. Additionally to the AddressSearch, this can be triggered on documents found in the previously implemented way; the "get all places regarding document" functionality is available from within the GeoSearch result display.
- Feature: The result display now features a display regarding what kind of search interaction the current search results stem from. This is meant to enhance interpretability of the results' scope.
- Feature: Add a display regarding what kind of search interaction the current search results stem from to the result display. This is meant to enhance interpretability of the results' scope.
- Fix: Adjust heatmap feature to match the new data structure and have it working again.

## 1.0.0-alpha.0

Initial alpha release.
