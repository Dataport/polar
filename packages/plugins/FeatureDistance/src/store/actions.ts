import { PolarActionTree } from '@polar/lib-custom-types'
import { FeatureDistanceGetters, FeatureDistanceState, Mode, Unit, Color, MeasureMode } from '../types'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector';
import { Interaction } from 'ol/interaction'
import createInteractions from './createInteractions'
import createDeleteInteraction from './createInteractions/createDeleteInteraction'
import createStyleFunc from './createStyles'
import Feature from 'ol/Feature';

export const makeActions = () => {
    let interactions: Interaction[] = []
    const drawSource = new VectorSource()
    let drawLayer = new VectorLayer({source: drawSource})
  
    const actions: PolarActionTree<FeatureDistanceState, FeatureDistanceGetters> = {
        createDeleteInteraction,
        createInteractions,
        createStyleFunc,
        setupModule({dispatch, rootGetters: { map }}) { 
            map.addLayer(drawLayer);
            dispatch('updateInteractions');
        },
        setLineColor({ commit, dispatch }, color: Color) {
            commit('setColor', color);
            dispatch('updateInteractions');
        },
        setTextColor({ commit, dispatch }, color: Color) {
            commit('setTextColor', color);
            dispatch('updateInteractions');
        },
        setMode({ commit, dispatch }, mode: Mode) {
            commit('setMode', mode);
            dispatch('updateInteractions');
        },
        setMeasureMode({ commit, dispatch }, measureMode) {
            commit('setMeasureMode', measureMode);
            dispatch('updateInteractions');
        },
        setUnit({ commit, dispatch }, unit: Unit) {
            commit('setUnit', unit);
            dispatch('updateInteractions');
        },
        setSelectedFeature({ commit }, feature: Feature | null) {
            commit('setSelectedFeature', feature);
            commit('setGeometry');
            commit('setSelectedUnit');
            commit('setMeasure');
        },
        clearLayer() {
            drawSource.clear();
        },
        async updateInteractions({ dispatch, rootGetters: { map }, }) {
            interactions.forEach((interaction) => map.removeInteraction(interaction))
            interactions = await dispatch('createInteractions', drawLayer )
            interactions.forEach((interaction) => { map.addInteraction(interaction) });
        },
    }
    return actions;
}
  