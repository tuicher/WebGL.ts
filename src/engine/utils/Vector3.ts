/**
 * Represents a 3D vector with operations for basic vector math.
 */
export class Vector3{
    private value: [number, number, number];
    /**
     * Gets the x-component of the vector.
     */
    public get x(): number { return this.value[0];}

    /**
     * Gets the y-component of the vector.
     */
    public get y(): number { return this.value[1];}

    /**
     * Gets the z-component of the vector.
     */
    public get z(): number { return this.value[2];}

    /**
     * Converts the vector to an array.
     * @returns An array of the vector components.
     */
    public get toArr() : [number, number, number] { return this.value; }

    static UP = Object.freeze([0.0, 1.0, 0.0]);
    static DOWN = Object.freeze([0.0, -1.0, 0.0]);
    static RIGHT = Object.freeze([1.0, 0.0, 0.0]);
    static LEFT = Object.freeze([-1.0, 0.0, 0.0]);
    static FORWARD = Object.freeze([0.0, 0.0, 1.0]);
    static BACKWARD = Object.freeze([0.0, 0.0, -1.0]);

    /**
     * Constructs a new Vector3 with the specified components.
     * @param {[number, number, number]} value A tuple of three numbers representing the vector components.
     */
    constructor(value: [number, number, number]){
        this.value = value;
    }

    /**
     * Normalizes this vector to a unit vector.
     * @returns A new vector with the same direction as the original but with a length of 1.
     */
    normalized(): [number, number, number]{
        const magnitude = Math.sqrt(this.value.reduce((sum, val) => sum + val * val, 0));
        return this.value.map(val => val / magnitude) as [number, number, number];
    }

    /**
     * Normalizes the vector to a unit vector.
     */
    normalize() {
        const magnitude = Math.sqrt(this.value.reduce((sum, val) => sum + val * val, 0));
        this.value = this.value.map(val => val / magnitude) as [number, number, number];
    }

    /**
     * Calculates the dot product of two vectors.
     * @param v The first vector.
     * @param w The second vector.
     * @returns The dot product of the two vectors.
     */
    static dot(v: Vector3, w: Vector3): number{
        return (v.x * w.x + v.y * w.y + v.z + w.z);
    }

    /**
     * Calculates the dot product with another vector.
     * @param v The other vector.
     * @returns The dot product.
     */
    dot(v: Vector3): number {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    /**
     * Multiplies each component of the given vector by a scalar and returns a new vector.
     * @param v The vector to be scaled.
     * @param k The scalar value to multiply with.
     * @returns A new vector resulting from the scalar multiplication.
     */
    static scalar(v:Vector3, k:number) : Vector3{
        return new Vector3(v.toArr.map(val => val * k) as [number, number, number]);
    }

    /**
     * Multiplies each component of the vector by a scalar.
     * @param k The scalar to multiply with.
     */
    scalar(k: number) {
        this.value = this.value.map(val => val * k) as [number, number, number];
    }

    /**
     * Adds two vectors and returns the result as a new vector.
     * @param v The first vector.
     * @param w The second vector.
     * @returns The resulting vector.
     */
    static add(v: Vector3, w: Vector3): Vector3{
        return new Vector3([
            v.x + w.x,
            v.y + w.y,
            v.z + w.z
        ]);
    }

    /**
     * Adds a vector to this vector.
     * @param v The vector to add.
     */
    add(v: Vector3) {
        this.value[0] = this.x + v.x;
        this.value[1] = this.y + v.y;
        this.value[2] = this.z + v.z;
    }

    /**
     * Subtracts one vector from another and returns the result as a new vector.
     * @param v The vector to subtract from.
     * @param w The vector to subtract.
     * @returns The resulting vector.
     */
    static sub(v: Vector3, w: Vector3): Vector3{
        return new Vector3([
            v.x - w.x,
            v.y - w.y,
            v.z - w.z
        ]);
    }

    /**
     * Subtracts a vector from this vector.
     * @param v The vector to subtract.
     */
    sub(v: Vector3) {
        this.value[0] = this.x - v.x;
        this.value[1] = this.y - v.y;
        this.value[2] = this.z - v.z;
    }

    /**
     * Calculates the cross product of two vectors and returns the result as a new vector.
     * @param v The first vector.
     * @param w The second vector.
     * @returns The resulting vector.
     */
    static cross(v: Vector3, w: Vector3): Vector3{
        return new Vector3([
            v.y * w.z - v.z * w.y,
            v.z * w.x - v.x * w.z,
            v.x * w.y - v.y * w.x
        ]);
    }

     /**
     * Calculates the cross product of this vector and another vector.
     * @param v The other vector.
     */
    cross(v : Vector3){
        this.value = [
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        ];
    }

    /**
     * Converts degrees to radians.
     * @param k The angle in degrees.
     * @returns The angle in radians.
     */
    static degToRads(k : number) : number {
        return k * Math.PI / 180;
    }

    /**
     * Rotates the vector around a specified axis by a given angle.
     * @param axis The axis to rotate around.
     * @param angle The rotation angle in degrees.
     */
    rotateAroundAxis(axis: [number, number, number], angle: number) {
        angle = Vector3.degToRads(angle);

        let normAxis = new Vector3(axis);
        normAxis.normalize();

        let cosAngle = Math.cos(angle);
        let sinAngle = Math.sin(angle);

        let crossProduct = normAxis;
        crossProduct.cross(this);

        let dotProduct = normAxis.dot(this);
        
        let parallelComponent = [normAxis.x * dotProduct, normAxis.y * dotProduct, normAxis.z * dotProduct];
    
        let rotatedVector = [
            cosAngle * this.x + sinAngle * crossProduct.x + (1 - cosAngle) * parallelComponent[0],
            cosAngle * this.y + sinAngle * crossProduct.y + (1 - cosAngle) * parallelComponent[1],
            cosAngle * this.z + sinAngle * crossProduct.z + (1 - cosAngle) * parallelComponent[2]
        ] as [number, number, number];
    
       this.value = rotatedVector;
    }
    
}