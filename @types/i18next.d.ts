import 'i18next'

// // // core/plugins // // //

import { common as resourcesDeCore } from '../packages/core/src/language/locales/de'
import { resourcesDe as resourcesDeAddressSearch } from '../packages/plugins/AddressSearch/src/language'
import { resourcesDe as resourcesDeAttributions } from '../packages/plugins/Attributions/src/language'
import { resourcesDe as resourcesDeDraw } from '../packages/plugins/Draw/src/language'
import { resourcesDe as resourcesDeExport } from '../packages/plugins/Export/src/language'
import { resourcesDe as resourcesDeFilter } from '../packages/plugins/Filter/src/language'
import { resourcesDe as resourcesDeFullscreen } from '../packages/plugins/Fullscreen/src/language'
import { resourcesDe as resourcesDeGeoLocation } from '../packages/plugins/GeoLocation/src/language'
import { resourcesDe as resourcesDeGfi } from '../packages/plugins/Gfi/src/language'
import { resourcesDe as resourcesDeIconMenu } from '../packages/plugins/IconMenu/src/language'
import { resourcesDe as resourcesDeLayerChooser } from '../packages/plugins/LayerChooser/src/language'
import { resourcesDe as resourcesDeLegend } from '../packages/plugins/Legend/src/language'
import { resourcesDe as resourcesDeLoadingIndicator } from '../packages/plugins/LoadingIndicator/src/language'
import { resourcesDe as resourcesDePins } from '../packages/plugins/Pins/src/language'
import { resourcesDe as resourcesDeScale } from '../packages/plugins/Scale/src/language'
import { resourcesDe as resourcesDeToast } from '../packages/plugins/Toast/src/language'
import { resourcesDe as resourcesDeZoom } from '../packages/plugins/Zoom/src/language'

// // // clients // // //

import { dishDe } from '../packages/clients/dish/src/language'
import { dishHeaderDe } from '../packages/clients/dish/src/plugins/Header/language'
import { dishModalDe } from '../packages/clients/dish/src/plugins/Modal/language'
import { meldemichelDe } from '../packages/clients/meldemichel/src/language'
import { meldemichelDe as meldemichelAfmButtonDe } from '../packages/clients/meldemichel/src/plugins/AfmButton/language'
import { snowboxDe } from '../packages/clients/snowbox/src/language'
import { textLocatorDe } from '../packages/clients/textLocator/src/language'
import { textLocatorDe as textLocatorHeaderDe } from '../packages/clients/textLocator/src/plugins/Header/language'
import { geometrySearchDe } from '../packages/clients/textLocator/src/plugins/GeometrySearch/language'

// // // resources // // //

const resources = {
  common: {
    ...resourcesDeCore,
    dish: dishDe,
    meldemichel: meldemichelDe,
    snowbox: snowboxDe,
    textLocator: textLocatorDe,
    plugins: {
      addressSearch: resourcesDeAddressSearch.plugins.addressSearch,
      attributions: resourcesDeAttributions.plugins.attributions,
      dish: {
        ...dishHeaderDe,
        ...dishModalDe
      },
      draw: resourcesDeDraw.plugins.draw,
      export: resourcesDeExport.plugins.export,
      filter: resourcesDeFilter.plugins.filter,
      fullscreen: resourcesDeFullscreen.plugins.fullscreen,
      geoLocation: resourcesDeGeoLocation.plugins.geoLocation,
      // geometrySearch is from textLocator
      geometrySearch: {
        ...geometrySearchDe
      },
      gfi: resourcesDeGfi.plugins.gfi,
      iconMenu: resourcesDeIconMenu.plugins.iconMenu,
      layerChooser: resourcesDeLayerChooser.plugins.layerChooser,
      legend: resourcesDeLegend.plugins.legend,
      loadingIndicator: resourcesDeLoadingIndicator.plugins.loadingIndicator,
      meldemichel: {
        ...meldemichelAfmButtonDe
      },
      pins: resourcesDePins.plugins.pins,
      scale: resourcesDeScale.plugins.scale,
      textLocator: {
        ...textLocatorHeaderDe
      },
      toast: resourcesDeToast.plugins.toast,
      zoom: resourcesDeZoom.plugins.zoom,
    }
  }
} as const

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: "common"
    resources: typeof resources
  }
}
