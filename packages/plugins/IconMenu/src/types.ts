import { Menu } from '@polar/lib-custom-types'

export interface IconMenuState {
  menus: Menu[]
  open: number | null
}

export interface IconMenuGetters extends IconMenuState {
  initiallyOpen: string
}
