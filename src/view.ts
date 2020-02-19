import * as THREE from 'three'
import vert from './view.vert'
import frag from './view.frag'

const blank = new THREE.DataTexture(
  new Float32Array([0.1,0.2,0.3,1]),
  1, 1, THREE.RGBAFormat, THREE.FloatType
)
blank.minFilter = THREE.NearestFilter

type DIM = 'H' | 'W' | 'S' | 'T'

export class LightField {
  texture = blank
  loader = new THREE.TextureLoader()
  dimensions = [1, 1, 1, 1]
  position = [0, 0, 0, 0]

  load(url: string, dimensions: [number, number, number, number]) {
    this.loader.load(url, (tex) => {
      tex.magFilter = THREE.NearestFilter
      tex.minFilter = THREE.NearestFilter
      tex.flipY = false
      tex.wrapS = THREE.ClampToEdgeWrapping
      tex.wrapT = THREE.ClampToEdgeWrapping
      this.texture = tex
      this.dimensions = dimensions
    }, x => console.info(x), err => console.error(err))
  }

  uniforms(A: DIM, B: DIM) {
    return new Proxy(this, {
      has(_, key) {
        return [
          'lightfield', 'dimensions', 'stride', 'offset'
        ].includes(key as string)
      },
      get(self, key) {
        const [S, T, H, W] = self.dimensions
        if (key == 'lightfield') {
          return {value: self.texture}
        }
        if (key == 'dimensions') {
          return {value: [T*W, S*H]}
        }
        if (key == 'stride') return {value: [
          self.stride(A),
          self.stride(B)
        ]}
        if (key == 'offset') return {value: [
          self.offset(A),
          self.offset(B)
        ]}
      }
    })
  }


  offset(x: DIM) {
    const [S, T, H, W] = this.dimensions
    const [s, t, h, w] = this.position
    switch (x) {
      case 'H': return H*T-t
      case 'W': return s
      case 'S': return w*S+S
      case 'T': return h*T
    }
  }

  stride(x: DIM) {
    const [S, T, H, W] = this.dimensions
    switch (x) {
      case 'H': return -T
      case 'W': return S
      case 'S': return -1
      case 'T': return 1
    }
  }
}

export class View {
  loader = new THREE.TextureLoader()
  camera: THREE.Camera
  scene: THREE.Scene
  mesh: THREE.Mesh
  renderer: THREE.Renderer
  dimensions = [0, 0, 0, 0]
  positions = [0, 0, 0, 0]

  constructor(
    public canvas: HTMLCanvasElement,
    public uniforms: any
  ) {
    const {height, width} = canvas
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      context: this.canvas.getContext('webgl2')
    })
    this.camera = new THREE.OrthographicCamera(
      -width/2, width/2, -height/2, height/2, 1, 1000)
    this.scene = new THREE.Scene()
    this.scene.add(this.camera)
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute([
      0, 0, 2,  0, 1, 2,  1, 0, 2,
      0, 1, 2,  1, 0, 2,  1, 1, 2
    ], 3))
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      side: THREE.DoubleSide,
      vertexShader: vert,
      fragmentShader: frag
    })
    this.mesh = new THREE.Mesh(geometry, material)
    this.scene.add(this.mesh)
    this.camera.lookAt(new THREE.Vector3(0, 0, 1))
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this))
    this.renderer.render(this.scene, this.camera)
  }

}
