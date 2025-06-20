import 'i18next'

// // // core/plugins // // //

import { resourcesDe as resourcesDeCore } from '@polar/core/src/locales'
import { resourcesDe as resourcesDeAddressSearch } from '@polar/plugin-address-search/src/locales'
import { resourcesDe as resourcesDeAttributions } from '@polar/plugin-attributions/src/locales'
import { resourcesDe as resourcesDeDraw } from '@polar/plugin-draw/src/locales'
import { resourcesDe as resourcesDeExport } from '@polar/plugin-export/src/locales'
import { resourcesDe as resourcesDeFilter } from '@polar/plugin-filter/src/locales'
import { resourcesDe as resourcesDeFullscreen } from '@polar/plugin-fullscreen/src/locales'
import { resourcesDe as resourcesDeGeoLocation } from '@polar/plugin-geo-location/src/locales'
import { resourcesDe as resourcesDeGfi } from '@polar/plugin-gfi/src/locales'
import { resourcesDe as resourcesDeIconMenu } from '@polar/plugin-icon-menu/src/locales'
import { resourcesDe as resourcesDeLayerChooser } from '@polar/plugin-layer-chooser/src/locales'
import { resourcesDe as resourcesDeLegend } from '@polar/plugin-legend/src/locales'
import { resourcesDe as resourcesDeLoadingIndicator } from '@polar/plugin-loading-indicator/src/locales'
import { resourcesDe as resourcesDePointerPosition } from '@polar/plugin-pointer-position/src/locales'
import { resourcesDe as resourcesDePins } from '@polar/plugin-pins/src/locales'
import { resourcesDe as resourcesDeRouting } from '@polar/plugin-routing/src/locales'
import { resourcesDe as resourcesDeScale } from '@polar/plugin-scale/src/locales'
import { resourcesDe as resourcesDeToast } from '@polar/plugin-toast/src/locales'
import { resourcesDe as resourcesDeZoom } from '@polar/plugin-zoom/src/locales'

// // // clients // // //

import { dishDe } from '@polar/client-dish/src/locales'
import { dishExportMapDe } from '@polar/client-dish/src/plugins/DishExportMap/locales'
import { dishHeaderDe } from '@polar/client-dish/src/plugins/Header/locales'
import { dishModalDe } from '@polar/client-dish/src/plugins/Modal/locales'
import { meldemichelDe } from '@polar/client-meldemichel/src/locales'
import { meldemichelDe as meldemichelAfmButtonDe } from '@polar/client-meldemichel/src/plugins/AfmButton/locales'
import { snowboxDe } from '@polar/client-snowbox/src/locales'
import { textLocatorDe } from '@polar/client-text-locator/src/locales'
import { textLocatorDe as textLocatorHeaderDe } from '@polar/client-text-locator/src/plugins/Header/locales'
import { geometrySearchDe } from '@polar/client-text-locator/src/plugins/GeometrySearch/locales'

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
        ...dishExportMapDe,
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
      pointerPosition: resourcesDePointerPosition.plugins.pointerPosition,
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
