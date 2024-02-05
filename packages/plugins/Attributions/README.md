# Attributions

## Scope

This plugin shows attributions (that is, legal information) regarding copyrights and sources of the currently visible layers.

### Extension ideas

- Offer a mode where attributions are always visible. (Not on roadmap.)

## Configuration

### attributions

All parameters are optional. However, setting neither `layerAttributions` nor `staticAttributions` results in an empty window.

| fieldName          | type                         | description                                                                                                                                           |
| ------------------ | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| layerAttributions  | layerAttribution[]?          | List of attributions that are shown when the matching layer is visible.                                                                               |
| staticAttributions | string[]?                    | List of static attributions that are always shown.                                                                                                    |
| renderType         | 'iconMenu' \| 'independent'? | Whether this plugin ('independent') or the IconMenu should handle opening the information box. Defaults to 'independent'.                             |
| listenToChanges    | string[]?                    | Store variable paths to listen to for changes. Will update the currently visible layers depending on the current map state on changes to these values. Please mind that, when referencing another plugin, that plugin must be in `addPlugins` before this one. |
| initiallyOpen      | boolean?                     | Whether the information box is open by default. Only usable when renderType is set to 'independent', otherwise the IconMenu handles this.             |
| windowWidth        | number?                      | If `renderType` is set to `independent`, sets the width of the container of the attributions. Defaults to 500.                                                                                 |

#### attributions.layerAttribution

| fieldName | type   | description                                                                                                                                           |
| --------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| id        | string | ID of service the attribution relates to. The text will only be shown when the layer is visible.                                                      |
| title     | string | Attribution text or localization key. May contain HTML. The tags `<YEAR>` and `<MONTH>` are translated to the current year or month respectively. |
