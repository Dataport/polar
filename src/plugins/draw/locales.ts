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
	label: 'Zeichenwerkzeuge',
	layerSelection: {
		label: 'Layerauswahl',
	},
	drawMode: {
		label: 'Zeichnen',

		// Allowing PascalCase keys here and later for ease of use (using OL entity names here)
		/* eslint-disable @typescript-eslint/naming-convention */
		Point: 'Punkt',
		LineString: 'Linie',
		Polygon: 'Polygon',
		Circle: 'Kreis',
		Text: 'Text',
		/* eslint-enable @typescript-eslint/naming-convention */
	},
	editMode: {
		label: 'Editieren',
		modify: 'Modifizieren',
		translate: 'Verschieben',
		duplicate: 'Duplizieren',
		cut: 'Polygon auftrennen',
		merge: 'Polygone kombinieren',
		lasso: 'Lasso',
	},
	measurements: {
		label: 'Längen- und Flächenmaße',
		none: 'Keine Messung',
		noneArea: 'Keine Messung',
		metres: 'm',
		metresArea: 'm / m²',
		kilometres: 'km',
		kilometresArea: 'km / km²',
		hectaresArea: 'km / ha',
	},
	delete: {
		label: 'Löschen',
	},
	upload: {
		label: 'Importieren',
	},
	download: {
		label: 'Exportieren',
		geojson: 'GeoJSON',
	},
	revision: {
		autofix: {
			errorToast:
				'Die automatische Geometrie-Reparatur ist fehlgeschlagen, da die eingegebenen Geometrien nicht gültig und nicht reparierbar waren. Dies kann z.B. passieren, wenn Punkte eines Polygons im Bearbeitungsmodus so verschoben werden, dass sie punktförmig werden.',
		},
		metaInformationRetrieval: {
			errorToast:
				'Der Bezug von Metadaten zur gezeichneten Geometrie ist fehlgeschlagen. Die Geometrie wird ohne Metadaten weitergereicht.',
		},
	},
	text: {
		size: 'Textgröße (px)',
		content: 'Textinhalt',
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
	help: {
		text: {
			/* eslint-disable @typescript-eslint/naming-convention */
			Point: 'Punkte setzen.',
			LineString: 'Linien zeichnen.',
			Polygon: 'Polygone zeichnen.',
			Circle:
				'Kreise zeichnen. Der erste Klick fügt einen Mittelpunkt hinzu, der zweite Klick legt den Radius fest.',
			Text: 'Text hinzufügen. Bitte benutzen sie hierfür die untenstehende Eingabemaske. Es können nur Texte hinzugefügt werden, wenn diese nicht leer sind.',
			/* eslint-enable @typescript-eslint/naming-convention */
			modify:
				'Geometrie durch Bewegen, Hinzufügen, und Löschen von Stützpunkten bearbeiten.',
			translate: 'Geometrie ganzheitlich verschieben.',
			duplicate: 'Geometrie duplizieren.',
			cut: 'Polygon auftrennen. Hierzu wird eine Linie gezeichnet, die das Polygon schneidet.',
			merge:
				'Polygone kombinieren, indem ein weiteres Polygon gezeichnet wird. Dieses gezeichnete Polygon wird ebenfalls Teil der Kombination aller berührten Polygone.',
			lasso:
				'Geometrien mit Lasso auswählen und in die Zeichenebene übernehmen.',
			delete: 'Geometrie löschen.',
		},
		tooltip: {
			clickDraw: 'Klick – Punkt setzen',
			clickStart: 'Klick – Startpunkt setzen',
			clickContinue: 'Klick – Zwischenpunkt setzen',
			clickEndPolygon: 'Klick auf Start – Polygon fertigstellen',
			clickEndCircle: 'Klick – Kreis fertigstellen',
			clickEndDouble: 'Doppelklick – Geometrie fertigstellen',
			clickAlt: 'Klick – Eckpunkt entfernen',
			dragLine: 'An Linie ziehen – neuen Zwischenpunkt setzen',
			dragPoint: 'An Punkt ziehen – Punkt bewegen',
			dragVertex: 'An Punkt ziehen – Geometrie anpassen',
			dragMove: 'An Geometrie ziehen – Geometrie verschieben',
			clickDuplicate: 'Klick auf Geometrie – Geometrie duplizieren',
			clickCutStart: 'Klick – Startpunkt Trennlinie setzen',
			clickCut: 'Klick – neuen Zwischenpunkt Trennlinie setzen',
			clickCutFinish:
				'Doppelklick – Endpunkt Trennlinie setzen – Polygon auftrennen',
			clickDelete: 'Klick auf Geometrie – Geometrie löschen',
		},
	},
} as const

/**
 * English locales for draw plugin.
 * For overwriting these values, use the plugin's ID as namespace.
 */
export const resourcesEn = {
	label: 'Drawing tools',
	layerSelection: {
		label: 'Layer selection',
	},
	drawMode: {
		label: 'Draw',
		/* eslint-disable @typescript-eslint/naming-convention */
		Point: 'Point',
		LineString: 'Line',
		Polygon: 'Polygon',
		Circle: 'Circle',
		Text: 'Text',
		/* eslint-enable @typescript-eslint/naming-convention */
	},
	editMode: {
		label: 'Edit',
		modify: 'Modify',
		translate: 'Move',
		duplicate: 'Duplicate',
		cut: 'Split polygon',
		merge: 'Combine polygons',
		lasso: 'Lasso',
	},
	measurements: {
		label: 'Length and area measurements',
		none: 'No measurement',
		noneArea: 'No measurement',
		metres: 'm',
		metresArea: 'm / m²',
		kilometres: 'km',
		kilometresArea: 'km / km²',
		hectaresArea: 'km / ha',
	},
	delete: {
		label: 'Delete',
	},
	upload: {
		label: 'Import',
	},
	download: {
		label: 'Export',
		geojson: 'GeoJSON',
	},
	revision: {
		autofix: {
			errorToast:
				'The automatic geometry repair failed because the entered geometries were not valid and not repairable. This can happen, for example, when points of a polygon are moved in edit mode so that they become point-shaped.',
		},
		metaInformationRetrieval: {
			errorToast:
				'Retrieving metadata for the drawn geometry failed. The geometry is passed on without metadata.',
		},
	},
	text: {
		size: 'Text size (px)',
		content: 'Text content',
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
	help: {
		text: {
			/* eslint-disable @typescript-eslint/naming-convention */
			Point: 'Place points.',
			LineString: 'Draw lines.',
			Polygon: 'Draw polygons.',
			Circle:
				'Draw circles. The first click adds a center point, the second click sets the radius.',
			Text: 'Add text. Please use the input field below for this. Text can only be added if it is not empty.',
			/* eslint-enable @typescript-eslint/naming-convention */
			modify: 'Edit the geometry by moving, adding, and removing vertices.',
			translate: 'Move the geometry as a whole.',
			duplicate: 'Duplicate the geometry.',
			cut: 'Split a polygon. To do this, a line is drawn that intersects the polygon.',
			merge:
				'Combine polygons by drawing another polygon. This drawn polygon also becomes part of the combination of all touched polygons.',
			lasso:
				'Select geometries with the lasso and transfer them into the drawing layer.',
			delete: 'Delete the geometry.',
		},
		tooltip: {
			clickDraw: 'Click – place point',
			clickStart: 'Click – set start point',
			clickContinue: 'Click – set intermediate point',
			clickEndPolygon: 'Click on start – complete polygon',
			clickEndCircle: 'Click – complete circle',
			clickEndDouble: 'Double-click – complete geometry',
			clickAlt: 'Click – remove vertex',
			dragLine: 'Drag on line – set new intermediate point',
			dragPoint: 'Drag on point – move point',
			dragVertex: 'Drag on point – adjust geometry',
			dragMove: 'Drag on geometry – move geometry',
			clickDuplicate: 'Click on geometry – duplicate geometry',
			clickCutStart: 'Click – set start point of cutting line',
			clickCut: 'Click – set new intermediate point of cutting line',
			clickCutFinish:
				'Double-click – set end point of cutting line – split polygon',
			clickDelete: 'Click on geometry – delete geometry',
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
