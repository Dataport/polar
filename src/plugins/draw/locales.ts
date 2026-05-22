/* Allowing PascalCase keys for ease of use (using OL entity names here) */
/* eslint-disable @typescript-eslint/naming-convention */

/* eslint-disable tsdoc/syntax */
/**
 * This is the documentation for the locales keys in the draw plugin.
 * These locales are *NOT* exported, but documented only.
 *
 * @module locales/plugins/draw
 */
/* eslint-enable tsdoc/syntax */

import type { Locale } from '@/core'

/**
 * German locales for draw plugin.
 * For overwriting these values, use the plugin's ID as namespace.
 */
export const resourcesDe = {
	mode: {
		none: 'Keine Interaktion',
		draw: 'Zeichnen',
		measure: 'Zeichnen und Messen',
		write: 'Zeichnen und Schreiben',
		writeAndMeasure: 'Zeichnen, Schreiben und Messen',
		lasso: 'Lasso',
		duplicate: 'Duplizieren',
		cut: 'Polygone auftrennen',
		merge: 'Polygone kombinieren',
		edit: 'Bearbeiten',
		translate: 'Verschieben',
		delete: 'Löschen',
	},
	layerSelection: {
		labelPrefix: 'In Bearbeitung: {{layerName}}',
	},
	label: 'Zeichenwerkzeuge',
	drawMode: {
		label: 'Zeichnen',
		Point: 'Punkt',
		MultiPoint: 'Multipunkt',
		LineString: 'Linie',
		MultiLineString: 'Multilinie',
		Polygon: 'Polygon',
		MultiPolygon: 'Multipolygon',
		Circle: 'Kreis',
		Text: 'Text',
	},
	editMode: {
		label: 'Editieren',
		modify: 'Modifizieren',
		translate: 'Verschieben',
		duplicate: 'Duplizieren',
		cutPolygon: 'Polygon auftrennen',
		cutMultiPolygon: 'Multipolygon auftrennen',
		cutLine: 'Linie auftrennen',
		cutMultiLine: 'Multilinie auftrennen',
	},
	propertyMode: {
		label: 'Eigenschaften',
		attributes: 'Attribute',
		style: 'Aussehen',
		measurements: 'Längen- und Flächenmaße',
	},
	measurements: {
		none: 'Keine Messung',
		metres: 'm',
		metresArea: 'm / m²',
		kilometres: 'km',
		kilometresArea: 'km / km²',
		hectares: 'km / ha',
	},
	delete: {
		label: 'Löschen',
	},
	save: {
		label: 'Speichern',
	},
	upload: {
		label: 'Importieren',
	},
	downloadFormat: {
		label: 'Exportieren',
		geojson: 'GeoJSON',
	},
	measureMode: {
		none: 'Keine Messung',
		metres: 'm',
		metresArea: 'm / m²',
		kilometres: 'km',
		kilometresArea: 'km / km²',
		hectares: 'km / ha',
	},
	metaInformationRetrieval: {
		errorToast:
			'Der Bezug von Metadaten zur gezeichneten Geometrie ist fehlgeschlagen. Die Geometrie wird ohne Metadaten weitergereicht.',
	},
	options: {
		stroke: 'Linienfarbe',
	},
	title: {
		drawMode: 'Zeichenmodus',
		mode: 'Modus',
		measureMode: 'Messmodus',
		options: 'Zeichenoptionen',
	},
	labelll: {
		textSize: 'Textgröße (px) wählen:',
	},
	lasso: {
		layerRejected:
			'Die Antwort des Layers "{{id}}" konnte nicht gelesen werden. Es wurden keine Geometrien aus diesem Layer bezogen.',
		internalError:
			'Ein unerwarteter Fehler ist in der Verarbeitung der Lasso-Daten aufgetreten.',
	},
	cut: {
		error: {
			cutFailed:
				'Das Polygon konnte aufgrund eines unbekannten Fehlers leider nicht geschnitten werden.',
		},
		warn: {
			unevenCut:
				'Leider konnte kein Schnitt hergestellt werden, da entweder der Start- oder Endpunkt der Schnittkante innerhalb des zu schneidenden Polygons lag, oder kein Polygon geschnitten wurde. Bitte versuchen Sie es erneut.',
		},
	},
} as const

/**
 * English locales for draw plugin.
 * For overwriting these values, use the plugin's ID as namespace.
 * // TODO: currently only changing resourcesDe, this will have to be adapted once done
 */
export const resourcesEn = {
	mode: {
		none: 'No interaction',
		draw: 'Draw',
		measure: 'Draw and measure',
		write: 'Draw and write',
		writeAndMeasure: 'Draw, write and measure',
		lasso: 'Lasso',
		duplicate: 'Duplicate',
		cut: 'Split polygons',
		merge: 'Combine polygons',
		edit: 'Edit',
		translate: 'Move',
		delete: 'Delete',
	},
	layerSelection: {
		labelPrefix: 'Editing: {layerName}',
	},
	label: 'Drawing tools',
	drawMode: {
		label: 'Draw',
		point: 'Point',
		multiPoint: 'Multipoint',
		lineString: 'Line',
		multiLineString: 'Multiline',
		polygon: 'Polygon',
		multiPolygon: 'Multipolygon',
		circle: 'Circle',
		text: 'Text',
	},
	editMode: {
		label: 'Edit',
		modify: 'Modify',
		translate: 'Move',
		duplicate: 'Duplicate',
		cutPolygon: 'Split polygon',
		cutMultiPolygon: 'Split multipolygon',
		cutLine: 'Split line',
		cutMultiLine: 'Split multiline',
	},
	propertyMode: {
		label: 'Properties',
		attributes: 'Attributes',
		style: 'Appearance',
		measurements: 'Length and area measurements',
	},
	measurements: {
		none: 'No measurement',
		metres: 'm',
		metresArea: 'm / m²',
		kilometres: 'km',
		kilometresArea: 'km / km²',
		hectares: 'km / ha',
	},
	delete: {
		label: 'Delete',
	},
	save: {
		label: 'Save',
	},
	upload: {
		label: 'Import',
	},
	downloadFormat: {
		label: 'Export',
		geojson: 'GeoJSON',
	},
	measureMode: {
		none: 'No measurement',
		metres: 'm',
		metresArea: 'm / m²',
		kilometres: 'km',
		kilometresArea: 'km / km²',
		hectares: 'km / ha',
	},
	metaInformationRetrieval: {
		errorToast:
			'Retrieving metadata for the drawn geometry failed. The geometry will be forwarded without metadata.',
	},
	options: {
		stroke: 'Stroke color',
	},
	title: {
		drawMode: 'Drawing mode',
		mode: 'Mode',
		measureMode: 'Measure mode',
		options: 'Draw options',
	},
	labelll: {
		textSize: 'Choose text size (px):',
	},
	lasso: {
		layerRejected:
			'The response of layer "{{id}}" could not be read. No geometries were fetched from that layer.',
		internalError: 'An unexpected error occurred while processing lasso data.',
	},
	cut: {
		error: {
			cutFailed: 'The polygon could not be split due to an unknown error.',
		},
		warn: {
			unevenCut:
				'No split could be created because either the start or end point of the cutting edge was inside the polygon to split, or no polygon was split. Please try again.',
		},
	},
} as const

/**
 * Draw plugin locales.
 *
 * @privateRemarks
 * The first entry will be used as fallback.
 *
 * @internal
 */
const locales: Locale[] = [
	{
		type: 'de',
		resources: resourcesDe,
	},
	{
		type: 'en',
		resources: resourcesEn,
	},
]

export default locales
