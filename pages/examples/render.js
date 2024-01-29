import client from '../node_modules/@polar/client-generic/dist/polar-client.mjs'

const commonParameters = {
  services: 'https://geodienste.hamburg.de/services-internet.json',
  mapConfiguration: {
    epsg: 'EPSG:25832',
    layers: [
      {
        id: '453',
        visibility: true,
        type: 'background',
      },
    ],
    stylePath: '../node_modules/@polar/client-generic/dist/polar-client.css',
  },
}

const makeAsideHtml = (id, name, description, parameterObject, useCases) => `
<h3>${name}</h3>
${(typeof description === 'string' ? [description] : description)
  .map((text) => `<p>${text}</p>`)
  .join('')}
<div id="${id}" style="position:relative;height:300px;width:100%"></div>
<details>
  <summary>View configuration</summary>
  <pre>
    <code>
client.createMap(${JSON.stringify(parameterObject, null, 2)})
    </code>
  </pre>
</details>
${
  !useCases
    ? ''
    : `<h4>Use cases</h4>
<ul>
  ${useCases.map((text) => `<li>${text}</li>`).join('')}
</ul>`
}
`

const nameToId = (name) =>
  name
    .toLowerCase()
    .replaceAll(' & ', '-')
    .replaceAll(' ', '-')
    .replaceAll(',', '')

export default ({
  name,
  description,
  useCases,
  mapConfiguration,
  enabledPlugins,
  postCreation,
  modifyLayerConfiguration,
  services,
}) => {
  const id = nameToId(name)
  const aside = document.createElement('aside')
  aside.style = 'width: 100% !important'
  const parameterObject = {
    ...commonParameters,
    containerId: id,
    enabledPlugins,
    services: services || commonParameters.services,
    mapConfiguration: {
      ...commonParameters.mapConfiguration,
      ...mapConfiguration,
    },
    modifyLayerConfiguration,
  }
  aside.innerHTML = makeAsideHtml(
    id,
    name,
    description,
    parameterObject,
    useCases
  )

  document.getElementById('render-node').appendChild(aside)

  client.createMap(parameterObject).then((mapClient) => {
    if (postCreation) {
      postCreation({ mapClient, id })
    }
  })
}
