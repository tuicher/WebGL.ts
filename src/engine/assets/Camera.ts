import { Vector3 } from "engine/utils/Vector3";
const glMatrix = require('gl-matrix');

class Camera {
    private position: Vector3;
    private rotation: [number, number];
    private lookAt: Vector3;
    private up: Vector3;
    private right: Vector3;

    constructor(position: [number, number, number]){
        this.position = new Vector3(position);
        this.rotation = [ 0.0, 0.0];
        this.lookAt = new Vector3([0.0,0.0,-1.0]);
        this.up = new Vector3([0.0,1.0,0.0]);
        this.right = new Vector3([0.0,0.0,0.0]);
        this.computeRight();

    }

    computeRight()
    {
        this.right = new Vector3(this.lookAt.toArray());
        this.right.cross(this.up.toArray());

    }
}