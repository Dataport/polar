// TODO reduce to information actually read by masterportalapi
// TODO move information readable by POLAR to where it belongs in config

export default [
  {
    visibility: true,
    id: 'xplanwms',
    name: 'XPlanWMS',
    url: 'https://hh.xplanungsplattform.de/xplan-wms/services/wms',
    typ: 'WMS',
    layers: 'BP_Planvektor,SO_Planvektor',
    format: 'image/png',
    version: '1.3.0',
    singleTile: false,
    transparent: true,
    transparency: 0,
    urlIsVisible: true,
    tilesize: 512,
    gutter: 0,
    minScale: '0',
    maxScale: '2500000',
    layerAttribution: 'nicht vorhanden',
    legendURL: false,
    cache: false,
    featureCount: 1000,
    datasets: [],
    notSupportedIn3D: false,
    gfiTheme: 'XPlanGfiTemplate',
    gfiAttributes: 'showAll',
    gfiThemeSettings: {
      wmsFeatureListTitle: [
        'xpPlanName',
        'featureMemberName',
        'wmsTitleCounter',
      ],
      wmsFeatureListTitleSeparator: ' - ',
      inlineSeparator: ', ',
      hasRemovedStartEndBrackets: 'true',
      newLineSeparator: '|',
      linkPrefix: 'https://hh-qs.xplanungsplattform.de/xplan-wms',
      tabs: [
        {
          title: 'Objektattribute',
          attributes: {
            list: [
              'texte',
              'refTextInhalt',
              'externeReferenz',
              'xpPlanName',
              'planArtWert',
              'xpPlanType',
              'xpVersion',
              'xplanMgrPlanId',
              'wmsSortDate',
              'begruendungsTexte',
              'bereich',
              'gehoertZuPlan',
              'gehoertZuBereich',
              'dientZurDarstellungVon',
              'wirdDargestelltDurch',
              'gehoertZuBP_Bereich',
              'gehoertZuFP_Bereich',
              'spezExterneReferenz',
              'refScan',
              'planinhalt',
              'praesentationsobjekt',
            ],
            mode: 'exclude',
          },
          order: 'asc',
        },
        {
          title: 'Textinhalte',
          attributes: {
            list: ['texte', 'refTextInhalt', 'begruendungsTexte'],
            mode: 'include',
          },
          order: 'asc',
        },
        {
          title: 'Referenzen',
          attributes: {
            list: [
              'externeReferenz',
              'spezExterneReferenz',
              'bereich',
              'gehoertZuPlan',
              'gehoertZuBereich',
              'dientZurDarstellungVon',
              'wirdDargestelltDurch',
              'gehoertZuBP_Bereich',
              'gehoertZuFP_Bereich',
              'refScan',
              'planinhalt',
              'praesentationsobjekt',
            ],
            mode: 'include',
          },
          order: 'asc',
        },
        {
          title: 'Planattribute',
          attributes: {
            list: ['xpPlanName', 'xpPlanType', 'xpVersion', 'wmsSortDate'],
            mode: 'include',
          },
          order: 'asc',
        },
      ],
      regexCombineAttributes: [
        {
          selectRegex: '^.*Wert$',
          valueSubstitution: '$2 ($1)',
        },
        {
          selectRegex: '^.*UOM$',
          valueSubstitution: '$1 $2',
        },
      ],
      modifiedValues: {
        texte: [
          {
            findText: ']\\[',
            newText: '|',
          },
        ],
      },
      modifiedNames: {
        wmsSortDate: 'Plandatum',
        xpPlanName: 'Planname',
        xpPlanType: 'Planart',
        xpVersion: 'XPlanungsversion',
      },
    },
  },
  {
    visibility: false,
    id: 'xplanwfs',
    name: 'XPlanSynWFS',
    url: 'https://hh.xplanungsplattform.de/xplansyn-wfs/services/xplansynwfs',
    typ: 'WFS',
    featureType: 'BP_Plan',
    outputFormat: 'XML',
    version: '1.1.0',
    featureNS: 'http://www.opengis.net/gml',
    layerAttribution: 'nicht vorhanden',
    legendURL: false,
    hitTolerance: '',
    datasets: [],
    urlIsVisible: true,
    gfiTheme: 'XPlanGfiTemplate',
    linkPrefix: 'https://hh-qs.xplanungsplattform.de/xplan-wms',
    gfiAttributes: {
      name: 'Name',
      gmlId: 'Gml Id',
      gmlName: 'Gml Name',
      gmlDescription: 'Gml Description',
      xpVersion: 'xpVersion',
      xpPlanType: 'xpPlanType',
      xpPlanName: 'xpPlanName',
      xplanMgrPlanId: 'xplanMgrPlanId',
      gueltigkeitBeginn: 'Gültigkeitbeginn',
      gueltigkeitEnde: 'Gültigkeitsende',
      wmsSortDate: 'WMS Sorting Date',
      nummer: 'Nummer',
      internalId: 'Internal Id',
      beschreibung: 'Beschreibung',
      kommentar: 'Kommentar',
      technHerstellDatum: 'Techn. Herstellungsdatum',
      genehmigungsDatum: 'Genehmigungsdatum',
      untergangsDatum: 'Untergangsdatum',
      aendertPlan: 'Ändert Plan',
      wurdeGeaendertVonPlan: 'Wurde Geändert von Plan',
      aendertPlanBereich: 'Ändert Planbereich',
      wurdeGeaendertVonPlanBereich: 'Wurde Geändert von Planbereich',
      erstellungsMassstab: 'Erstellungsmaßstab',
      hoehenbezug: 'Höhenbezug',
      technischerPlanersteller: 'Technischer Planersteller',
      verfahrensMerkmale: 'Verfahrensmerkmale',
      hatGenerAttribut: 'Hat generisches Attribut',
      externeReferenz: 'Externe Referenz',
      begruendungsTexte: 'Begründungstexte',
      gemeinde: 'GEMEINDE!!!',
      planaufstellendeGemeinde: 'Planaufstellende Gemeinde',
      plangeber: 'Plangeber',
      aenderungenBisDatum: 'Aenderungen bis (Datum)',
      aufstellungsbeschlussDatum: 'Aufstellungsbeschluss (Datum)',
      veraenderungssperre: 'Veränderungssperre',
      auslegungsStartDatum: 'Auslegungsstart (Datum)',
      auslegungsEndDatum: 'Auslegungsende (Datum)',
      traegerbeteiligungsStartDatum: 'Trägerbeteiligungsstart (Datum)',
      traegerbeteiligungsEndDatum: 'Trägerbeteiligungsende (Datum)',
      satzungsbeschlussDatum: 'Satzungsbeschluss (Datum)',
      rechtsverordnungsDatum: 'Rechtsverordnung (Datum)',
      inkrafttretensDatum: 'Inkrafttretensdatum',
      ausfertigungsDatum: 'Ausfertigungsdatum',
      staedtebaulicherVertrag: 'Städtebaulicher Vertrag',
      erschliessungsVertrag: 'Erschliessungsvertrag',
      durchfuehrungsVertrag: 'Durchführungsvertrag',
      gruenordnungsplan: 'Grünordnungsplan',
      versionBauNVO: 'Version BauNVO',
      versionBauGB: 'Version BauGB',
      versionSonstRechtsgrundlage: 'Version Sonst. Rechtsgrundlage',
      bereich: 'Bereich',
      aendert: 'Ändert',
      wurdeGeaendertVon: 'Wurde Geändert von',
      veraenderungssperreBeschlussDatum: 'Veränderungssperre Beschlussdatum',
      veraenderungssperreDatum: 'Veraenderungssperre Datum',
      veraenderungssperreEndDatum: 'Veränderungssperre EndDatum',
      versionBauNVODatum: 'Version BauNVO Datum',
      versionBauNVOText: 'Version BauNVO Text',
      versionBauGBDatum: 'Version BauGB Datum',
      versionBauGBText: 'Version BauGB Text',
      versionSonstRechtsgrundlageDatum: 'Version Sonst. Rechtsgrundlage Datum',
      versionSonstRechtsgrundlageText: 'Version Sonst. Rechtsgrundlage Text',
      verlaengerungVeraenderungssperre: 'Verlängerung Veränderungssperre',
      verlaengerungVeraenderungssperreWert:
        'Verlängerung Veränderungssperre Wert',
      rechtsverbindlich: 'Rechtsverbindlich',
      informell: 'Informell',
      refBeschreibung: 'Ref. Beschreibung',
      refBegruendung: 'Ref. Begruendung',
      refExternalCodeList: 'Ref. External Code List',
      refLegende: 'Ref. Legende',
      refRechtsplan: 'Ref. Rechtsplan',
      refPlangrundlage: 'Ref. Plangrundlage',
      refKoordinatenListe: 'Ref. Koordinaten Liste',
      refGrundstuecksverzeichnis: 'Ref. Grundstücksverzeichnis',
      refPflanzliste: 'Ref Pflanzliste',
      refUmweltbericht: 'Ref Umweltbericht',
      refSatzung: 'Ref Satzung',
      refGruenordnungsplan: 'Ref Grünordnungsplan',
      bezugshoehe: 'Bezugshöhe',
      bezugshoeheUOM: 'Bezugshöhe UOM',
      planArt: 'Planart',
      planArtWert: 'Planart (Wert)',
      sonstPlanArt: 'Sonst. Planart',
      sonstPlanArtWert: 'Sonst. Planart Wert',
      verfahren: 'Verfahren',
      verfahrenWert: 'Verfahren (Wert)',
      rechtsstand: 'Rechtsstand',
      rechtsstandWert: 'Rechtsstand (Wert)',
      status: 'Status',
      statusWert: 'Status (Wert)',
      allgArtDerBaulNutzung: 'AllgArtDer*',
      refs_parsed: 'Refs parsed',
      planart_parsed: 'Planart combined',
      gemeinde_parsed: 'GEMEINDE PARSED!',
      texte: 'Texte',
      texte_parsed: 'Texte (mod)',
    },
    gfiThemeSettings: {
      inlineSeparator: ' --> ',
      newLineSeparator: '|',
      hasRemovedStartEndBrackets: 'true',
      tabs: [
        {
          title: 'Basisdaten',
          showAttributes: [
            'texte',
            'texte_parsed',
            'gmlId',
            'name',
            'nummer',
            'gemeinde',
            'gemeinde_parsed',
            'planart_parsed',
            'internalId',
            'beschreibung',
            'kommentar',
            'aendert',
            'wurdeGeaendertVon',
            'erstellungsMassstab',
            'bereich',
            'verfahrensMerkmale',
            'rechtsverbindlich',
            'informell',
            'hatGenerAttribut',
            'verlaengerungVeraenderungssperre',
            'verlaengerungVeraenderungssperreWert',
            'technischerPlanersteller',
            'planaufstellendeGemeinde',
            'versionBauNVODatum',
            'versionBauNVOText',
            'versionBauGBDatum',
            'versionBauGBText',
            'versionSonstRechtsgrundlageDatum',
            'versionSonstRechtsgrundlageText',
            '',
            'beschreibungURL',
            'begruendungURL',
            'rechtsplanURL',
            'liegenschaftskarteURL',
            'liegenschaftskarteGeorgefURL',
            '',
            'legendURL',
            '',
            'umweltberichtURL',
            '',
            'bezugshoehe',
            'bezugshoeheUOM',
            '',
            'plangeber',
            'verfahren',
            '',
            'verfahrenCode',
            '',
            'gruenordnungsplan',
            '',
            'gkz',
            '',
            'stadt',
            'ortsteil',
            '',
            'rechtsstand',
            '',
            'rechtsstandCode',
            '',
            'status',
            '',
            'statusCode',
            '',
            'hoehenbezug',
            'auslegungsStartDatum',
            'auslegungsEndDatum',
            '',
            'veraenderungssperre',
            'staedtebaulicherVertrag',
            'erschliessungsVertrag',
            'durchfuehrungsVertrag',
          ],
          order: 'asc',
        },
        {
          title: 'Zeitangaben',
          showAttributes: [
            'gueltigkeitBeginn',
            'gueltigkeitEnde',
            'veraenderungssperreDatum',
            'aufstellungsbeschlussDatum',
            'aenderungenBisDatum',
            'traegerbeteiligungsStartDatum',
            'traegerbeteiligungsEndDatum',
            'satzungsbeschlussDatum',
            'rechtsverordnungsDatum',
            'inkrafttretensDatum',
            'auslegungsStartDatum',
            'auslegungsEndDatum',
            'traegerbeteiligungsStartDatum',
            'traegerbeteiligungsEndDatum',
            'ausfertigungsDatum',
            'veraenderungssperreBeschlussDatum',
            'veraenderungssperreEndDatum',
            'technHerstellDatum',
            'untergangsDatum',
          ],
        },
        {
          title: 'Referenzen',
          showAttributes: ['refs_parsed', 'externeReferenz'],
          order: 'desc',
        },
        {
          title: 'Texte',
          showAttributes: ['texte_parsed', 'texte'],
          order: 'desc',
        },
        {
          title: 'Metadaten',
          showAttributes: [
            'xpVersion',
            'xpPlanName',
            'xpPlanType',
            'wmsSortDate',
          ],
          order: 'desc',
        },
        {
          title: '(all-asc)',
          showAttributes: 'showAll',
          order: 'asc',
        },
      ],
      combinedAttributes: {
        allgArtDerBaulNutzung: [
          'allgArtDerBaulNutzung',
          'allgArtDerBaulNutzungWert',
        ],
        refs_parsed: ['externeReferenz', 'refBegruendung'],
        planart_parsed: ['planArtWert', 'planArt'],
        texte_parsed: ['texte'],
        gemeinde_parsed: ['gemeinde'],
      },
      modifiedValues: {
        bereich: [
          {
            findText: '_',
            newText: ' # ',
            flag: 'g',
          },
        ],
        gemeinde: [
          {
            findText: '\\|',
            newText: '+',
          },
        ],
        texte: [
          {
            findText: '§(\\d)',
            newText: '|§$1',
            flag: 'g',
          },
        ],
        gemeinde_parsed: [
          {
            findText: '\\|',
            newText: ' <-> ',
          },
        ],
      },
    },
  },
  {
    id: 'basemapde_farbe',
    name: 'Basemap DE',
    visibility: true,
    url: 'https://sgx.geodatenzentrum.de/wms_basemapde',
    typ: 'WMS',
    layers: 'de_basemapde_web_raster_farbe',
    format: 'image/png',
    version: '1.3.0',
    singleTile: false,
    transparent: false,
    tilesize: 512,
    infoFormat: 'text/xml',
    gfiAttributes: 'ignore',
    gfiTheme: 'default',
    layerAttribution: 'nicht vorhanden',
    legend: true,
    featureCount: 1,
  },
  {
    id: 'flurstuecke',
    typ: 'OAF',
    name: 'Flurstueck',
    url: 'https://api.hamburg.de/datasets/v1/alkis_vereinfacht',
    collection: 'Flurstueck',
    crs: 'http://www.opengis.net/def/crs/EPSG/0/25832',
    bboxCrs: 'http://www.opengis.net/def/crs/EPSG/0/25832',
  },
  {
    id: 'bst_gasleitung',
    typ: 'OAF',
    name: 'bst_gasleitung',
    url: 'https://xtrasse.ldproxy.develop.diplanung.de/xtrasse_PFS_gas',
    collection: 'bst_gasleitung',
    crs: 'http://www.opengis.net/def/crs/EPSG/0/25832',
    bboxCrs: 'http://www.opengis.net/def/crs/EPSG/0/25832',
  },
  {
    id: '34127',
    name: 'Digitale Orthophotos (belaubt) Hamburg',
    url: 'https://geodienste.hamburg.de/HH_WMS_DOP_belaubt',
    typ: 'WMS',
    layers: 'dop_belaubt',
    format: 'image/png',
    version: '1.3.0',
    singleTile: false,
    legendURL:
      'https://geodienste.hamburg.de/HH_WMS_DOP_belaubt?language=ger&version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=dop_belaubt&format=image/png&STYLE=default',
  },
  {
    id: '453',
    name: 'Geobasiskarten (HamburgDE)',
    url: 'https://geodienste.hamburg.de/HH_WMS_HamburgDE',
    typ: 'WMS',
    layers: 'geobasiskarten_hhde',
    format: 'image/png',
    version: '1.3.0',
    singleTile: false,
    legendURL:
      'https://geodienste.hamburg.de/HH_WMS_HamburgDE?language=ger&version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=geobasiskarten_hhde&format=image/png&STYLE=default',
  },
  {
    id: 'bauDenkmaeler',
    name: 'WMS Denkmalkartierung Baudenkmale Hamburg',
    url: 'https://geodienste.hamburg.de/HH_WMS_Denkmalschutz',
    typ: 'WMS',
    layers: 'kd_ensembles',
    format: 'image/png',
    version: '1.3.0',
    singleTile: false,
    transparent: true,
  },
  {
    id: 'bebauungsplaene',
    name: 'WMS Bebauungspläne Hamburg',
    url: 'https://geodienste.hamburg.de/HH_WMS_Bebauungsplaene',
    typ: 'WMS',
    layers: 'hh_hh_festgestellt,hh_lgv_imverfahren',
    format: 'image/png',
    version: '1.3.0',
    singleTile: false,
    transparent: true,
  },
  {
    id: 'secureServiceTest',
    url: '',
    typ: 'WMS',
    layers: '',
    format: 'image/png',
    version: '1.3.0',
  },
]
