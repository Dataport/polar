# CHANGELOG

## unreleased

- BREAKING: Adapt client to new backend API. Previous versions are no longer runnable due the backend API change.
- Feature: Implemented document search, that is, the AddressSearch bar now also offers results for documents, and clicking on one will retrieve a list of toponyms from the backend and resolve them against the gazetteer. Previously, we had a "get all documents regarding place" functionality. Now, a "get all places regarding document" feature is implemented. Additionally to the AddressSearch, this can be triggered on documents found in the previously implemented way; the "get all places regarding document" functionality is available from within the GeoSearch result display.


## 1.0.0-alpha.0

Initial alpha release.
