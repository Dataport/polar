import { readFileSync, existsSync } from 'node:fs'

let config = JSON.parse(readFileSync('.husky/defaults.json').toString())
if (existsSync('git-hooks.config.json')) {
	config = {
		...config,
		...JSON.parse(readFileSync('git-hooks.config.json').toString()),
	}
}

Object.entries(config).forEach(([key, value]) => {
	const formattedKey =
		'POLAR_' + key.replace(/[A-Z]/g, (m) => '_' + m.toLowerCase()).toUpperCase()
	if (process.env[formattedKey]) {
		const envValue = process.env[formattedKey]
		if (['yes', 'YES', 'true', 'TRUE', '1', 'on', 'ON'].includes(envValue)) {
			value = true
		} else if (
			['no', 'NO', 'false', 'FALSE', '0', 'off', 'OFF'].includes(envValue)
		) {
			value = false
		} else {
			process.stderr.write(
				`Expected either "yes" or "no" for ${formattedKey}, got ${envValue}`
			)
			process.exit(1)
		}
	}
	process.stdout.write(`${formattedKey}=${value ? 'yes' : 'no'}\n`)
})
