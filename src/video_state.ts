import * as THREE from 'three'
import * as im1 from '../assets/20200410_125907.webm' //./vid1.webm'

export const vidEl = document.getElementById("vid1") as HTMLVideoElement;
const vidUrl = im1; // require('../rebels/vid1.webm');
console.log(vidUrl);
vidEl.src = vidUrl;
export const vidTex: THREE.Texture = new THREE.VideoTexture(vidEl);

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



export function setup(renderer: THREE.Renderer, uniforms: any) {
    renderer.domElement.ondragover = e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };
    renderer.domElement.ondrop = e => {
        e.preventDefault();
        if (e.dataTransfer.items) {
            const item = e.dataTransfer.items[0];
            if (item.kind === 'file') {
                const t = Date.now();
                const file = item.getAsFile();
                const reader = new FileReader();
                //seems like this will attempt to read entire file, blocking, before continuing...
                reader.readAsDataURL(file);
                console.log(`readAsDataURL took ${Date.now() - t}`);
                reader.onload = readEvent => {
                    console.log(`onload took ${Date.now() - t}`);
                    const result = readEvent.target.result as string;
                    if (file.type.startsWith('video/')) {
                        vidEl.src = result;
                        vidEl.onloadeddata = () => {
                            console.log(`onloadeddata took ${Date.now() - t}`);
                            vidEl.play();
                        }
                    } else if (file.type.startsWith('image/')) {
                        const t = uniforms.texture1.value = new THREE.TextureLoader().load(readEvent.target.result as string);
                    }
                };
            }
        }
    };
}