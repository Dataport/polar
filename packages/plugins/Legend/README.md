# Legend

The Legend module offers legend images as supplied by OGC services via `GetLegendGraphic` and `GetLegendURL` calls.

## Configuration

For details on the `displayComponent` attribute, refer to the [Global Plugin Parameters](../../core/README.md#global-plugin-parameters) section of `@polar/core`.

### legend

| fieldName | type | description |
| - | - | - |
| icons | Record<string, string>? | Optional icon override. |

#### legend.icons

| fieldName | type | description |
| - | - | - |
| close | string? | Icon shown when pressing the button closes the legends. Defaults to `'fa-chevron-right'`. |
| open | string? | Icon shown when pressing the button opens the legends. Defaults to `'fa-info'`. |
