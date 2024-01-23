import { Quaternion } from "../utils/math/Quaternion";
import { Vector3 } from "../utils/math/Vector3";
const glMatrix = require('gl-matrix');

export class Transform{
    position: Vector3;
    public rotation: Quaternion;
    scale: Vector3;

    constructor(position : Vector3){
        this.position = position;
        this.scale = new Vector3([1.0,1.0,1.0]);
        this.rotation = new Quaternion(0.0,1,0.0,0.0);
    }

    public getModelMatrix() : Float32Array
    {
        let modelMatrix = new Float32Array(16);
        glMatrix.mat4.identity(modelMatrix);

        let rot = this.rotation.toRotationMatrix();

        
        glMatrix.mat4.translate(modelMatrix, modelMatrix, this.position.toArr);
        glMatrix.mat4.scale(modelMatrix, modelMatrix, this.scale.toArr);
        glMatrix.mat4.mul(modelMatrix, modelMatrix, rot);

        return modelMatrix;
    }

    public Translate(direction : Vector3)
    {
        this.position.add(direction);
    }

    public setUniformScale(e : number)
    {
        this.scale = new Vector3([e, e, e]);
    }
}