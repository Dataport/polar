import { notifyUser } from '@/lib/notifyUser.ts'

export function handleErrors(error: unknown) {
	let errorMessage = ''
	if (error instanceof Error) {
		errorMessage = error.message
		console.error(error.message)
	} else {
		console.error('Unexpected error', error)
	}
	notifyUser('error', errorMessage)
}
