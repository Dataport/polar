import { alkisWms, basemapGrau } from '../servicesConstants'

export const denkmalAmtLink =
  '<a href="https://www.schleswig-holstein.de/DE/landesregierung/ministerien-behoerden/LD/ld_node.html" target="_blank">Landesamt für Denkmalpflege</a>'

export const vermessungsAmtLink =
  '<a href="https://www.schleswig-holstein.de/DE/landesregierung/ministerien-behoerden/LVERMGEOSH" target="_blank">© Geobasis-DE/LVermGeo SH</a>'

export const attributionsCommon = [
  {
    id: basemapGrau,
    title:
      'Karte Basemap.de (Graustufen): © <a href="https://basemap.de/" target="_blank">basemap.de / BKG</a> <MONTH> <YEAR>',
  },
  {
    id: alkisWms,
    title:
      'Karte Flurstücke gemäss ALKIS-Objektartenkatalog © <a href="https://www.schleswig-holstein.de/DE/landesregierung/ministerien-behoerden/LVERMGEOSH" target="_blank">© Geobasis-DE/LVermGeo SH</a> <MONTH> <YEAR>',
  },
]
