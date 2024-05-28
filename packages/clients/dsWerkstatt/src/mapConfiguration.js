import { services } from './services.js'

export const mapConfiguration = {
  layerConf: services,
  layers: [
    // TODO: Mindestens 2 Hintergrundlayer hier definieren
    // TODO: Mindestens 1 Featurelayer hier definieren
    // TODO: Alternativ zu 'services' kann auch ein bestehendes Service-Register wie bspw. https://geodienste.hamburg.de/services-internet.json verwendet werden. Falls gewünscht, einfach die URL als String eintragen; dies muss auch in der Datei 'polar-client.js' erfolgen.
  ],
  attributions: {
    // TODO: Relevante Attributions für **alle** verwendeten Layer hier eintragen
    // TODO: Optional staticAttributions nutzen, um
  },
  addressSearch: {
    searchMethods: [
      {
        queryParameters: {
          // TODO: Parameter so anpassen, dass a) Adressen, b) Straßen und c) Straßen mit Hausnummern gesucht werden können
        },
        type: 'mpapi',
        url: 'https://geodienste.hamburg.de/HH_WFS_GAGES?service=WFS&request=GetFeature&version=2.0.0',
      },
    ],
  },
  gfi: {
    // TODO: Mindestens einen Featurelayer einbinden; optional können mit 'window: true' die Ergebnisse in der UI angezeigt werden
  },
  pins: {
    // TODO: Pins sollen sich durch ziehen verschieben können
  },
  // NOTE: Folgende Parameter werden für die Funktionstüchtigkeit eines Klienten benötigt
  epsg: 'EPSG:25832',
  namedProjections: [
    [
      'EPSG:31467',
      '+proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=3500000 +y_0=0 +ellps=bessel +nadgrids=BETA2007.gsb +units=m +no_defs +type=crs',
    ],
    [
      'EPSG:25832',
      '+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
    ],
    [
      'EPSG:3857',
      '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs',
    ],
    [
      'EPSG:4326',
      '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs',
    ],
  ],
  stylePath: '../dist/polar-client.css',
}
