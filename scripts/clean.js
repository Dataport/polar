/* eslint-disable no-console */
import { exec } from 'child_process'
import os from 'os'

const isWindows = os.platform() === 'win32'

// TODO: This needs updating as the node_modules folders in packages are not removed
async function clean() {
	if (isWindows) {
		await exec('rmdir /s /q node_modules')
		console.log('node_modules were purged.')
		return
	}
	await exec('rm -rf node_modules')
	console.log('node_modules were purged.')
}
clean()
