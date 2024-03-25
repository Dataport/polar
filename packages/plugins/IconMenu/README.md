# IconMenu

The IconMenu offers an icon-button based menu to open various functionality as cards. This way, obstructive UI can be hidden until the user desires to open it. Please use carefully – users may have issues finding process-relevant buttons/interactions if you hide them here.  
Currently, the IconMenu should only be rendered with `layoutTag` set to `NineLayoutTag.TOP_RIGHT`.

## Scope

It is meant for additional information/functionality (legend, other layers) or power users in non-public clients.

_Please note that the average user has never seen the client before and just wants to get done with it, not learn a map client._

## Configuration

> ⚠️ This plugin can't be configured with the `mapConfiguration`, but is configured during client construction. Currently, no way exists to add plugins to it after the build took place.

Usage during client build:

```js
{
  // id of the plugin which should be open on start; only applicable if the device doesn't have a small display
  initiallyOpen: 'some',
  menus: [
    {
      // use plugin as child
      plugin: SomePolarPlugin({}),
      /*
       * Icon for icon menu button
       * If given, render a button with the icon. When clicked, open the content of the configured plugin.
       * If not given, render the plugin content as is inside the IconMenu. The component of the plugin
       * should in that case implement the prop `isHorizontal: boolean`.
       * Current examples for the usage without icon include Zoom and Fullscreen,
       */
      icon: 'fa-book-atlas',
      // used to resolve hint locale
      id: 'some',
      // optionally override the hint displayed for the icon menu button
      hint: 'Some Plugin',
    },
    {
      plugin: AnotherPolarPlugin({}),
      id: 'another',
    },
  ],
}
```

### menus

When landscape mode is active the IconMenu is oriented horizontally. Currently, the IconMenu works fine only if there is not more than one row of Icons in landscape mode.
