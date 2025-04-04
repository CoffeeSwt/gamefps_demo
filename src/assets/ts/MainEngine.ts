import {
  AxesHelper,
  Color,
  Object3D,
  PerspectiveCamera,
  OrthographicCamera,
  Scene,
  WebGLRenderer,
  Raycaster,
  Vector2,
  Intersection,
  Mesh,
  Material,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
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
  private raycaster: Raycaster = new Raycaster(); // 初始化 Raycaster
  private mouse: Vector2 = new Vector2(); // 存储鼠标位置
  private selectedObject: Object3D | null = null; // 保存鼠标指向的物体
  sceneObjects: string[] = []; // 存储场景中的物体的 uuid
  init(dom: HTMLElement) {
    this.dom = dom;
    this.scene.background = new Color(0xcccccc);

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.resize();
    this.dom.appendChild(this.renderer.domElement);

    // 初始化 OrbitControls
    this.initControls();

    // 初始化 ResizeObserver
    this.initResizeObserver();

    // 初始化正交相机
    this.initOrthographicCamera();

    // 添加鼠标事件监听
    this.addMouseEventListeners();

    return this;
  }

  render() {
    this.renderer.render(this.scene, this.activeCamera); // 使用当前激活的相机渲染
  }

  addObject(object: Object3D) {
    this.scene.add(object);
    this.sceneObjects.push(object.uuid); // 将物体的 uuid 添加到数组中
  }

  removeObject(object: any) {
    this.scene.remove(object);
    const index = this.sceneObjects.indexOf(object.uuid); // 获取物体的 uuid 在数组中的索引
    if (index !== -1) {
      // 如果找到了索引
      this.sceneObjects.splice(index, 1); // 从数组中移除物体的 uuid
    }
    if (object instanceof Mesh) {
      // 如果是 Mesh 类型，销毁材质和几何体
      object.geometry.dispose(); // 销毁几何体
      if (object.material instanceof Array) {
        object.material.forEach((mat) => mat.dispose()); // 销毁材质（如果是数组）
      } else {
        object.material.dispose(); // 销毁材质
      }
    }
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
      // console.log(this.scene.children);
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
      // this.controls!.enabled = false; // 禁用 OrbitControls
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
      // this.controls!.enabled = true; // 启用 OrbitControls
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

  private addMouseEventListeners() {
    this.dom.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.dom.addEventListener("click", this.onMouseClick.bind(this));
  }

  private onMouseMove(event: MouseEvent) {
    // 将鼠标位置转换为归一化设备坐标 (NDC)
    const rect = this.dom.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // 更新射线
    this.raycaster.setFromCamera(this.mouse, this.activeCamera);

    // 检测与场景中物体的交互
    const intersects: Intersection[] = this.raycaster.intersectObjects(
      this.scene.children,
      true
    );

    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object; // 获取第一个交互的物体
      // console.log("Mouse over object:", intersectedObject);
      // 保存指向的物体
      this.selectedObject = intersectedObject;
    } else {
      this.selectedObject = null; // 如果没有指向物体，清空
    }
  }

  private onMouseClick(event: MouseEvent) {
    if (!this.selectedObject) return;
    if (!this.sceneObjects.includes(this.selectedObject.uuid)) return; // 确保选中的物体是 主动添加 类型
    // 在这里可以对选中的物体执行操作
    // 例如：this.selectedObject.material.color.set(0xff0000); // 将选中物体的颜色改为红色}
    console.log("Mouse clicked on object:", this.selectedObject);
  }
}
