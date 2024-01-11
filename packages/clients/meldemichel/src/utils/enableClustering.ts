export const enableClustering = (
  layerConf: Record<string, unknown>[],
  reportServiceId: string | undefined
) => {
  if (reportServiceId) {
    const reportServiceConfiguration = layerConf.find(
      (entry) => entry.id === reportServiceId
    )
    if (!reportServiceConfiguration) {
      console.error(
        `@polar/client-meldemichel: Report service ${reportServiceId} could not be found in service register. Clustering has not been activated.`
      )
      return
    }
    /*
     * must be in services.json at start-up;
     * added on the fly since HH services.json is used and can't be edited
     */
    reportServiceConfiguration.clusterDistance = 40
  }
}
