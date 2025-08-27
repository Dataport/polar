export interface LayerConfigurationOptionLayers {
	/**
	 * Legend image to be used for sub-layer. If false, no image is displayed.
	 * If true, it is assumed an image exists in the layer's GetCapabilities, and
	 * that will be used. If Record, it maps the layer name to a linked image.
	 */
	legend?: boolean | Record<string, string>

	/**
	 * Comma-separated re-ordering of service layer's 'layer' specification.
	 * Layer's not specified in service definition, but in order, are initially
	 * invisible. Layers not specified in order, but in service definition, are
	 * always visible. Layers specified in both are initially visible. Layers
	 * specified in neither are always invisible.
	 */
	order?: string

	/**
	 * Title to be displayed for sub-layer. If false, layer name itself will
	 * be used as given in service description 'layers' field. If true, it is
	 * assumed a name exists in the layer's GetCapabilities, and that will be
	 * used. If Record, it maps the layer name to an arbitrary display name given
	 * by the configuration.
	 */
	title?: boolean | Record<string, string>
}

export type LayerType = 'background' | 'mask'

export interface LayerConfigurationOptions {
	/**
	 * Named matching OGC-specification of a WMS layer's layers.
	 */
	layers?: LayerConfigurationOptionLayers
	// NOT IMPLEMENTED
	// transparency: boolean
}

export interface LayerConfiguration {
	/**
	 * Unique id to identify the layer.
	 */
	id: string

	/**
	 * Human-readable identifier and value to be displayed in the UI.
	 */
	name: string

	/**
	 * Whether the layer is a background layer or a feature layer with specific information.
	 */
	type: LayerType

	/**
	 * layers may have their own gfiMode.
	 */
	gfiMode?: 'bboxDot' | 'intersects'

	/**
	 * Whether the mask-layer should be hidden from the LayerChooser selection menu.
	 */
	hideInMenu?: boolean

	/**
	 * The maximum zoom level the layer will be rendered in.
	 *
	 * @defaultValue Number.MAX_SAFE_INTEGER
	 */
	maxZoom?: number

	/**
	 * The minimum zoom level the layer will be rendered in.
	 *
	 * @defaultValue 0
	 */
	minZoom?: number

	/**
	 * Enables a configuration feature for the layer in its selection.
	 */
	options?: LayerConfigurationOptions

	/**
	 * ID of the used style. If the layer is also configured in {@link MapConfiguration.markers | `mapConfiguration.markers`},
	 * that configuration takes precedence over the configured `styleId`. Only applicable for vector-type layers.
	 * For more information and an example see {@link MapConfiguration.featureStyles | `mapConfiguration.featureStyles`}.
	 * Defaults and fallbacks to OpenLayers default styling.
	 */
	styleId?: string

	/**
	 * Whether the layer should be rendered
	 *
	 * @defaultValue false
	 */
	visibility?: boolean
}
