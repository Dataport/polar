import { readFileSync, existsSync } from 'node:fs'

let config = JSON.parse(readFileSync('.husky/defaults.json').toString())
if (existsSync('git-hooks.config.json')) {
	config = {
		...config,
		...JSON.parse(readFileSync('git-hooks.config.json').toString()),
	}
}

function formatKey(key) {
	return (
		'POLAR_' + key.replace(/[A-Z]/g, (m) => '_' + m.toLowerCase()).toUpperCase()
	)
}

function getEnvValue(key) {
	if (!process.env[key]) {
		return null
	}
	const envValue = process.env[key]
	if (['yes', 'YES', 'true', 'TRUE', '1', 'on', 'ON'].includes(envValue)) {
		return true
	} else if (
		['no', 'NO', 'false', 'FALSE', '0', 'off', 'OFF'].includes(envValue)
	) {
		return false
	}
	process.stderr.write(
		`Expected either "yes" or "no" for ${key}, got ${JSON.stringify(envValue)}`
	)
	process.exit(1)
}

Object.entries(config).forEach(([key, value]) => {
	const formattedKey = formatKey(key)
	const effectiveValue = getEnvValue(formattedKey) ?? value
	process.stdout.write(`${formattedKey}=${effectiveValue ? 'yes' : 'no'}\n`)
})
