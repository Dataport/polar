export const PluginId = 'layerChooser'

export interface LayerOptions {
	/**
	 * Name to be displayed in the layer options menu.
	 * Maps to the title received from the GetCapabilities request or the
	 * layer name if not configured or not part of the response.
	 */
	displayName: string

	/**
	 * Image to be displayed for the layer in the layer options menu.
	 * Maps to the legend image requested from the legend URL received from the
	 * GetCapabilities request. If not configured or not part of the response,
	 * this value is null so no image is displayed.
	 */
	layerImage: string | null

	/**
	 * Technical layer name.
	 */
	layerName: string
}
