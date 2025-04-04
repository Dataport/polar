# POLAR client BGW

## Content

The Badegewässer map client offers citizens information about bathing areas in Schleswig-Holstein.

Please see the `CHANGELOG.md` for all changes after the initial release.

## Usage

Usage as a HTML page is simply offered by hosting the client package with the included .html file.

## Client specific gfi configuration

| fieldName | type | description |
| - | - | - |
| infoFields | object[] | Array of key-label pair objects. The property of the feature that should be displayed has to be set as `key`. The description of this property has to be set as `label`. |
| highlightStyleBadestraende | highlightStyleBadestraende? | Highlight style for the layer 'Badestraende'. |

### Example configuration:

```js
infoFields: [
  { key: 'fid', label: 'Id' },
  { key: 'ort', label: 'Ort' },
  { key: 'bgw_kreis', label: 'Kreis' },
  { key: 'bgw_gwkategory', label: 'Kategorie' },
  { key: 'bgw_laenge', label: 'geographische Länge' },
  { key: 'bgw_breite', label: 'geographische Breite' },
  { key: 'bgw_laenge_bgw', label: 'Länge Uferlinie (m)'},
  { key: 'bgw_umfeld', label: 'Umfeld (m)' },
],
highlightStyleBadestraende: {
  stroke: { color: '#FF4500', width: 10 },
}
```

### gfi.highlightStyleBadestraende

| fieldName | type | description |
| - | - | - |
| stroke | stroke | Stroke style for the layer 'Badestraende'. Please see example below for styling options. |

####  Example configuration:

```js
highlightStyleBadestraende: {
  stroke: { color: '#FF4500', width: 10 },
}
```