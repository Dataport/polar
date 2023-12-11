<template>
  <div
    id="polar-move-handle"
    tabindex="0"
    @focus="moveHandle($event.key)"
    @keydown="moveHandle($event.key)"
    @mousedown.stop="onMouseDown"
    @touchstart.stop="onTouchStart"
  >
    <v-icon id="polar-move-handle-grip-icon"> fa-grip-lines </v-icon>
    <v-card-actions>
      <slot name="actionButton" />
      <v-spacer></v-spacer>
      <v-btn icon small :aria-label="closeLabel" @click="close">
        <v-icon>fa-xmark</v-icon>
      </v-btn>
    </v-card-actions>
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapMutations } from 'vuex'
import { MoveEventName, MoveEventNames, PolarMoveEvent } from './types'

const minHeight = 0.1

export default Vue.extend({
  name: 'MoveHandle',
  props: {
    closeLabel: {
      type: String,
      required: true,
    },
    closeFunction: {
      type: Function,
      required: true,
    },
  },
  data: (): {
    initialCursorY: number
    isMoving: boolean
    maxHeight: number
    preMoveHandleTop: number
    resizeObserver: null | ResizeObserver
    touchDevice: boolean
    timeoutReference: number
  } => ({
    initialCursorY: 0,
    isMoving: false,
    maxHeight: Number.MAX_SAFE_INTEGER,
    preMoveHandleTop: 0,
    resizeObserver: null,
    touchDevice: false,
    timeoutReference: 0,
  }),
  computed: {
    ...mapGetters(['hasSmallHeight', 'hasWindowSize']),
    isHorizontal() {
      return this.hasSmallHeight && this.hasWindowSize
    },
    moveEventNames(): MoveEventNames {
      return this.touchDevice
        ? { move: 'touchmove', end: 'touchend' }
        : { move: 'mousemove', end: 'mouseup' }
    },
  },
  watch: {
    // Fixes an issue if the orientation of a mobile device is changed while a plugin is open
    isHorizontal(newVal: boolean) {
      if (!newVal) {
        this.updateMaxHeight()
      }
    },
    isMoving(newValue: boolean): void {
      const { move, end } = this.moveEventNames

      if (newValue) {
        this.$el.classList.add('polar-move-handle-is-moving')
        document.addEventListener<MoveEventName>(move, this.onMove)
        document.addEventListener(end, this.onMoveEnd, { once: true })
        return
      }
      this.$el.classList.remove('polar-move-handle-is-moving')
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
    const handleElement = this.$el as HTMLDivElement
    handleElement.style.position = 'fixed'
    handleElement.style.width = '100%'
    handleElement.style['z-index'] = 1
    handleElement.style.left = '0'
    handleElement.style.top = `${Math.round(
      this.$root.$el.clientHeight - this.$root.$el.clientHeight * minHeight
    )}px`
    this.resizeObserver = new ResizeObserver(this.updateMaxHeight)
    this.resizeObserver.observe(handleElement)
    this.updateMaxHeight()
  },
  methods: {
    ...mapMutations(['setMoveHandle']),
    updateMaxHeight() {
      this.maxHeight = this.$el.clientHeight / this.$root.$el.clientHeight
    },
    close() {
      this.setMoveHandle(null)
      this.closeFunction()
    },
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
      this.preMoveHandleTop = (this.$el as HTMLDivElement).offsetTop
    },
    setNewPosition(deltaY: number): void {
      const containerHeight = this.$root.$el.clientHeight
      let newTop = Math.round(this.preMoveHandleTop + deltaY)

      if (containerHeight - newTop < containerHeight * minHeight) {
        newTop = containerHeight - containerHeight * minHeight
      }
      if (containerHeight - newTop > containerHeight * this.maxHeight) {
        newTop = containerHeight - containerHeight * this.maxHeight
      }

      ;(this.$el as HTMLDivElement).style.top = newTop + 'px'
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
#polar-move-handle {
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

  #polar-move-handle-grip-icon {
    width: 100%;
    color: var(--polar-primary);
    background-color: var(--polar-primary-contrast);
  }

  .v-card__actions {
    background-color: var(--polar-primary-contrast);

    .v-btn {
      color: var(--polar-primary);
    }
  }
}
</style>
