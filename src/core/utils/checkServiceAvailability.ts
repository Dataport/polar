import { ping } from '@masterportal/masterportalapi'
import type { MapConfiguration, ServiceAvailabilityCheck } from '../types'
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
						notifyUser('warning', 'error.serviceUnavailable', {
							serviceId,
							serviceName,
						})

						// always print status code for debugging purposes
						console.error(`Ping to "${serviceId}" returned "${statusCode}".`)
					}
				})
				.catch((e: unknown) => {
					console.error(e)
				})
		})
}
