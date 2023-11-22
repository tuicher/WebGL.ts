const glMatrix = require('gl-matrix');

class Camera {
    position: [number, number, number];
    rotation: [number, number];

    constructor(position: [number, number, number]){
        this.position = position;
        this.rotation = [ 0.0, 0.0];
    }
}