import { rawLayerList } from '@masterportal/masterportalapi'

export async function fetchServiceRegister(url: string) {
	return await new Promise<Record<string, unknown>[]>((resolve) =>
		rawLayerList.initializeLayerList(url, resolve)
	)
}
