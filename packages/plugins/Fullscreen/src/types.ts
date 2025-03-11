export interface FullscreenState {
  isInFullscreen: boolean
}

export interface FullscreenGetters extends FullscreenState {
  renderType: 'iconMenu' | 'independent'
  targetContainerId: string
  targetContainer: Element
}
