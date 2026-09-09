import type { DrawMode, EditMode } from '../types'

export const drawModeIcon = (drawMode: DrawMode) => {
	switch (drawMode) {
		case 'Point':
			// case 'MultiPoint':
			return 'kern-icon kern-icon--scatter-plot'
		case 'LineString':
			// case 'MultiLineString':
			return 'kern-icon kern-icon--polyline'
		case 'Polygon':
			// case 'MultiPolygon':
			return 'kern-icon kern-icon--hexagon'
		case 'Circle':
			return 'kern-icon kern-icon--app-badging'
		case 'Text':
			return 'kern-icon kern-icon--insert-text'
		default:
			return 'kern-icon kern-icon--brush'
	}
}

export const editModeIcon = (editMode: EditMode) => {
	switch (editMode) {
		case 'modify':
			return 'kern-icon kern-icon--edit'
		case 'translate':
			return 'kern-icon kern-icon--open-with'
		case 'duplicate':
			return 'kern-icon kern-icon--content-copy'
		case 'cut':
			return 'kern-icon kern-icon--content-cut'
		case 'lasso':
			return 'kern-icon kern-icon--lasso-select'
		case 'merge':
			return 'kern-icon kern-icon--merge'
		default:
			return 'kern-icon kern-icon--edit'
	}
}

export const deleteIcon = 'kern-icon kern-icon--delete'

export const downloadIcon = 'kern-icon kern-icon--download'

export const uploadIcon = 'kern-icon kern-icon--upload'
