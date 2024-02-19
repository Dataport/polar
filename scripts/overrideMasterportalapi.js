/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */

/*
 * NOTE
 *
 * In current masterportalapi versions, this behaviour can be configured.
 * Since it currently can't, we'll deactive the wildcard on street names. It
 * may lead to notoriously bad results on an address search without further
 * filtering, e.g. "Roonstraße" will first result in the "Liliencronstraße",
 * which is about as confusing as it gets.
 *
 * On an update to the masterportalapi, we may make use of this by first
 * running on the method without wildcard and, if no results came in, with
 * wildcard.
 */

const fs = require('fs')

const filePath =
  './node_modules/@masterportal/masterportalapi/src/searchAddress/searchGazetteer.js'

fs.readFile(filePath, { encoding: 'utf8' }, function (err, data) {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  const override = data.replaceAll('strassenname=*', 'strassenname=')
  fs.writeFile(filePath, override, 'utf8', function (err) {
    if (err) {
      console.error(err)
      process.exit(2)
    }
    console.log(
      'The masterportalapi override was executed. (scripts/overrideMasterportalapi.js)'
    )
  })
})
