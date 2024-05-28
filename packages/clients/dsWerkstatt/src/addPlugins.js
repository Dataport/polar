import { NineLayoutTag } from '@polar/core'
import AddressSearch from '@polar/plugin-address-search'
import Attributions from '@polar/plugin-attributions'
import Gfi from '@polar/plugin-gfi'
import IconMenu from '@polar/plugin-icon-menu'
// import LayerChooser from '@polar/plugin-layer-chooser'
import LoadingIndicator from '@polar/plugin-loading-indicator'
import Pins from '@polar/plugin-pins'
import Scale from '@polar/plugin-scale'
import Toast from '@polar/plugin-toast'

export function addPlugins(polarCore) {
  polarCore.addPlugins([
    IconMenu({
      /*
        TODO: IconMenu soll
          - sichtbare UI besitzen
          - LayerChooser eingebunden haben
          - LayerChooser initial geöffnet haben
       */
      layoutTag: NineLayoutTag.TOP_RIGHT,
    }),
    AddressSearch({
      /*
        TODO: AddressSearch soll
          - sichtbare UI besitzen
          - LoadingIndicator triggern können
        NOTE: 'searchMethods' kann hier definiert werden, in der Regel geschieht dies allerdings in der mapConfiguration
       */
      layoutTag: NineLayoutTag.TOP_LEFT,
    }),
    Pins({
      // TODO: Pins soll auf die Ergebnisse von AddressSearch reagieren
    }),
    Attributions({
      /*
        TODO: Attributions soll
          - sichtbare UI besitzen
          - auf Änderungen des ZoomLevels, der aktiven Hintergrundlayer (type 'background') und aktiven Fachdatenlayer (type 'mask') reagieren
       */
      layoutTag: NineLayoutTag.BOTTOM_RIGHT,
    }),
    Gfi({
      /*
        TODO: Gfi soll
          - (optional) sichtbare UI besitzen
          - auf Ergebnisse von AddressSearch reagieren
        NOTE: 'layers' kann hier definiert werden, in der Regel geschieht dies allerdings in der mapConfiguration
       */
      layoutTag: NineLayoutTag.TOP_LEFT,
    }),
    LoadingIndicator({
      // TODO: LoadingIndicator soll sichtbare UI besitzen
      layoutTag: NineLayoutTag.MIDDLE_MIDDLE,
    }),
    Scale({
      // TODO: Scale soll sichtbare UI besitzen
      layoutTag: NineLayoutTag.BOTTOM_RIGHT,
    }),
    Toast({
      // TODO: Toast soll sichtbare UI besitzen
      layoutTag: NineLayoutTag.BOTTOM_MIDDLE,
    }),
  ])
}
