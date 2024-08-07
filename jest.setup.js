import 'regenerator-runtime/runtime'

class Worker {
  constructor(stringUrl) {
    this.url = stringUrl
    this.onmessage = () => {
      // empty
    }
  }

  postMessage(msg) {
    this.onmessage(msg)
  }
}
// a mock for web worker
window.Worker = Worker

window.URL.createObjectURL = function () {
  // empty
}
