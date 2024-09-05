# IconMenu

The IconMenu offers an icon-button based menu to open various functionality as cards. This way, obstructive UI can be hidden until the user desires to open it. Please use carefully – users may have issues finding process-relevant buttons/interactions if you hide them here.  
Currently, the IconMenu should only be rendered with `layoutTag` set to `NineLayoutTag.TOP_RIGHT`.

## Scope

It is meant for additional information/functionality (legend, other layers) or power users in non-public clients.

_Please note that the average user has never seen the client before and just wants to get done with it, not learn a map client._

## Configuration

### iconMenu

> ⚠️ This plugin can't be configured with the `mapConfiguration`, but is configured during client construction. Currently, no way exists to add plugins to it after the build took place.

For details on the `displayComponent` attribute, refer to the [Global Plugin Parameters](../../core/README.md#global-plugin-parameters) section of `@polar/core`.

| fieldName | type | description |
| - | - | - |
| layoutTag | enum['TOP_LEFT','TOP_MIDDLE','TOP_RIGHT','MIDDLE_LEFT','MIDDLE_MIDDLE','MIDDLE_RIGHT','BOTTOM_LEFT','BOTTOM_MIDDLE','BOTTOM_RIGHT'] | Defines where the icon menu is rendered. Only use `NineLayoutTag.TOP_RIGHT` here for the time being. |
| menus | menuEntry[] | Defines which plugins should be rendered as part of the icon menu. |
| initiallyOpen | string? | Id of the plugin which should be open on start; only applicable if the device doesn't have a small display. |

Use the configuration during client build.

Example Configuration:
```js
{
  initiallyOpen: 'layerChooser',
  displayComponent: true,
  menus: [
    {
      plugin: PolarPluginLayerChooser({}),
      icon: 'fa-layer-group',
      id: 'layerChooser',
    },
    {
      plugin: PolarPluginDraw({}),
      icon: 'fa-pencil',
      id: 'draw',
      hint: 'Draw or write something on the map'
    },
  ],
  layoutTag: NineLayoutTag.TOP_RIGHT,
}
```

### iconMenu.menuEntry

| fieldName | type | description |
| - | - | - |
| id | string | Id of the plugin, used to resolve hint locale. |
| plugin | PolarPlugin | The plugin that should be part of the icon menu. |
| hint | string? | Overrides the default hint displayed for the icon menu button. |
| icon | string? | Icon for icon menu button. If given, render a button with the icon. When clicked, open the content of the configured plugin. If not given, render the plugin content as is inside the IconMenu. Current examples for the usage without icon include Zoom and Fullscreen. |

Example Configuration:
```js
{
  menus: [
    {
      plugin: PolarPluginLayerChooser({}),
      icon: 'fa-layer-group',
      id: 'layerChooser',
    },
    {
      plugin: PolarPluginDraw({}),
      icon: 'fa-pencil',
      id: 'draw',
      hint: 'Draw or write something on the map'
    },
  ],
}
```

## Modes

When landscape mode is active the IconMenu is oriented horizontally. Currently, the IconMenu works fine only if there is not more than one row of Icons in landscape mode.
