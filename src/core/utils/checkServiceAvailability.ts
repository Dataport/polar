import { ping } from '@masterportal/masterportalapi'
import type { MapConfiguration, ServiceAvailabilityCheck } from '../types'

export function checkServiceAvailability(
	configuration: MapConfiguration,
	register: Record<string, unknown>[]
) {
	configuration.layers
		.map(({ id }) => ({
			id,
			service: register.find(({ id: serviceId }) => serviceId === id),
		}))
		.filter(
			(
				service
			): service is { id: string; service: Record<string, unknown> } => {
				if (!service.service) {
					console.warn(
						`Service with id "${service.id}" not found in service register.`
					)
					return false
				}
				return true
			}
		)
		.map(
			({ service }): ServiceAvailabilityCheck => ({
				ping: ping(service),
				serviceId: service.id as string,
				serviceName: service.name as string,
			})
		)
		.forEach(({ ping, serviceId /*, serviceName */ }) => {
			ping
				.then((statusCode) => {
					if (statusCode !== 200) {
						// TODO: Uncomment when toast plugin is implemented
						/* const toastStore = plugins.value.find(
							({ id }) => id === 'toast'
						)?.storeModule
						if (toastStore) {
							toastStore().addToast({
								type: 'warning',
								text: i18next.t('error.serviceUnavailable', {
									serviceId,
									serviceName,
								}),
							})
						} */
						// always print status code for debugging purposes
						console.error(`Ping to "${serviceId}" returned "${statusCode}".`)
					}
				})
				.catch((e: unknown) => {
					console.error(e)
				})
		})
}
