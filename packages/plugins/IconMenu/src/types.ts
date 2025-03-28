import { Menu } from '@polar/lib-custom-types'
import { VueConstructor } from 'vue'

export interface IconMenuState {
  menus: Menu[]
  open: number | null
}

export interface IconMenuGetters extends IconMenuState {
  buttonComponent: VueConstructor | null
  initiallyOpen: string
}
