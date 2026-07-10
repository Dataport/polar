import type { MasterportalApiServiceRegister } from '../types'

import { rawLayerList } from '@masterportal/masterportalapi'

export async function fetchServiceRegister(url: string) {
	return await new Promise<MasterportalApiServiceRegister>((resolve) =>
		rawLayerList.initializeLayerList(url, resolve)
	)
}
