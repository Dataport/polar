/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

/* This script adds a missing `:host` prefix to a CSS file. */

const fs = require('fs')
const path = require('path')
const fsOptions = { encoding: 'utf8' }

const sourceFile = '../../../node_modules/diplanung-style/dist/style.css'
const targetFile = './assets/dist/diplanStyle.css'
const targetDirname = path.dirname(targetFile)

const originalCss = fs.readFileSync(sourceFile, fsOptions)

const targetFileContent = `:host,${originalCss}`

if (!fs.existsSync(targetDirname)) {
  fs.mkdirSync(targetDirname, { recursive: true })
}
fs.writeFileSync(targetFile, targetFileContent, fsOptions)
