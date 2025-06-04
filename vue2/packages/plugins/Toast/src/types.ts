import { ToastStyle, ToastType, ToastTypeStyles } from '@polar/lib-custom-types'

/** an instance of a toast, optionally overriding type style */
export interface Toast extends Partial<ToastStyle> {
  /** style to use */
  type: ToastType
  text: string
  /** hide toast after $\{timeout\}ms; 0 means never, user has to click close button */
  timeout?: number
}

export interface ToastState {
  toasts: Toast[]
  types: ToastTypeStyles
}
