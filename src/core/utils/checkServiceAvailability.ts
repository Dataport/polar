import { ping } from '@masterportal/masterportalapi'
import { t } from 'i18next'
import { computed } from 'vue'
import type { MapConfiguration, ServiceAvailabilityCheck } from '../types'
import { useMainStore } from '../stores/main'
import { notifyUser } from '@/lib/notifyUser'

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
		.forEach(({ ping, serviceId, serviceName }) => {
			ping
				.then((statusCode) => {
					if (statusCode !== 200) {
						notifyUser(
							'warning',
							computed(() => {
								const mainStore = useMainStore()

								// This reactive value needs to recompute on language changes.
								// eslint-disable-next-line @typescript-eslint/no-unused-expressions
								mainStore.language

								return t(($) => $.error.serviceUnavailable, {
									ns: 'core',
									serviceId,
									serviceName,
								})
							})
						)

						// always print status code for debugging purposes
						console.error(`Ping to "${serviceId}" returned "${statusCode}".`)
					}
				})
				.catch((e: unknown) => {
					console.error(e)
				})
		})
}
