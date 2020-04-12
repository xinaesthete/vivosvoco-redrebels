import './main.css'
import {
    Scene,
    WebGLRenderer,
    Mesh,
    OrthographicCamera,
    PlaneGeometry,
    DoubleSide,
    ShaderMaterial,
    Vector2,
    VideoTexture
} from 'three'

import * as im1 from '../assets/20200410_125907.webm' //./vid1.webm'
import * as im2 from '../assets/20200410_130510.webm' //./vid1.webm'
import * as im3 from '../assets/rrfriday1.webm' //./vid1.webm'

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


const vidEl = document.getElementById("vid1") as HTMLVideoElement;
const vidUrl = im1; // require('../rebels/vid1.webm');
console.log(vidUrl);
vidEl.src = vidUrl;
const vidTex = new VideoTexture(vidEl);

// const vidEl2 = document.getElementById("vid2") as HTMLVideoElement;
// const vidUrl2 = im2;
// console.log(vidUrl2);
// vidEl2.src = vidUrl2;
// const vidTex2 = new VideoTexture(vidEl2);
//
// const vidEl3 = document.getElementById("vid3") as HTMLVideoElement;
// const vidUrl3 = im3;
// console.log(vidUrl3);
// vidEl3.src = vidUrl3;
// const vidTex3 = new VideoTexture(vidEl3);


let w = window.innerWidth, h = window.innerHeight;

const uniforms = {
    ScreenAspect: {value: w/h},
    Leaves: {value: 3},
    Angle: {value: 1.05},
    OutAngle: {value: 0},
    Zoom: {value: 1.3},
    Centre: {value: new Vector2(0.5, 0.5)},
    ImageCentre: {value: new Vector2(0.5, 0.)},
//    UVLimit: {value: new Vector2(1920/2048, 1080/2048)},// vidTex.repeat},
    UVLimit: {value: new Vector2(1920/2048, 1080/2048)},// vidTex.repeat},
    texture1: {value: vidTex},
    // texture2: {value: vidTex2},
    // texture3: {value: vidTex3}
};

const gui = new dat.GUI();
gui.add(vidEl, 'playbackRate').min(0).max(20).name('rate1');
//gui.add(vidEl2, 'playbackRate').min(0).max(20).name('rate2');
//gui.add(vidEl3, 'playbackRate').min(0).max(20).name('rate3');

gui.add(uniforms.Leaves, 'value').min(1).max(8).name('Leaves').step(1);
gui.add(uniforms.Angle, 'value').min(-Math.PI).max(Math.PI).name('Angle');
gui.add(uniforms.OutAngle, 'value').min(-1).max(1).name('OutAngle');
gui.add(uniforms.Zoom, 'value').min(0).max(10).name('Zoom');
gui.add(uniforms.ImageCentre.value, 'x').min(-1).max(1).name('ImageCentreX');
gui.add(uniforms.ImageCentre.value, 'y').min(-1).max(1).name('ImageCentreY');
gui.add(uniforms.Centre.value, 'x').min(0).max(1).name('Output CentreX');
gui.add(uniforms.Centre.value, 'y').min(0).max(1).name('Output CentreY');

const geo = new PlaneGeometry(2, 2);
const mat = new ShaderMaterial({vertexShader: vs, fragmentShader: fs, uniforms: uniforms});
mat.side = DoubleSide;
const mesh = new Mesh(geo, mat);
mesh.position.x = 0.5;
mesh.position.y = 0.5;

//mesh.position.z = 0.5;
//mesh.updateMatrix();
scene.add(mesh);

function animate() {
  requestAnimationFrame(animate);
  //uniforms.iTime.value = Date.now() / 1000;
  let w = window.innerWidth, h = window.innerHeight;
  uniforms.ScreenAspect.value = w/h;
  renderer.render(scene, camera);
}
animate();
window.onresize = _ => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    //camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
};
renderer.domElement.ondragover = e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
};
renderer.domElement.ondrop = e => {
    e.preventDefault();
    if (e.dataTransfer.items) {
        const item = e.dataTransfer.items[0];
        if (item.kind === 'file') {
            const file = item.getAsFile();
            if (file.type.startsWith('video/')) {
                const reader = new FileReader();
                reader.onload = readEvent => vidEl.src = readEvent.target.result as string;
                reader.readAsDataURL(file);
                //vidEl.src = file.name;
            } else if (file.type.startsWith('image/')) {
                //TODO
            }
        }
    }
};

