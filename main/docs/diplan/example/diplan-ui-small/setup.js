/* this is an example setup function displaying how POLAR is instantiated
 * you may do this in any other format as long as all required contents arrive
 * in `createMap` */
export default (client, layerConf, config) =>
  client
    .createMap(
      {
        // id of div to render in
        containerId: 'polarstern',
        /* see API.md for mapConfiguration options, especially the compiled
         * version at https://dataport.github.io/polar/docs/diplan/client-diplan.html  */
        mapConfiguration: {
          stylePath: '../../dist/polar-client.css',
          layerConf,
          ...config,
        },
      },
      'DIPLAN_SMALL'
    )
    .then((mapInstance) => {
      window.mapInstance = mapInstance
    })
