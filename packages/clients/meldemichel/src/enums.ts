// SKAT modeled by their ID; no semantic value for client
/* eslint-disable @typescript-eslint/naming-convention */

export const MODE = {
  // display everything
  COMPLETE: 'COMPLETE',
  // do not display AfmButton, reports, filter, list
  REPORT: 'REPORT',
  /* do not display AfmButton, reports, filter, list
   * do display a single (maybe movable) feature */
  SINGLE: 'SINGLE',
} as const

/* SKAT tend to change; do not hard-code anything regarding them;
 * they have no semantic but their ID within this client */
export const SKAT = [
  '100',
  '101',
  '102',
  '103',
  '104',
  '105',
  '106',
  '111',
  '112',
  '113',
  '114',
  '115',
  '116',
  '117',
  '118',
  '119',
  '120',
  '200',
  '202',
  '203',
  '204',
  '205',
  '400',
  '401',
  '402',
  '500',
  '501',
  '502',
  '503',
] as const

export const REPORT_STATUS = ['In Bearbeitung', 'abgeschlossen'] as const

export const TIME_FILTER = {
  NONE: 0,
  DAYS_7: 1,
  DAYS_30: 2,
  SELECTABLE: 3,
} as const
