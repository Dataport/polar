export type EndEventName = 'touchend' | 'mouseup'
export type MoveEventName = 'touchmove' | 'mousemove'
export interface MoveEventNames {
  move: MoveEventName
  end: EndEventName
}
export type PolarMoveEvent = MouseEvent | TouchEvent
