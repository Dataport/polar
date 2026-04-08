/**
 * Minimal PNG generator — produces single-colour tiles.
 *
 * Used by the mock map server to return visually distinguishable tiles:
 *   • GREEN — request matched an expectation (expected parameters present)
 *   • BLUE  — no expectation matched (default / unknown request)
 *   • RED   — available for custom use (e.g. error cases in tests)
 */

import { deflateSync } from 'node:zlib'

// ### CRC-32 (required by the PNG spec for every chunk) ######################

const crcTable: number[] = []
for (let n = 0; n < 256; n++) {
  let c = n
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  }
  crcTable[n] = c
}

function crc32(buf: Buffer): number {
  let crc = 0xffffffff
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

// ### PNG primitives #########################################################

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

/**
 * Builds one PNG chunk with length, type, payload, and CRC fields.
 * This helper implements the binary chunk format required by the PNG specification.
 *
 * @param type - Four-character PNG chunk type (for example `IHDR`, `IDAT`, or `IEND`).
 * @param data - Raw chunk payload bytes for the given chunk type.
 * @returns A binary buffer containing one complete PNG chunk.
 */
function pngChunk(type: string, data: Buffer): Buffer {
  const typeBuffer = Buffer.from(type, 'ascii')
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  const crcInput = Buffer.concat([typeBuffer, data])
  const crcValue = Buffer.alloc(4)
  crcValue.writeUInt32BE(crc32(crcInput))
  return Buffer.concat([length, typeBuffer, data, crcValue])
}

// ### Public API #############################################################

/**
 * Generates a valid PNG image filled with one solid RGB color.
 * The image is built entirely from PNG primitives using Node built-ins only.
 *
 * @param r - Red channel value in the range 0 to 255.
 * @param g - Green channel value in the range 0 to 255.
 * @param b - Blue channel value in the range 0 to 255.
 * @param width - Output image width in pixels (defaults to 256).
 * @param height - Output image height in pixels (defaults to 256).
 * @returns A `Buffer` containing the encoded PNG file bytes.
 */
export function generatePng(
  r: number,
  g: number,
  b: number,
  width = 256,
  height = 256
): Buffer {
  // IHDR: width(4) + height(4) + bitDepth(1) + colorType(1) + compression(1) + filter(1) + interlace(1)
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 2 // colour type: RGB
  ihdr[10] = 0 // compression method
  ihdr[11] = 0 // filter method
  ihdr[12] = 0 // interlace method

  // Raw image data: each row = 1 filter byte + width × 3 colour bytes
  const rowSize = 1 + width * 3
  const raw = Buffer.alloc(height * rowSize)
  for (let y = 0; y < height; y++) {
    const offset = y * rowSize
    raw[offset] = 0 // filter: None
    for (let x = 0; x < width; x++) {
      const px = offset + 1 + x * 3
      raw[px] = r
      raw[px + 1] = g
      raw[px + 2] = b
    }
  }

  const compressed = deflateSync(raw)

  return Buffer.concat([
    PNG_SIGNATURE,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', compressed),
    pngChunk('IEND', Buffer.alloc(0)),
  ])
}

// ### Pre-generated tiles (cached once at import time) #######################

/** Green 256×256 tile — returned when a request matches an expectation. */
export const GREEN_TILE = generatePng(0, 200, 0)

/** Blue 256×256 tile — returned as fallback when no expectation matches. */
export const BLUE_TILE = generatePng(30, 100, 220)

/** Red 256×256 tile — available for custom error / negative-test responses. */
export const RED_TILE = generatePng(220, 30, 30)
