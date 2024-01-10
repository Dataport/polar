// adapting rules to match original file
/* eslint-disable tsdoc/syntax */
/* eslint-disable @typescript-eslint/naming-convention */

import { MasterportalapiPolygonFillHatch } from '@polar/lib-custom-types'

/*
 * Polygon hatches from @masterportal/masterportalapi@2.31.0.
 * Small adaptations have been made to fit markers.
 * Licensed under MIT by Freie und Hansestadt Hamburg, Landesbetrieb Geoinformation und Vermessung.
 * Project: https://bitbucket.org/geowerkstatt-hamburg/masterportalapi
 * NOTE we can replace this file with a direct import after updating
 *      to a version supporting this feature, hence only minimal adaptation
 */

// pattern library – default draw instructions as described in style.json.md
const diagonal = {
  draw: [
    {
      type: 'line',
      parameters: [
        [1, -0.5],
        [-0.5, 1],
      ],
    },
    {
      type: 'line',
      parameters: [
        [1.5, 0],
        [0, 1.5],
      ],
    },
  ],
}
const zigLine = {
  draw: [
    {
      type: 'line',
      parameters: [
        [0, -0.25],
        [0.75, 0.5],
        [0, 1.25],
      ],
    },
  ],
}
const namedHatches = {
  diagonal,
  'zig-line': zigLine,
  'diagonal-right': { ...diagonal, rotate: 90 },
  'zig-line-horizontal': { ...zigLine, rotate: 90 },
  rectangle: {
    draw: [
      {
        type: 'rect',
        parameters: [
          [0.125, 0.125, 0.25, 0.25],
          [0.625, 0.625, 0.25, 0.25],
        ],
      },
    ],
  },
  triangle: {
    draw: [
      {
        type: 'line',
        parameters: [
          [0.25, 0],
          [0.5, 0.5],
          [0, 0.5],
          [0.25, 0],
        ],
      },
      {
        type: 'line',
        parameters: [
          [0.75, 0.5],
          [1, 1],
          [0.5, 1],
          [0.75, 0.5],
        ],
      },
    ],
  },
  diamond: {
    draw: [
      {
        type: 'line',
        parameters: [
          [0.25, 0],
          [0.5, 0.25],
          [0.25, 0.5],
          [0, 0.25],
          [0.25, 0],
        ],
      },
      {
        type: 'line',
        parameters: [
          [0.75, 0.5],
          [1, 0.75],
          [0.75, 1],
          [0.5, 0.75],
          [0.75, 0.5],
        ],
      },
    ],
  },
  circle: {
    draw: [
      {
        type: 'arc',
        parameters: [
          0.25,
          0.25,
          ({ size, lineWidth }) => (size - 2 * lineWidth) / 4,
        ],
      },
      {
        type: 'arc',
        parameters: [
          0.75,
          0.75,
          ({ size, lineWidth }) => (size - 2 * lineWidth) / 4,
        ],
      },
    ],
  },
}

/**
 * Determines the absolute position of a relative segment coordinate.
 * @param {Number} size side length of context
 * @returns {Function} gets absolute position in context (x or y)
 */
function makeCalculateAbsolutePosition(size) {
  return (relativePosition) => relativePosition * size
}

/**
 * Draws a singular draw instruction to context, i.e., a single line, rect, or arc.
 * @param {CanvasRenderingContext2D} context draw context
 * @param {Number} size side length of context
 * @param {Object} segment draw segment, i.e. a singular draw instruction
 * @param {('rect'|'line'|'arc')} segment.type what kind of segment it is
 * @param {Array} segment.parameters type-specific parameters, see style.json.md
 * @returns {void} side-effect on context
 */
function drawSegment(context, size, { type, parameters }) {
  const calculateAbsolutePosition = makeCalculateAbsolutePosition(size)

  context.beginPath()

  if (type === 'rect') {
    parameters.forEach((rect) =>
      context.rect(...rect.map(calculateAbsolutePosition))
    )
  } else if (type === 'line') {
    const [start, ...waypoints] = parameters

    context.moveTo(...start.map(calculateAbsolutePosition))
    waypoints.forEach((waypoint) =>
      context.lineTo(...waypoint.map(calculateAbsolutePosition))
    )
  } else if (type === 'arc') {
    const [x, y, getRadiusOrRadius, startAngle, endAngle, counterclockwise] =
      parameters
    const radius =
      typeof getRadiusOrRadius === 'function'
        ? getRadiusOrRadius({ size, lineWidth: context.lineWidth })
        : getRadiusOrRadius

    context.arc(
      makeCalculateAbsolutePosition(size)(x),
      makeCalculateAbsolutePosition(size)(y),
      radius,
      // default to full circle
      startAngle || 0,
      endAngle || 2 * Math.PI,
      counterclockwise || false
    )
  } else {
    console.error(
      `@polar/core: Unknown segment type "${type}". Skipping segment.`
    )

    return
  }

  context.stroke()
}

/**
 * Rotates a given context of side length "size" by "degrees" around its center.
 * Normally, rotation would happen based on the top left corner.
 * @param {CanvasRenderingContext2D} context draw context
 * @param {Number} size side length of context
 * @param {Number} [degrees=90] degrees to rotate context by
 * @returns {void} side-effect on context
 */
function rotateContextCenter(context, size, degrees = 90) {
  const halfSize = 0.5 * size

  context.translate(halfSize, halfSize)
  context.rotate(degrees * (Math.PI / 180))
  context.translate(-halfSize, -halfSize)
}

/**
 * Draws a hatch pattern to the context element.
 * @param {CanvasRenderingContext2D} context draw context
 * @param {Number} size side length of context
 * @param {(("diagonal"|"zig-line"|"diagonal-right"|"zig-line-horizontal"|"rectangle"|"triangle"|"diamond"|"circle")|Object)} pattern Name of pattern library object, or draw instructions as described in style.json.md
 * @returns {void} side-effect on context
 */
function drawHatch(context, size, pattern) {
  const hatchDefinition =
    typeof pattern === 'string' ? namedHatches[pattern] : pattern

  if (hatchDefinition) {
    const { draw, rotate } = hatchDefinition

    if (draw) {
      draw.forEach((segment) => drawSegment(context, size, segment))
    }

    if (rotate) {
      rotateContextCenter(context, size, rotate)
    }
  } else {
    console.error(
      `@polar/core: Unknown polygon style "${pattern}". Skipping hatching.`
    )
  }
}

/**
 * Generates a polygon fill pattern.
 * @param {object} params parameters as defined in style.json.md#Polygon.polygonFillHatch
 * @returns {HTMLCanvasElement} contains polygon fill pattern
 */
export function getPolygonFillHatch({
  pattern = 'diagonal',
  size = 30,
  lineWidth = 10,
  backgroundColor = [0, 0, 0, 1],
  patternColor = [255, 255, 255, 1],
}: MasterportalapiPolygonFillHatch): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d') as CanvasRenderingContext2D

  canvas.width = size
  canvas.height = size

  context.fillStyle = `rgba(${backgroundColor.join(',')})`
  context.fillRect(0, 0, canvas.width, canvas.height)

  context.lineWidth = lineWidth
  context.strokeStyle = `rgba(${patternColor.join(',')})`

  drawHatch(context, size, pattern)

  context.fillStyle = context.createPattern(canvas, 'repeat') as CanvasPattern

  return canvas
}
