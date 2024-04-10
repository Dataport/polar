import { Fill, Stroke, Style, Text, Circle } from 'ol/style'
import { Color } from '../../types'

export default function (line: Color, text: Color): Style[] {
    return [
        new Style({
            image: new Circle({
                radius: 5,
                stroke: new Stroke({
                    color: [line.r, line.g, line.b, 1.0],
                    width: 1
                }),
                fill: new Fill({
                    color: [line.r, line.g, line.b, 0.4]
                })
            }),
        }),
        new Style({
            stroke: new Stroke({
                color: [line.r, line.g, line.b, 1.0],
                width: 4
            }),
            text: new Text({
                font: 'bold 10px cursive',
                placement: 'line',
                fill: new Fill({
                    color: [text.r, text.g, text.b, 1.0]
                }),
                stroke: new Stroke({
                    color: [line.r, line.g, line.b, 1.0]
                }),
                offsetY: -5,
            })
        })
    ]
}