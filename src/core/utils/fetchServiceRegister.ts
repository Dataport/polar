import { rawLayerList } from '@masterportal/masterportalapi'
import type { MasterportalApiServiceRegister } from '../types'

export async function fetchServiceRegister(url: string) {
	return await new Promise<MasterportalApiServiceRegister>((resolve) =>
		rawLayerList.initializeLayerList(url, resolve)
	)
}
