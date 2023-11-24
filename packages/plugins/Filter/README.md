# Filter

## Scope

The Filter plugin can be used to filter arbitrary configurable vector layers by their properties.

### Configuration

#### filter

| fieldName | type | description |
| - | - | - |
| layers | Record<string, filterConfiguration> | Maps layer id to filter configuration. |

#### filter.filterConfiguration

| fieldName | type | description |
| - | - | - |
| categories | category[] | Category filter definition so filter features by their properties. |
| time | time | Time filter definition so filter features by a time property. |

##### filter.filterConfiguration.category

| fieldName | type | description |
| - | - | - |
| selectAll | boolean? | If true, a checkbox is added to de/select all categories at once. Defaults to `false`. |
| targetProperty | string | Target property to filter by. |
| knownCategories | string[] | Array of known values for the property. Each entry will result in a checkbox that allows filtering the appropriate features. Properties not listed will not be filterable. The technical name will result in a localization key that can be configured on a per-client basis. |

##### filter.filterConfiguration.time

| fieldName | type | description |
| - | - | - |
| targetProperty | string | Target property to filter by. |
| last | options[] | Array of options to create for a `last` filter, e.g. "last 10 days". |
| next | options[] | Array of options to create for a `next` filter, e.g. "next 10 day". |
| freeSelection | freeSelection[] | Provide a more dynamic configurable from-to chooser for timeframes. |

##### filter.filterConfiguration.time.options

| fieldName | type | description |
| - | - | - |
| amounts | number[] | Offer radio buttons for these amounts of `unit`. |
| unit | 'days' | Implemented units. Currently, only `'days'` are supported. |

##### filter.filterConfiguration.time.freeSelection

| fieldName | type | description |
| - | - | - |
| now | ('until' \| 'from')? | If set, only time points *until* now or *from* now are selectable, including the current time point. |
| unit | 'days' | Implemented units. Currently, only `'days'` are supported. |

#### Example configuration

```js
{
  filter: {
    layers: {
      "1234": {
        categories: [{
          selectAll: true,
          targetProperty: 'buildingType',
          knownCategories: ['shed', 'mansion', 'fortress']
        }, {
          selectAll: false,
          targetProperty: 'lightbulb',
          knownCategories: ['on', 'off']
        }],
        time: {
          targetProperty: 'lastAccident',
          last: {
            amounts: [7, 30],
            unit: 'days'
          },
          freeSelection: {
            unit: 'days',
            now: 'until'
          }
        }
      }
    }
  }
}
```
