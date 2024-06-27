# Filter

## Scope

The Filter plugin can be used to filter arbitrary configurable vector layers by their properties.

### Configuration

#### filter

| fieldName | type | description |
| - | - | - |
| layers | Record<string, filterConfiguration> | Maps layer id to filter configuration. |

```
The following chapters contain drafts in this format. Please mind that they neither represent UI nor localisation, but are merely there to communicate the idea with an example.
```

##### filter.filterConfiguration

| fieldName | type | description |
| - | - | - |
| categories | category[]? | Category filter definition to filter features by their property values. |
| time | time? | Time filter definition so filter features by a time property. |

###### filter.filterConfiguration.category

| fieldName | type | description |
| - | - | - |
| knownValues | (string \| number \| boolean \| null)[] | Array of known values for the feature properties. Each entry will result in a checkbox that allows filtering the appropriate features. Properties not listed will not be filterable and never be visible. The technical name will result in a localization key that can be configured on a per-client basis. |
| targetProperty | string | Target property to filter by. This is the name (that is, key) of a feature property. |
| selectAll | boolean? | If true, a checkbox is added to de/select all `knownValues` (above) at once. Defaults to `false`. |

For example, `{targetProperty: 'favouriteIceCream', knownValues: ['chocolate', 'vanilla', 'strawberry'], selectAll: true}` will add these checkboxes:

```
▢ De-/select all
▢ Chocolate
▢ Vanilla
▢ Strawberry
```

###### filter.filterConfiguration.time

| fieldName | type | description |
| - | - | - |
| targetProperty | string | Target property to filter by. |
| freeSelection | freeSelection? | Provide a more dynamic configurable from-to chooser for timeframes. |
| last | options[]? | Array of options to create for a `last` filter, e.g. "last 10 days". |
| next | options[]? | Array of options to create for a `next` filter, e.g. "next 10 day". |
| pattern | string? | Pattern the target string uses for its date formatting. Defaults to `'YYYY-MM-DD'`. Only 'Y', 'M', and 'D' are interpreted. All other characters are considered filler. Example: A feature has `"AA202001-04"` as property value that is supposed to convey a date. Setting `pattern` to `"--YYYYDD-MM"` would interpret it as the 1st of April, 2020. |

Of all time restrictions, at most one can be selected at any time. The produced options are selectable by radio buttons.

###### filter.filterConfiguration.time.options

| fieldName | type | description |
| - | - | - |
| amounts | number[] | Offer radio buttons for these amounts of `unit`. The rest of the current day is additionally included in the range. |
| unit | 'days'? | Implemented units. Currently, only `'days'` are supported. Defaults to `'days'`. |

For example, `{amounts: [3, 7], unit: 'days'}` as value for `last` will add these radio buttons:

```
◯ Last 3 days
◯ Last 7 days
```

In `'days'` mode, the selections will always include full days, and additionally the current day. Due to this, the time frame of "last 7 days" is actually 8*24h long. This seems unexpected at first, but follows intuition – if it's Monday and a user filters to the "last seven days", they would expect to fully see last week's Monday, but also features from that day's morning.

###### filter.filterConfiguration.time.freeSelection

| fieldName | type | description |
| - | - | - |
| now | ('until' \| 'from')? | If set, only time points *until* now or *from* now are selectable, including the current time point. |
| unit | 'days'? | Implemented units. Currently, only `'days'` are supported. Defaults to `'days'`. |

For example, `{now: 'until', unit: 'days'}` will add this radio button:

```
◯ Choose time frame
   From ▒▒▒▒▒▒▒▒▒▒▒ // clicking input opens a selector restricted *until* today
   To   ▇▇▇▇▇▇▇▇▇▇▇ // clicking input opens a selector restricted *until* today
```

#### Example configuration

```js
{
  filter: {
    layers: {
      "1234": {
        categories: [
          {
            selectAll: true,
            targetProperty: 'buildingType',
            knownValues: ['shed', 'mansion', 'fortress']
          },
          {
            selectAll: false,
            targetProperty: 'lightbulb',
            knownValues: ['on', 'off']
          }
        ],
        time: {
          targetProperty: 'lastAccident',
          last: [
            {
              amounts: [7, 30],
              unit: 'days',
            },
          ],
          freeSelection: {
            unit: 'days',
            now: 'until'
          },
          /**
           * Feature holds date property as e.g. "20143012", where 2014 is the
           * year, 30 the day, and 12 the month.
           */
          pattern: 'YYYYDDMM'
        }
      }
    }
  }
}
```
