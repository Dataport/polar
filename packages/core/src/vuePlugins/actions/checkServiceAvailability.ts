import i18next from 'i18next'
import { ping } from '@masterportal/masterportalapi'
import {
  CoreGetters,
  CoreState,
  PolarActionContext,
  PolarError,
  PolarStore,
} from '@polar/lib-custom-types'
import { ServiceAvailabilityCheck } from '../../types'

export default function (
  this: PolarStore<CoreState, CoreGetters>,
  { commit, state, getters }: PolarActionContext<CoreState, CoreGetters>
) {
  state.configuration.layerConf
    .map(
      (service): ServiceAvailabilityCheck => ({
        ping: ping(service),
        service,
      })
    )
    .forEach(({ ping, service }) =>
      ping
        .then((statusCode) => {
          if (statusCode !== 200) {
            // NOTE more output channels? make configurable.
            if (this.hasModule(['plugin', 'toast'])) {
              this.dispatch('plugin/toast/addToast', {
                type: 'warning',
                text: i18next.t('error.serviceUnavailable', {
                  serviceId: service.id,
                  serviceName: service.name,
                }),
              })
            }
            // always print status code for debugging purposes
            console.error(
              `@polar/core: Ping to "${service.id}" returned "${statusCode}".`
            )
            // always add to error log for listener purposes
            commit('setErrors', [
              ...getters.errors,
              {
                type: 'connection',
                statusCode,
                text: `Ping to "${service.id}" returned "${statusCode}".`,
              } as PolarError,
            ])
          }
        })
        .catch((e) => console.error('@polar/core', e))
    )
}
