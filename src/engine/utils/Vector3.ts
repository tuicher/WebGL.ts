export class Vector3{
    private value: [number, number, number];

    public get x(): number { return this.value[0];}
    public get y(): number { return this.value[1];}
    public get z(): number { return this.value[2];}

    toArray() : [number, number, number] { return this.value; }

    static UP = Object.freeze([0.0, 1.0, 0.0]);
    static DOWN = Object.freeze([0.0, -1.0, 0.0]);
    static RIGHT = Object.freeze([1.0, 0.0, 0.0]);
    static LEFT = Object.freeze([-1.0, 0.0, 0.0]);
    static FORWARD = Object.freeze([0.0, 0.0, 1.0]);
    static BACKWARD = Object.freeze([0.0, 0.0, -1.0]);

    constructor(value: [number, number, number]){
        this.value = value;
    }

    normalize() {
        const magnitude = Math.sqrt(this.value.reduce((sum, val) => sum + val * val, 0));
        this.value = this.value.map(val => val / magnitude) as [number, number, number];
    }

    dot(v: [number, number, number]) : number {
        return this.value.reduce((sum, val, i) => sum + val * v[i], 0);
    }

    scalar(k: number) {
        this.value = this.value.map(val => val * k) as [number, number, number];
    }

    add(v: [number, number, number]){
        this.value[0] = this.x + v[0];
        this.value[1] = this.y + v[1];
        this.value[2] = this.z + v[2];
    }

    sub(v: [number, number, number]){
        this.value[0] = this.x - v[0];
        this.value[1] = this.y - v[1];
        this.value[2] = this.z - v[2];
    }

    cross(v: [number, number, number]){
        this.value = [
            this.y * v[2] - this.z * v[1],
            this.z * v[0] - this.x * v[2],
            this.x * v[1] - this.y * v[0]
        ];
    }

    static degToRads(k : number) : number {
        return k * Math.PI / 180;
    }

    rotateAroundAxis(axis: [number, number, number], angle: number) {
        angle = Vector3.degToRads(angle);

        let normAxis = new Vector3(axis);
        normAxis.normalize();

        let cosAngle = Math.cos(angle);
        let sinAngle = Math.sin(angle);

        console.log('v-> [' + this.toArray() +']');
        let crossProduct = normAxis;
        console.log('n-> [' + crossProduct.toArray() +']');
        crossProduct.cross(this.value);
        console.log('r-> [' + crossProduct.toArray() +']');

        let dotProduct = normAxis.dot(this.value);
        
        let parallelComponent = [normAxis.x * dotProduct, normAxis.y * dotProduct, normAxis.z * dotProduct];
    
        let rotatedVector = [
            cosAngle * this.x + sinAngle * crossProduct.x + (1 - cosAngle) * parallelComponent[0],
            cosAngle * this.y + sinAngle * crossProduct.y + (1 - cosAngle) * parallelComponent[1],
            cosAngle * this.z + sinAngle * crossProduct.z + (1 - cosAngle) * parallelComponent[2]
        ] as [number, number, number];
    
       this.value = rotatedVector;
    }
    
}