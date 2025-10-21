import { ping } from '@masterportal/masterportalapi'
import { t } from 'i18next'
import type {
	MapConfiguration,
	MasterportalApiServiceRegister,
	ServiceAvailabilityCheck,
} from '../types'
import { notifyUser } from '@/lib/notifyUser'

export function checkServiceAvailability(
	configuration: MapConfiguration,
	register: MasterportalApiServiceRegister
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
						notifyUser('warning', () =>
							t(($) => $.error.serviceUnavailable, {
								ns: 'core',
								serviceId,
								serviceName,
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
