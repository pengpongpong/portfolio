import {
  SRGBColorSpace,
  OrthographicCamera,
  DataTexture,
  RedFormat,
  FloatType,
  NearestFilter,
  ShaderMaterial,
  DoubleSide,
  Vector4,
  PlaneGeometry,
  Mesh,
  WebGLRenderer,
  Scene,
  TextureLoader,
  Clock
} from "three"
import type { GridData } from "./Grid";

export default class Sketch {
  private renderer: WebGLRenderer
  private camera: OrthographicCamera
  private scene: Scene
  private url: string
  private geometry!: PlaneGeometry
  private plane!: Mesh
  private texture!: DataTexture
  private material!: ShaderMaterial
  private imageAspect!: number;
  private size!: number
  private width: number
  private height: number
  private settings: {
    grid: number,
    strength: number,
    relaxation: number
  }
  private timer: Clock


  constructor(options: {
    renderer: WebGLRenderer,
    data: GridData,
    url: string,
    size: { width: number, height: number },
  }) {
    this.renderer = options.renderer;
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.camera = new OrthographicCamera(1 / -2, 1 / 2, 1 / 2, 1 / -2, -1000, 1000);
    this.scene = new Scene();

    this.url = options.url;

    this.width = options.size.width;
    this.height = options.size.height;
    this.timer = new Clock()

    this.settings = {
      grid: options.data.grid || 34,
      strength: options.data.strength || 1,
      relaxation: options.data.relaxation || 0.9,
    };

    this.addObjects();
    this.resize();
    this.render();
  }

  resize() {
    this.renderer.setSize(this.width, this.height);
    const canvas = document.getElementById("gridCanvas")

    const widthCanvas = canvas?.clientWidth
    const heightCanvas = canvas?.clientHeight

    if (widthCanvas && heightCanvas) {
      this.imageAspect = heightCanvas / widthCanvas;
    }

    // image cover
    let a1;
    let a2;
    if (this.height / this.width > this.imageAspect) {
      a1 = (this.width / this.height) * this.imageAspect;
      a2 = 1;
    } else {
      a1 = 1;
      a2 = (this.height / this.width) / this.imageAspect;
    }

    this.material.uniforms.resolution.value.x = this.width;
    this.material.uniforms.resolution.value.y = this.height;
    this.material.uniforms.resolution.value.z = a1;
    this.material.uniforms.resolution.value.w = a2;

    this.camera.updateProjectionMatrix();
    this.regenerateGrid()
  }

  regenerateGrid() {
    this.timer.start();
    this.size = this.settings.grid;

    const width = this.size;
    const height = this.size;

    const size = width * height;
    const data = new Float32Array(3 * size);

    // mix grid
    for (let i = 0; i < size; i++) {
      let r = Math.random() * 255 - 125;
      let r1 = Math.random() * 255 - 125;

      const stride = i * 3;

      data[stride] = r;
      data[stride + 1] = r1;
      data[stride + 2] = r;
    }

    // used the buffer to create a DataTexture
    this.texture = new DataTexture(data, width, height, RedFormat, FloatType);

    this.texture.magFilter = this.texture.minFilter = NearestFilter;

    if (this.material) {
      this.material.uniforms.uDataTexture.value = this.texture;
      this.material.uniforms.uDataTexture.value.needsUpdate = true;
    }
  }

  addObjects() {
    this.regenerateGrid()
    let texture = new TextureLoader().load(this.url)

    this.material = new ShaderMaterial({
      side: DoubleSide,
      uniforms: {
        time: {
          value: 0
        },
        resolution: {
          value: new Vector4()
        },
        uTexture: {
          value: texture
        },
        uDataTexture: {
          value: this.texture
        },
      },
      vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      uniform vec2 pixels;
      float PI = 3.141592653589793238;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }`,
      fragmentShader: `
      uniform float progress;
      uniform sampler2D uDataTexture;
      uniform sampler2D uTexture;
      
      
      uniform vec4 resolution;
      varying vec2 vUv;
      varying vec3 vPosition;
      float PI = 3.141592653589793238;
      void main()	{
        vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
        vec4 color = texture2D(uTexture,newUV);
        vec4 offset = texture2D(uDataTexture,vUv);
        gl_FragColor = vec4(vUv,0.0,1.);
        gl_FragColor = vec4(offset.r,0.,0.,1.);
        gl_FragColor = color;
        gl_FragColor = texture2D(uTexture,newUV - 0.02*offset.rg);
        //gl_FragColor = offset;
      
      }`
    }
    );

    this.geometry = new PlaneGeometry(1, 1, 1, 1);

    this.plane = new Mesh(this.geometry, this.material);
    this.scene.add(this.plane);
  }

  updateDataTexture() {
    const deltaTime = this.timer.getDelta()
    let data = this.texture.image.data;

    const framerate = 1 / deltaTime
    const adaptToFramerate = framerate > 90 ? 0.075 : 0

    for (let i = 0; i < data.length; i += 3) {
      data[i] *= this.settings.relaxation + adaptToFramerate
      data[i + 1] *= this.settings.relaxation + adaptToFramerate
      data[i + 2] *= this.settings.relaxation + adaptToFramerate
    }

    this.texture.needsUpdate = true
  }

  render() {
    this.updateDataTexture()
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}