import {
  Color,
  Fog,
  Object3D,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";

export class MainEngine {
  dom: HTMLElement = document.body;
  renderer: WebGLRenderer = new WebGLRenderer({ antialias: true });
  scene: Scene = new Scene();
  camera: PerspectiveCamera = new PerspectiveCamera(70, 1, 0.1, 1000);
  debug: boolean = false;

  constructor(dom?: HTMLElement) {
    if (dom) {
      this.dom = dom;
    }
    this.scene.background = new Color(0x88ccee);
    // this.scene.fog = new Fog(0x88ccee, 0, 50);
    this.camera.aspect = this.dom.offsetWidth / this.dom.offsetHeight;
    this.camera.updateProjectionMatrix();
    this.camera.position.set(20, 20, 20);
    this.camera.lookAt(0, 0, 0);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.dom.offsetWidth, this.dom.offsetHeight);
    this.dom.appendChild(this.renderer.domElement);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
  addObject(object: Object3D) {
    this.scene.add(object);
  }
  removeObject(object: any) {
    this.scene.remove(object);
  }
  start() {
    requestAnimationFrame(() => this.render());
  }
}
