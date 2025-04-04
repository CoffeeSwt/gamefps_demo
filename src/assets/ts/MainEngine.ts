import {
  AxesHelper,
  Color,
  Object3D,
  PerspectiveCamera,
  OrthographicCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class MainEngine {
  dom: HTMLElement = document.body;
  renderer: WebGLRenderer = new WebGLRenderer({ antialias: true });
  scene: Scene = new Scene();
  perspectiveCamera: PerspectiveCamera = new PerspectiveCamera(
    70,
    1,
    0.1,
    1000
  );
  orthographicCamera: OrthographicCamera | null = null; // 添加正交相机
  activeCamera: PerspectiveCamera | OrthographicCamera = this.perspectiveCamera; // 当前激活的相机
  controls: OrbitControls | null = null;
  debugMode: boolean = false;
  private axesHelper: AxesHelper | null = null;
  private resizeObserver: ResizeObserver | null = null;

  init(dom: HTMLElement) {
    this.dom = dom;
    this.scene.background = new Color(0x88ccee);

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.resize();
    this.dom.appendChild(this.renderer.domElement);

    // 初始化 OrbitControls
    this.initControls();

    // 初始化 ResizeObserver
    this.initResizeObserver();

    // 初始化正交相机
    this.initOrthographicCamera();

    return this;
  }

  render() {
    this.renderer.render(this.scene, this.activeCamera); // 使用当前激活的相机渲染
  }

  addObject(object: Object3D) {
    this.scene.add(object);
  }

  removeObject(object: any) {
    this.scene.remove(object);
  }

  setCameraPosition(x: number, y: number, z: number) {
    this.perspectiveCamera.position.set(x, y, z);
    this.orthographicCamera?.position.set(x, y, z); // 使用可选链操作符来处理可能为 null 的情况
  }

  lookAt(x: number, y: number, z: number) {
    this.perspectiveCamera.lookAt(x, y, z);
    this.orthographicCamera?.lookAt(x, y, z);
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
    return this;
  }

  private resize() {
    const aspect = this.dom.offsetWidth / this.dom.offsetHeight;

    // 更新透视相机
    this.perspectiveCamera.aspect = aspect;
    this.perspectiveCamera.updateProjectionMatrix();

    // 更新正交相机
    if (this.orthographicCamera) {
      const frustumSize = 10;
      this.orthographicCamera.left = (-frustumSize * aspect) / 2;
      this.orthographicCamera.right = (frustumSize * aspect) / 2;
      this.orthographicCamera.top = frustumSize / 2;
      this.orthographicCamera.bottom = -frustumSize / 2;
      this.orthographicCamera.updateProjectionMatrix();
    }

    this.renderer.setSize(this.dom.offsetWidth, this.dom.offsetHeight);
    return this;
  }

  private initControls() {
    this.controls = new OrbitControls(
      this.activeCamera,
      this.renderer.domElement
    );
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 5;
    this.controls.maxDistance = 100;
    this.controls.maxPolarAngle = Math.PI / 2;
  }

  private initResizeObserver() {
    this.resizeObserver = new ResizeObserver(() => {
      this.resize();
    });
    this.resizeObserver.observe(this.dom);
  }

  private initOrthographicCamera() {
    const aspect = this.dom.offsetWidth / this.dom.offsetHeight;
    const frustumSize = 10;
    this.orthographicCamera = new OrthographicCamera(
      (-frustumSize * aspect) / 2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      -frustumSize / 2,
      0.1,
      1000
    );
    this.orthographicCamera.position.set(20, 20, 20);
    this.orthographicCamera.lookAt(0, 0, 0);
  }

  changeCamera(type: "perspective" | "orthographic") {
    if (type === "perspective") {
      this.activeCamera = this.perspectiveCamera;
    } else if (type === "orthographic" && this.orthographicCamera) {
      this.activeCamera = this.orthographicCamera;
    }

    // 更新 OrbitControls 绑定的相机
    if (this.controls) {
      this.controls.object = this.activeCamera;

      // 同步 OrbitControls 的目标点
      const target = this.controls.target.clone(); // 保存当前目标点
      this.controls.target.copy(target); // 将目标点同步到新相机
      this.controls.update(); // 更新 OrbitControls
    }
  }
  changeDebugMode() {
    this.debugMode = !this.debugMode; // 更新 debugMode 属性

    if (this.debugMode) {
      // 如果开启调试模式，添加坐标轴指示器
      if (!this.axesHelper) {
        this.axesHelper = new AxesHelper(1000); // 创建一个长度为 1000 的坐标轴指示器
        this.scene.add(this.axesHelper); // 将坐标轴指示器添加到场景中
      }
    } else {
      // 如果关闭调试模式，移除并销毁坐标轴指示器
      if (this.axesHelper) {
        this.scene.remove(this.axesHelper); // 从场景中移除
        this.axesHelper.geometry.dispose(); // 销毁几何体
        if (this.axesHelper.material instanceof Array) {
          this.axesHelper.material.forEach((mat) => mat.dispose()); // 销毁材质（如果是数组）
        } else {
          this.axesHelper.material.dispose(); // 销毁材质
        }
        this.axesHelper = null; // 清空引用
      }
    }
    return this;
  }

  stop() {
    if (this.controls) {
      this.controls.dispose();
      this.controls = null;
    }
    this.dispose();
  }

  private dispose() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }
  disableRotation() {
    if (this.controls) {
      this.controls.enableRotate = false; // 禁用旋转
    }
  }
  enableRotation() {
    if (this.controls) {
      this.controls.enableRotate = true; // 启用旋转
    }
  }
}
