# Toast

## Scope

The toast plugin offers global functionality to display text messages to the user. These are the classic success, warning, info, and error messages, helping to understand what's going on or why something happened.

## Configuration

Please check the vuetify documentation to override the success, warning, info, or errors colors in general. To affect only this plugin, the following configuration parameters can be added to either the plugin instantiation or the mapConfiguration:

### toast

| fieldName | type | description |
| - | - | - |
| error | toastStyle? | Design override for error messages. |
| info | toastStyle? | Design override for info messages. |
| success | toastStyle? | Design override for success messages. |
| warning | toastStyle? | Design override for warning messages. |

For details on the `displayComponent` attribute, refer to the [Global Plugin Parameters](../../core/README.md#global-plugin-parameters) section of `@polar/core`.

Example configuration:
```js
toast: {
  info: {
    toastStyle: {
      color: '#0000FF'
      icon: 'fas fa-file'
    }
  },
  error: {
    toastStyle: {
      color: '#FF0000'
      icon: 'fas fa-cloud'
    }
  }
}

```

#### toast.toastStyle

| fieldName | type | description |
| - | - | - |
| color | string? | Either a color code like '#FACADE' or a color string [vuetify understands](https://vuetifyjs.com/en/styles/colors/). |
| icon | string? | CSS icon class. |

Example configuration:
```js
toastStyle: {
  color: '#0000FF'
  icon: 'fas fa-file'
}
```

## Store

### Actions

New entries are made via action. They are either dismissed after a timeout or by user interaction.

```js
map.$store.dispatch('plugin/toast/addToast', payload)
```

#### Payload structure

| fieldName | type | description |
| - | - | - |
| type | enum['error', 'warning', 'info', 'success'] | Decides the default toast colouring and icon. |
| text | string | Textual user information. This may either be a user-readable string or a translation key. |
| timeout | number | Any positive non-null number will be used as ms until the toast is closed. 0 means no timeout. |
| color | ?string | See {toast.toastStyle}. Overrides setting for this toast only. |
| icon | ?string | See {toast.toastStyle}. Overrides setting for this toast only. |

#### Usage example

```js
map.$store.dispatch('plugin/toast/addToast', {
  type: 'warning',
  text: 'Wrong hammer for screw.',
  timeout: 5000,
})
```

![Alert example](./readme_example.png)

Due to its timeout, the message will automatically disappear after 5 seconds passed.
