<template>
  <div
    class="polar-move-handle"
    tabindex="0"
    @focus="moveHandle($event.key)"
    @keydown="moveHandle($event.key)"
    @mousedown.stop="onMouseDown"
    @touchstart.stop="onTouchStart"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { MoveEventName, MoveEventNames, PolarMoveEvent } from './types'

function dimensionValidator(val): boolean {
  return !isNaN(val) && typeof val === 'number' && val >= 0
}

export default Vue.extend({
  name: 'MoveHandle',
  props: {
    minHeight: {
      type: Number,
      default: 0.1,
      validator: dimensionValidator,
    },
    maxHeight: {
      type: Number,
      default: 1,
      validator: dimensionValidator,
    },
  },
  data: () => ({
    handleElement: null as unknown as HTMLElement,
    initialCursorY: 0,
    isMoving: false,
    preMoveHandleTop: 0,
    touchDevice: false,
    timeoutReference: 0,
  }),
  computed: {
    moveEventNames(): MoveEventNames {
      return this.touchDevice
        ? { move: 'touchmove', end: 'touchend' }
        : { move: 'mousemove', end: 'mouseup' }
    },
  },
  watch: {
    isMoving(newValue: boolean): void {
      const { move, end } = this.moveEventNames

      if (newValue) {
        this.handleElement.classList.add('polar-move-handle-is-moving')
        document.addEventListener<MoveEventName>(move, this.onMove)
        document.addEventListener(end, this.onMoveEnd, { once: true })
        return
      }
      this.handleElement.classList.remove('polar-move-handle-is-moving')
      document.removeEventListener<MoveEventName>(move, this.onMove)
      document.removeEventListener(end, this.onMoveEnd)
    },
    maxHeight(newValue: number, oldValue: number): void {
      // reset position if content shrank
      if (newValue < oldValue) {
        this.savePreMoveHandleTop()
        this.setNewPosition(0)
      }
    },
  },
  mounted() {
    if (this.$el.parentElement) {
      this.handleElement = this.$el.parentElement
      return
    }
    console.error(
      'MoveHandle: No parent element used, using MoveHandle container.'
    )
    this.handleElement = this.$el as HTMLElement
  },
  methods: {
    moveHandle(key: string): void {
      if (key === 'ArrowUp' || key === 'ArrowDown') {
        this.savePreMoveHandleTop()
        this.setNewPosition(key === 'ArrowUp' ? -5 : 5)
      }
    },
    onMouseDown(event: PolarMoveEvent) {
      this.touchDevice = false
      this.startMoving(event)
    },
    onMove(event: PolarMoveEvent): void {
      const clientX =
        event instanceof MouseEvent ? event.clientX : event.touches[0].clientX
      const clientY =
        event instanceof MouseEvent ? event.clientY : event.touches[0].clientY
      const deltaY = clientY - this.initialCursorY

      if (
        clientX < 0 ||
        clientX > window.innerWidth ||
        clientY < 0 ||
        clientY > window.innerHeight
      ) {
        this.isMoving = false
      }
      this.setNewPosition(deltaY)
    },
    onMoveEnd(): void {
      this.isMoving = false
    },
    onTouchStart(event: PolarMoveEvent): void {
      this.touchDevice = true
      this.startMoving(event)
    },
    saveInitialCursorCoordinates(event: PolarMoveEvent): void {
      this.initialCursorY =
        event instanceof MouseEvent ? event.clientY : event.touches[0].clientY
    },
    savePreMoveHandleTop(): void {
      this.preMoveHandleTop = this.handleElement.offsetTop
    },
    setNewPosition(deltaY: number): void {
      const containerHeight = this.$root.$el.clientHeight
      let newTop = Math.round(this.preMoveHandleTop + deltaY)

      if (containerHeight - newTop < containerHeight * this.minHeight) {
        newTop = containerHeight - containerHeight * this.minHeight
      }
      if (containerHeight - newTop > containerHeight * this.maxHeight) {
        newTop = containerHeight - containerHeight * this.maxHeight
      }

      this.handleElement.style.top = newTop + 'px'
    },
    startMoving(event: PolarMoveEvent): void {
      this.saveInitialCursorCoordinates(event)
      this.savePreMoveHandleTop()
      this.isMoving = true
    },
  },
})
</script>

<style lang="scss" scoped>
.polar-move-handle {
  position: static;
  height: auto;
  width: auto;
  background-color: transparent;
  cursor: ns-resize;

  &-is-moving * {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none !important;
    user-select: none;
  }
}
</style>
