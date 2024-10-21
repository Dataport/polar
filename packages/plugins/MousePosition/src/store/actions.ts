import { PolarActionTree } from '@polar/lib-custom-types'
// import MousePosition from 'ol/control/MousePosition.js'
import { createStringXY } from 'ol/coordinate.js'
import { transform } from 'ol/proj'

const actions: PolarActionTree<DrawState, DrawGetters> = {
  setupModule({ rootGetters: { configuration, map }, commit, getters }) {
    console.error(configuration)
    const projectionsFromMapConfig = configuration.namedProjections.map(
      (x) => x[0]
    )
    console.error(projectionsFromMapConfig)
    // TODO: bei nur einer projection soll das tool nicht angezeigt werden, 0 wirft Fehler in Konsole
    commit('setProjections', projectionsFromMapConfig)
    console.error(getters.projections)
    const formatCoordinate = createStringXY(4)
    map.on('pointermove', function (event) {
      const formattedCoordinate = formatCoordinate(event.coordinate)
      commit('setMousePosition', formattedCoordinate)
      console.error(getters.mousePosition)
    })
    commit('setSelectedProjection', configuration.epsg)
    console.error(getters.selectedProjection)
  },

  selectProjection({ rootGetters: { map }, commit, getters }, newProjection) {
    console.error('method selectProjection was called')
    console.error(getters.selectedProjection, newProjection)
    const formatCoordinate = createStringXY(4)
    map.on('pointermove', function (event) {
      console.error(isFinite(event.coordinate[0]))
      const almostNewCoordinate = event.coordinate
      const newCoordinate = transform(
        almostNewCoordinate,
        getters.selectedProjection,
        newProjection)
      const formattedCoordinate = formatCoordinate(newCoordinate)
      commit('setMousePosition', formattedCoordinate)
      console.error('EventListener wurde ausgeführt', getters.mousePosition)
    })
    console.error(getters.mousePosition)
    commit('setSelectedProjection', newProjection)
    console.error(getters.selectedProjection)

    /* const extend = map.getView().calculateExtent()
    console.error(extend)

    const extendNewProj = transformExtent(
      extend,
      getters.selectedProjection,
      newProjection
    )
    console.error(extendNewProj)
  }, */
  },
}

export default actions
