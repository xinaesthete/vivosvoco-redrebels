
function lerp(s, t, a) {
    return s + a*(t-s);
}

export class LagNum {
    lagTime: number = 1;
    curVal: number;
    targVal: number;
    constructor(val: number, lagTime = 1) {
        this.curVal = this.targVal = val;
        this.lagTime = lagTime;
    }
    update(dt: number) {
        return this.curVal = lerp(this.curVal, this.targVal, Math.pow(0.0001, dt*this.lagTime));
    }
}

export class ShaderParam {
    val: LagNum;
    name: string;
    min: number;
    max: number;
    uniforms: any;
    uniformObj: any; //TODO: type
    constructor(uniforms, name, init= 0.5, min= 0, max= 1, lagTime = 1) {
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
