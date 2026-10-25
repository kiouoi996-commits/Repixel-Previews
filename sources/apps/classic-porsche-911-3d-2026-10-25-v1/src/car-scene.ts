import {ACESFilmicToneMapping, AmbientLight, Box3, CanvasTexture, DirectionalLight, Group, Mesh, MeshBasicMaterial, MeshStandardMaterial, PerspectiveCamera, PlaneGeometry, PMREMGenerator, Scene, SRGBColorSpace, Texture, Vector3, WebGLRenderer} from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {cameraPose, H, Pose, W} from './timeline';

export class CarScene {
  renderer: WebGLRenderer;
  scene = new Scene();
  camera = new PerspectiveCamera(28, W / H, .1, 100);
  group = new Group();
  key = new DirectionalLight(0xffffff, 2.6);
  ready: Promise<void>;
  environment: ReturnType<PMREMGenerator['fromScene']>;
  private pmrem: PMREMGenerator;
  private room: RoomEnvironment;
  constructor(host: HTMLElement, asset: (path: string) => string, film = false) {
    this.renderer = new WebGLRenderer({alpha: true, antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance'});
    this.renderer.setPixelRatio(film ? 1.5 : Math.min(devicePixelRatio, 2));
    this.renderer.setSize(W, H);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.renderer.domElement.setAttribute('aria-hidden', 'true');
    host.appendChild(this.renderer.domElement);
    this.pmrem = new PMREMGenerator(this.renderer);
    this.room = new RoomEnvironment();
    this.environment = this.pmrem.fromScene(this.room, .04);
    this.scene.environment = this.environment.texture;
    this.scene.environmentIntensity = .75;
    this.scene.add(new AmbientLight(0xffffff, .45));
    this.key.position.set(-3, 7, 5);
    this.scene.add(this.key);
    const fill = new DirectionalLight(0xc8d4e1, .6);
    fill.position.set(4, 3, -4);
    this.scene.add(fill);
    const shadowCanvas = document.createElement('canvas'); shadowCanvas.width = shadowCanvas.height = 256;
    const context = shadowCanvas.getContext('2d')!;
    const shadow = context.createRadialGradient(128, 128, 15, 128, 128, 128);
    shadow.addColorStop(0, 'rgba(22,24,20,.36)'); shadow.addColorStop(.48, 'rgba(22,24,20,.20)'); shadow.addColorStop(1, 'rgba(22,24,20,0)');
    context.fillStyle = shadow; context.fillRect(0, 0, 256, 256);
    const floor = new Mesh(new PlaneGeometry(2.1, 4.7), new MeshBasicMaterial({map: new CanvasTexture(shadowCanvas), transparent: true, depthWrite: false}));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -.003;
    this.scene.add(floor, this.group);
    this.ready = new GLTFLoader().loadAsync(asset('models/porsche-911-1967.glb')).then(gltf => {
      const object = gltf.scene;
      object.updateMatrixWorld(true);
      const box = new Box3().setFromObject(object);
      const center = box.getCenter(new Vector3()), size = box.getSize(new Vector3());
      const scale = 4.4 / Math.max(size.x, size.z);
      object.scale.setScalar(scale);
      object.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);
      object.traverse(node => {
        if (node instanceof Mesh) {
          node.castShadow = true;
          node.receiveShadow = true;
          const material = node.material as MeshStandardMaterial;
          material.normalScale?.set(.12, .12);
        }
      });
      this.group.add(object);
      this.renderer.shadowMap.needsUpdate = true;
    });
  }
  draw(pose: Pose) {
    const camera = cameraPose(pose), y = .74;
    this.camera.position.set(Math.sin(camera.yaw) * camera.radius, y + camera.radius * Math.tan(camera.elevation), Math.cos(camera.yaw) * camera.radius);
    this.camera.lookAt(0, y, 0);
    this.camera.setViewOffset(W, H, -camera.shiftX, -camera.shiftY, W, H);
    this.camera.updateProjectionMatrix();
    this.scene.environmentIntensity = .75 - .11 * pose.p;
    this.key.intensity = 2.6 - .4 * pose.p;
    this.renderer.toneMappingExposure = 1 - .04 * pose.p;
    this.renderer.render(this.scene, this.camera);
  }
  dispose() {
    this.scene.traverse(node => {
      if (!(node instanceof Mesh)) return;
      node.geometry.dispose();
      for (const material of Array.isArray(node.material) ? node.material : [node.material]) {
        for (const value of Object.values(material)) if (value instanceof Texture) value.dispose();
        material.dispose();
      }
    });
    this.environment.dispose(); this.room.dispose(); this.pmrem.dispose(); this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
