import Vue from 'vue'
import idx from '@polar/lib-idx'

type SubscribeCallback = (value: unknown, oldValue: unknown) => void

// registers a callback to a vuex watcher
function subscribe(
  this: Vue,
  path: string,
  callback: SubscribeCallback,
  immediate = true
): () => void {
  const steps: string[] = path.split('/')
  return this.$store.watch((state: object) => idx(state, steps), callback, {
    immediate,
  })
}

export default subscribe
