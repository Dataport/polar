# getFeatures

Helper functions to be able to send `GetFeature`-Requests to (WFS)-services.

## German INSPIRE cadastral search

`getInspireCadastralParcels(signal, url, input, parameters)` searches German
ALKIS identifiers in INSPIRE CP 4.0 services via WFS 2.0.0. It resolves cadastral
district names using `CadastralZoning`, caches those names per service URL and
returns GeoJSON features with descriptive titles and additional properties.

See the [AddressSearch configuration](../../plugins/AddressSearch/README.md#inspire-cadastral-search)
for inputs, parameters, returned properties and service limitations.
