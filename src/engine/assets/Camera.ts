import { Vector3 } from "../utils/math/Vector3";
const glMatrix = require('gl-matrix');

export class Camera {
    private position: Vector3;
    public rotation: [number, number];

    private lookAt: Vector3;
    private up: Vector3;
    private right: Vector3;

    private fov_: number;
    private aspectRatio_: number;
    private near_: number;
    private far_: number;

    private viewMatrix_: Float32Array;
    private projMatrix_: Float32Array;
    private projViewMatrix_: Float32Array;

    public get fov(): number {
        return this.fov_;
    }

    public set fov(value: number) {
        this.fov_ = value;
    }

    public get aspectRatio(): number {
        return this.aspectRatio_;
    }

    public set aspectRatio(value: number) {
        this.aspectRatio_ = value;
    }

    public get near(): number {
        return this.near_;
    }

    public set near(value: number) {
        this.near_ = value;
    }

    public get far(): number {
        return this.far_;
    }

    public set far(value: number) {
        this.far_ = value;
    }

    public get viewMatrix(): Float32Array {
        return this.viewMatrix_;
    }

    public get projMatrix(): Float32Array {
        return this.projMatrix_;
    }

    public get projViewMatrix(): Float32Array{
        glMatrix.mat4.mul(this.projViewMatrix_, this.projMatrix_, this.viewMatrix_);
        return this.projViewMatrix_;
    }

    public get pos(): Vector3{
        return this.position;
    }

    constructor(position: [number, number, number]){
        this.position = new Vector3(position);
        this.rotation = [ 0.0, 0.0];

        this.lookAt = new Vector3([0.0,0.0,-1.0]);
        this.up = new Vector3([0.0,1.0,0.0]);
        this.right = new Vector3([0.0,0.0,0.0]);
        this.computeRight();

        this.fov_ = (60 * Math.PI) / 180;
        this.aspectRatio_ = 16/9;
        this.near_ = 0.1;
        this.far_ = 100;

        this.viewMatrix_ = new Float32Array(16);
        this.projMatrix_ = new Float32Array(16);
        this.projViewMatrix_ = new Float32Array(16);

        this.updateView();
        this.configureProjection();
    }

    computeRight()
    {
        this.right = new Vector3(this.lookAt.toArr);
        this.right.cross(this.up);
        this.right.normalize;
    }

    updateView(){
        glMatrix.mat4.lookAt(
            this.viewMatrix_,
            this.position.toArr,
            Vector3.add(this.position, this.lookAt).toArr,
            this.up.toArr
        )
    }

    configureProjection(){
        glMatrix.mat4.perspective(
            this.projMatrix_,
            this.fov,
            this.aspectRatio,
            this.near,
            this.far
        );
    }

    translate(displacement:Vector3) {
        this.position.add(displacement);
    }

    rotate(xAxis:number, yAxis:number){
        this.rotation[0] += xAxis;
        this.rotation[1] += yAxis;

        this.rotateVectors();
    }

    handleEvent(event: KeyboardEvent, deltaTime: number): void {
        let velocidad = 4.0 * deltaTime;
        let rotSpeed = Vector3.degToRads(10.5);

        switch (event.key) {
            case 'W':
            case 'w':
                this.translate(Vector3.scalar(this.lookAt, event.ctrlKey ? velocidad * 2 : velocidad));
                break;
            case 'S':
            case 's':
                this.translate(Vector3.scalar(this.lookAt, event.ctrlKey ? -velocidad * 2 : -velocidad));
                break;
            case 'A':
            case 'a':
                this.translate(Vector3.scalar(this.right, event.ctrlKey ? -velocidad * 2 : -velocidad));
                break;
            case 'D':
            case 'd':
                this.translate(Vector3.scalar(this.right, event.ctrlKey ? velocidad * 2 : +velocidad));
                break;
            case 'Shift':
                this.translate(Vector3.scalar(Vector3.UP, event.ctrlKey ? velocidad * 2 : velocidad));
                break;
            case ' ':
                this.translate(Vector3.scalar(Vector3.UP, event.ctrlKey ? velocidad * 2 : -velocidad));
            case 'ArrowUp':
                this.rotate(0.0, event.ctrlKey ? rotSpeed * 2 : -rotSpeed);
                break;
            case 'ArrowDown':
                this.rotate(0.0, event.ctrlKey ? rotSpeed * 2 : rotSpeed);
                break;
            case 'ArrowLeft':
                this.rotate(event.ctrlKey ? rotSpeed * 2 : rotSpeed, 0.0);
                break;
            case 'ArrowRight':
                this.rotate(event.ctrlKey ? rotSpeed * 2 : -rotSpeed, 0.0);
                break;
        }

        this.updateView();
    }

    rotateVectors(){
        

        this.lookAt = Vector3.rotateAroundAxis(
            Vector3.BACKWARD,
            this.up.toArr,
            this.rotation[1]
        )

        //console.log('b - '+this.lookAt.toArr)
        this.computeRight();

        this.up = Vector3.rotateAroundAxis(
            Vector3.UP,
            this.right.toArr,
            this.rotation[0]
        )
        
        this.lookAt = Vector3.rotateAroundAxis(
            this.lookAt,
            this.right.toArr,
            this.rotation[0]
        )

        this.computeRight();

        this.updateView();
    }
}