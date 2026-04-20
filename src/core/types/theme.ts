export interface OklchColor {
	// It is called lch, so you expect that order.
	/* eslint-disable perfectionist/sort-interfaces */
	l: string
	c: string
	h: string
	/* eslint-enable perfectionist/sort-interfaces */
}

export interface KernThemeTree {
	[key: string]: string | KernThemeTree
}

/**
 * Describes the theming options of KERN.
 * The exhaustive list of parameters is documented in `@kern-ux/native`.
 *
 * **About fonts**
 *
 * Please mind that setting a value to `kern.typography.font.family.default`
 * will stop the client from loading the font `Fira Sans` used in the KERN
 * design system. 'inherit' will not work as a value due to technical
 * limitations of the ShadowDOM. To inherit whatever would naturally arrive or
 * is styled on the host node, use `''` (empty string).
 * You may also set `"Fira Sans", sans-serif` (the default value) to this
 * variable in case you already have the font loaded to prevent loading it
 * twice.
 */
export interface KernTheme {
	color: KernThemeTree
	metric: KernThemeTree
	typography: KernThemeTree
}

/**
 * Color expressed as RGB(A).
 */
export interface RgbaColor {
	// It is called rgb(a), so you expect that order.
	/* eslint-disable perfectionist/sort-interfaces */
	r: string
	g: string
	b: string
	a?: string
	/* eslint-enable perfectionist/sort-interfaces */
}

/**
 * A color, provided in one of many possible ways CSS allows.
 */
export type Color = { oklch: OklchColor } | { rgba: RgbaColor } | string

/**
 * An icon.
 */
export type Icon = `kern-icon--${string}` | `kern-icon-fill--${string}`

/**
 * A theme for the POLAR map client.
 */
export interface PolarTheme {
	/**
	 * This color will be defined as `--brand-color-{l,c,h}` CSS variable inside POLAR's shadow DOM.
	 * It can especially be used to define the KERN theme via {@link https://developer.mozilla.org/de/docs/Web/CSS/color_value/oklch | oklch}.
	 */
	brandColor?: OklchColor

	/**
	 * Theme for KERN UX library.
	 */
	kern?: KernTheme
}
