import { describe, expect, test } from 'vitest'

import { escapeHtml, highlightCode, nextTabId } from './devexBehavior'
import { tabs } from './devexContent'

describe('devexBehavior', () => {
	test('escapes HTML before highlighting code', () => {
		expect(highlightCode('<script>alert("x")</script>')).not.toContain(
			'<script>'
		)
		expect(escapeHtml('&<>')).toBe('&amp;&lt;&gt;')
	})

	test('wraps tab navigation in both directions', () => {
		expect(nextTabId(tabs, 'advanced', 1)).toBe('install')
		expect(nextTabId(tabs, 'install', -1)).toBe('advanced')
	})
})
