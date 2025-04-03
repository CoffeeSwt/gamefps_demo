import {
  AxesHelper,
  Color,
  Object3D,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class MainEngine {
  dom: HTMLElement = document.body;
  renderer: WebGLRenderer = new WebGLRenderer({ antialias: true });
  scene: Scene = new Scene();
  camera: PerspectiveCamera = new PerspectiveCamera(70, 1, 0.1, 1000);
  controls: OrbitControls | null = null; // 添加 OrbitControls
  debugMode: boolean = false;
  private resizeObserver: ResizeObserver | null = null;

  constructor(dom: HTMLElement) {
    this.dom = dom;
    this.scene.background = new Color(0x88ccee);

    this.camera.position.set(20, 20, 20);
    this.camera.lookAt(0, 0, 0);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.resize();
    this.dom.appendChild(this.renderer.domElement);

    // 初始化 OrbitControls
    this.initControls();

    // 初始化 ResizeObserver
    this.initResizeObserver();
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

  setCameraPosition(x: number, y: number, z: number) {
    this.camera.position.set(x, y, z);
  }

  lookAt(x: number, y: number, z: number) {
    this.camera.lookAt(x, y, z);
  }

  start() {
    const animate = () => {
      this.render();
      if (this.controls) {
        this.controls.update(); // 更新 OrbitControls
      }
      requestAnimationFrame(animate);
    };
    animate();
  }

  resize() {
    this.camera.aspect = this.dom.offsetWidth / this.dom.offsetHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.dom.offsetWidth, this.dom.offsetHeight);
  }

  private initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true; // 启用阻尼效果（惯性）
    this.controls.dampingFactor = 0.05; // 阻尼系数
    this.controls.screenSpacePanning = false; // 禁止屏幕空间平移
    this.controls.minDistance = 5; // 最小缩放距离
    this.controls.maxDistance = 100; // 最大缩放距离
    this.controls.maxPolarAngle = Math.PI / 2; // 限制垂直旋转角度（避免翻转）
  }

  private addAxesHelper(length: number = 5) {
    const axesHelper = new AxesHelper(length); // 创建一个长坐标轴指示器
    this.scene.add(axesHelper); // 将坐标轴指示器添加到场景中
  }

  private initResizeObserver() {
    this.resizeObserver = new ResizeObserver(() => {
      this.resize(); // 调用 resize 方法更新相机和渲染器
    });
    this.resizeObserver.observe(this.dom); // 监听 DOM 元素大小变化
  }

  changeDebugMode(debugMode: boolean) {
    this.debugMode = debugMode; // 更新 debugMode 属性
    if (debugMode) {
      // 添加坐标轴指示器
      this.addAxesHelper(1000);
    }
  }

  stop() {
    // 停止渲染循环
    if (this.controls) {
      this.controls.dispose(); // 清理 OrbitControls
      this.controls = null;
    }
    this.dispose();
  }

  dispose() {
    // 停止监听 ResizeObserver
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }
}
