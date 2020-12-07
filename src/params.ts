import * as dat from "dat.gui"
import * as THREE from 'three'

function lerp(s, t, a) {
    if (a<0) return s;
    if (a>1) return t;
    return s + a*(t-s);
}

class LagNum {
    lagTime: number = 1000;
    curVal: number;
    targVal: number;
    constructor(val: number, lagTime = 1000) {
        this.curVal = this.targVal = val;
        this.lagTime = lagTime;
    }
    update(dt: number) {
        if (dt <= 0) return;
        const a = 1. - Math.pow(0.0001, dt/this.lagTime);
        return this.curVal = lerp(this.curVal, this.targVal, a);
    }
}


//ways of moving:
//constant direction (wrap)
//ping-pong
//noise
//smooth oscillation
//shaped oscillation

export interface Scalar {
    name: string,
    value?: number,// | THREE.Vector2 | THREE.Vector3 | THREE.Vector4,
    min?: number,
    max?: number,
    step?: number
}

const gui = new dat.GUI();
export const makeGUI = (specs: Scalar[], uniforms:any = {}) => {
    const parms: ShaderParam[] = [];
    specs.forEach(s => {
        //uniforms[s.name] = {value: s.v}
        const p = new ShaderParam(uniforms, s.name, s.value, s.min, s.max);
        parms.push(p);
        gui.add(p.val, 'targVal', s.min, s.max, s.step).name(s.name);
    });
    return parms;
}

export class ParamGroup {
    parms: ShaderParam[] = [];
    lagTime: number = 1000;
}

export class ShaderParam {
    val: LagNum;
    name: string;
    min: number;
    max: number;
    uniforms: any; //the structure of which this is a member
    uniformObj: any; //TODO: type
    constructor(uniforms, name, init= 0.5, min= 0, max= 1, lagTime = 10000) {
        this.uniforms = uniforms;
        if (this.uniforms[name]) this.uniformObj = this.uniforms[name];
        else this.uniforms[name] = { value: init };
        this.name = name;
        this.min = min;
        this.max = max;
        this.val = new LagNum(init, lagTime);
    }
    update(dt: number) {
        this.uniformObj.value = this.val.update(dt);
    }
}
