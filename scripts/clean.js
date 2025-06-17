/* eslint-disable no-console */
const { exec } = require('child_process')
const os = require('os')

const isWindows = os.platform() === 'win32'

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
