import { Vector3 } from "./Vector3";

/**
 * Represents a quaternion for 3D rotations.
 * Quaternions are used in 3D graphics to avoid gimbal lock and provide smooth rotational interpolation.
 */
export class Quaternion {
    x: number;
    y: number;
    z: number;
    w: number;

    /**
     * Constructs a new Quaternion.
     * @param x The x component of the quaternion.
     * @param y The y component of the quaternion.
     * @param z The z component of the quaternion.
     * @param w The w component of the quaternion (real part).
     */
    constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    /**
     * Normalizes the quaternion to unit length, making it a valid rotation quaternion.
     * @returns The normalized quaternion.
     */
    normalize(): Quaternion {
        const norm = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
        this.x /= norm;
        this.y /= norm;
        this.z /= norm;
        this.w /= norm;
        return this;
    }

    /**
     * Multiplies this quaternion by another quaternion.
     * This represents the composition of two rotations.
     * @param quaternion The quaternion to multiply with.
     * @returns The resulting quaternion.
     */
    multiply(quaternion: Quaternion): Quaternion {
        const x = this.x, y = this.y, z = this.z, w = this.w;
        const qx = quaternion.x, qy = quaternion.y, qz = quaternion.z, qw = quaternion.w;

        this.x = w * qx + x * qw + y * qz - z * qy;
        this.y = w * qy + y * qw + z * qx - x * qz;
        this.z = w * qz + z * qw + x * qy - y * qx;
        this.w = w * qw - x * qx - y * qy - z * qz;
        return this;
    }

    /**
     * Converts the quaternion into a rotation matrix for use in 3D graphics, particularly useful in WebGL.
     * @returns The rotation matrix as an array of 16 elements.
     */
    toRotationMatrix(): Float32Array {
        const matrix = new Float32Array(16).fill(0);
        const x = this.x, y = this.y, z = this.z, w = this.w;

        const xx = x * x;
        const yy = y * y;
        const zz = z * z;
        const xy = x * y;
        const xz = x * z;
        const yz = y * z;
        const wx = w * x;
        const wy = w * y;
        const wz = w * z;

        matrix[0] = 1 - 2 * (yy + zz);
        matrix[1] = 2 * (xy + wz);
        matrix[2] = 2 * (xz - wy);

        matrix[4] = 2 * (xy - wz);
        matrix[5] = 1 - 2 * (xx + zz);
        matrix[6] = 2 * (yz + wx);

        matrix[8] = 2 * (xz + wy);
        matrix[9] = 2 * (yz - wx);
        matrix[10] = 1 - 2 * (xx + yy);

        matrix[15] = 1;

        return matrix;
    }

     /**
     * Returns the inverse of this quaternion.
     * @returns The inverse quaternion.
     */
     inverse(): Quaternion {
        return new Quaternion(-this.x, -this.y, -this.z, this.w);
    }

    /**
     * Rotates a 3D vector using this quaternion.
     * @param vector The 3D vector to rotate.
     * @returns The rotated vector.
     */
    rotateVector(vector: Vector3): Vector3 {
        const vectorQuat = new Quaternion(vector.x, vector.y, vector.z, 0);
        const inverseQuat = this.inverse();

        // q * v * q⁻¹
        const rotatedQuat = this.multiply(vectorQuat).multiply(inverseQuat);

        return new Vector3([rotatedQuat.x, rotatedQuat.y, rotatedQuat.z]);
    }

    /**
     * Rotates the quaternion around a given axis by a specified angle.
     * @param axis The axis to rotate around (must be a unit vector).
     * @param angle The angle in radians to rotate.
     * @returns The rotated quaternion.
     */
    rotateAroundAxis(axis: Vector3, angle: number): Quaternion {
        // Normalizar el vector del eje para asegurarse de que sea unitario
        axis.normalize();

        // Calcular la mitad del ángulo y su seno y coseno
        const halfAngle = angle / 2;
        const sinHalfAngle = Math.sin(halfAngle);
        const cosHalfAngle = Math.cos(halfAngle);

        // Crear un cuaternión de rotación
        const rotationQuaternion = new Quaternion(
            axis.x * sinHalfAngle,
            axis.y * sinHalfAngle,
            axis.z * sinHalfAngle,
            cosHalfAngle
        );

        // Multiplicar el cuaternión actual por el cuaternión de rotación
        return this.multiply(rotationQuaternion).normalize();
    }

}