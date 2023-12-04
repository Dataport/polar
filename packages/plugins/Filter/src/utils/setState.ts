import Vue from 'vue'

export const setState = (state: object, path: string[], value) => {
  if (path.length === 1) {
    Vue.set(state, path[0], value)
    return
  }
  const [step, ...restPath] = path
  if (!state[step]) {
    Vue.set(state, step, {})
  }
  setState(state[step], restPath, value)
}
