# Scale

> ⚠ The Scale plugin is currently meant for passive usage only. It's API has not yet been finally defined, and is subject to change without further notice.

## Scope

The scale plugin shows the current map resolution as relative scale (1:x) and/or absolute scale (a drawn line has length x units).

## Configuration

For details on the `displayComponent` attribute, refer to the [Global Plugin Parameters](../../core/README.md#global-plugin-parameters) section of `@polar/core`.

| fieldName | type | description |
| - | - | - |
| showScaleSwitcher | boolean? | If set to `true`, a button to switch to a specific scale will be rendered. Defaults to `false`. Requires the configuration parameter `options` set in the `mapConfiguration`, see `<...masterportalAPI.fields>` in the `@polar/core` package documentation for more information. Also requires the parameter `zoomMethod` to be configured. |
| zoomMethod | string? | Path to the action that is used for the zoom of the scale switcher. Has to take `zoomLevel` as payload. Must be configured for the scale switcher, otherwise it will not be rendered.