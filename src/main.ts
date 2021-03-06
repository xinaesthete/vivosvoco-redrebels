import './main.css'
import {
    Mesh,
    OrthographicCamera,
    PlaneGeometry,
    Scene,
    ShaderMaterial,
    Texture,
    TextureLoader,
    Vector2,
    VideoTexture,
    WebGLRenderer
} from 'three'
import * as params from './params'
import * as vid from './video_state'
import * as dat from 'dat.gui'

const scene = new Scene();
const camera = new OrthographicCamera(0, 1, 1, 0, 0, 10);
camera.position.set(0.5, 0.5, -1);
camera.lookAt(0.5,0.5,0);

const renderer = new WebGLRenderer({
  antialias: true,
  alpha: false
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const vs = document.getElementById('k-vertex-shader').textContent;
const fs = document.getElementById('k-fragment-shader').textContent;



let w = window.innerWidth, h = window.innerHeight;

const uniforms: params.Uniforms = {
    'ScreenAspect': {value: w/h},
    'Leaves': {value: 3},
    'Angle': {value: 1.05},
    'OutAngle': {value: 0},
    'Zoom': {value: 1.3},
    'MozMix': {value: 1.},
    'Centre': {value: new Vector2(0.5, 0.5)},
    'ImageCentre': {value: new Vector2(0.5, 0.)},
    'UVLimit': {value: new Vector2(1920/2048, 1080/2048)},// vidTex.repeat},
    'texture1': {value: vid.vidTex},
    // texture2: {value: vidTex2},
    // texture3: {value: vidTex3}
};

const parms = params.makeGUI([
    {name: "Leaves", value: 3, min: 1, max: 8, step: 1},
    {name: "Angle", value: 1.05, min: -Math.PI, max: Math.PI},
    {name: "AngleGain", value: 0.5, min: 0, max: 1},
    {name: "OutAngle", value: 0, min: -1, max: 1},
    {name: "Zoom", value: 1.3, min: 0, max: 10},
    {name: "KaleidMix", value: 0.999, min: 0, max: 1},
    //not great as is, but maybe something later (off off on?)
    {name: "Mozaic", value: 4, min: 1, max: 40},
    // {name: "MozMix", value: 0.3, min: 0, max: 1},
    // {name: "MozPow", value: 1.5, min: 0, max: 10},
    {name: "MozGain", value: .5, min: 0, max: 1},
    {name: "ContrastPreBias", value: 0.5, min: 0, max: 1},
    {name: "ContrastGain", value: 0.5, min: 0, max: 1},
    {name: "ContrastPostBias", value: 0.5, min: 0, max: 1},
    {name: "SaturationBias", value: 0.5, min: 0, max: 1},
    {name: "SaturationGain", value: 0.5, min: 0, max: 1},
    {name: "ImageCentre", value: new Vector2(0.5, 0), min: -1, max: 1},
    {name: "Centre", value: new Vector2(0.5, 0.5), min: 0, max: 1},
    {name: "Vignette", value: new Vector2(0.1, 0.1), min: 0, max: 0.2},
], uniforms);

vid.setup(renderer, uniforms);
// const gui = new dat.GUI();
// gui.add(vid.vidEl, 'playbackRate').min(0).max(20).name('rate1');
//gui.add(vidEl2, 'playbackRate').min(0).max(20).name('rate2');
//gui.add(vidEl3, 'playbackRate').min(0).max(20).name('rate3');

const geo = new PlaneGeometry(2, 2);
const mat = new ShaderMaterial({vertexShader: vs, fragmentShader: fs, uniforms: uniforms, transparent: true});
const mesh = new Mesh(geo, mat);
mesh.position.x = 0.5;
mesh.position.y = 0.5;

//mesh.position.z = 0.5;
//mesh.updateMatrix();
scene.add(mesh);
let t0 = Date.now();
function animate(time: number) {
  requestAnimationFrame(animate);
  //uniforms.iTime.value = Date.now() / 1000;
  let w = window.innerWidth, h = window.innerHeight;
  uniforms.ScreenAspect.value = w/h;
  const img = uniforms.texture1.value;

  uniforms.UVLimit.value = img.repeat;
  const dt = time - t0;
  t0 = time;
//   parms.forEach(p => p.update(dt))
  parms.update(dt);
  renderer.render(scene, camera);
}
animate(t0);
window.onresize = _ => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    //camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
};

