export interface OklchColor {
	l: string
	c: string
	h: string
}

export interface KernThemeTree {
	[key: string]: string | KernThemeTree
}

/**
 * Describes the theming options of KERN.
 * The exhaustive list of parameters is documented in `@kern-ux/native`.
 */
export interface KernTheme {
	color: KernThemeTree
	metric: KernThemeTree
}

/**
 * Color expressed as RGB(A).
 */
export interface RgbaColor {
	r: string
	g: string
	b: string
	a?: string
}

/**
 * A color, provided in one of many possible ways CSS allows.
 */
export type Color = { oklch: OklchColor } | { rgba: RgbaColor } | string

/**
 * An icon.
 */
export type Icon = `kern-icon--${string}`

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
