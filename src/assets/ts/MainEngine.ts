import { Color, Fog, PerspectiveCamera, Scene, WebGLRenderer } from 'three'

export class MainEngine {
  dom: HTMLElement
  renderer: WebGLRenderer
  scene: Scene
  camera: PerspectiveCamera

  debug: boolean = false
  constructor(dom: HTMLElement) {
    this.dom = dom
    this.scene = new Scene()
    this.scene.background = new Color(0x88ccee)
    this.scene.fog = new Fog(0x88ccee, 0, 50)
    this.camera = new PerspectiveCamera(
      70,
      dom.offsetWidth / dom.offsetHeight,
      0.1,
      1000
    )
    this.renderer = new WebGLRenderer({ antialias: true })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(dom.offsetWidth, dom.offsetHeight)
  }
}
