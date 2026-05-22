

TOOLTIPS:

Entsprechend Zwischenentwurf kleine Tooltips (Pills), die Funktionen beschreiben, z.B. Doppelklick zum Schließen, Alt+M1 zum Kantenlöschen, usw.; gerätsensitiv

FUNKTIONEN (Nicht Modi, nicht aktivierbar):

* Exportieren:
  * Optionen: Verfügbare konfigurierte Formate (Keine Auswahl, wenn eines)
* Speichern: Nur, wenn WFS-T angebunden, der speicherbar konfiguriert ist

SPECIAL GEOMS:

Circle (variant of Point, needs user docs, needs property config)
Text (variant of Point, needs user docs, needs property config)
Freihand (prolly can't be saved at all)

CONFIG

showLoader: boolean
showToasts: boolean
layers:
  []
  // id → use that for identification; name → local layer; neither → default draw layer
  id?: string
  name?: string
  enableDrawOptions (offers e.g. stroke colour):
    boolean | »configuration that fits wfs-t saving if coleurs« (must match properties to design somehow, not to be implemented in first iteration since how styling is saved in a WFS-T may wildly differ; if we can/should define it, use what's described further down in `style`)
  lassos:
    []
    id: layer id of vector to copy from
    minZoom?: from when on lasso works
  measureOptions:
    metres: boolean
    kilometres: boolean
    hectares: boolean
    initialOption: metres | kilometres | hectares | none
  revision:
    autofix: boolean
    metaServices:
      []
      id: string
      aggregationMode: unequal | all
      propertyNames: string[]
    validate: boolean
  // more than before since Single/Multi must be differentiated
  selectableDrawModes:
  snapTo:
  style:
    see masterportalAPI, either copy their stuff, or build/use a more OL-like thing like https://dataport.github.io/polar/main/docs/stylePreview/example/prod-example.html; either way, hatches are kewl and should be supported, and our OL-like thing could be saved as JSON param on any WFS-T if a fitting attribute is given
  textStyle:
    font: string | {family: string, size: number[]}
    textColor: string
  saving:
    »if ID matches a WFS-T config, we may need some save parameters and then are good to go« – partially copyable from FDB, also use the OL methods provided; please mind that saving (esp. of styles) should be written in an adaptable fashion, i.e. adapters should be planned, since people will make up formats wherever they go
