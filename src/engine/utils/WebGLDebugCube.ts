/*
* ----------------------------------------------------------------
*  This code was written by Javier R. Huertas (@tuicher)
*
*  Licensed under the MIT License. 
*  For more details, see the LICENSE file in the repository.
*
*  Repository: https://github.com/tuicher/WebGL.ts
* ----------------------------------------------------------------
*/

class WebGLDebugCube {
    private static vertices: Float32Array = new Float32Array([
       // Front
        -1.0, -1.0,  1.0,
        1.0, -1.0,  1.0,
        1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,
    
        // Back
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0, -1.0, -1.0,
    
        // Top
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
        1.0,  1.0,  1.0,
        1.0,  1.0, -1.0,
    
        // Bottom
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,
        
        // Right
        1.0, -1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0,  1.0,  1.0,
        1.0, -1.0,  1.0,
    
        // Left
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0,
    ]);

    private static indices: Uint16Array = new Uint16Array([
        0, 1, 2,    0, 2, 3,
        5, 4, 6,    6, 4, 7,
        8, 9, 10,   8, 10, 11,
        13, 12, 14, 15, 14, 12,
        16, 17, 18, 16, 18, 19,
        21, 20, 22, 22, 20, 23,   
    ]);

    private static faceColors: Float32Array;

    // Static initialization of face colors
    static initializeFaceColors(): void {
        let rawFaceColors = [
            [1.0,  0.0,  0.0,  1.0],    // Frente: rojo
            [0.0,  1.0,  0.0,  1.0],    // Back: verde
            [0.0,  0.0,  1.0,  1.0],    // Top: azul
            [1.0,  1.0,  0.0,  1.0],    // Bottom: amarillo
            [1.0,  0.0,  1.0,  1.0],    // Right: púrpura
            [0.0,  1.0,  1.0,  1.0],    // Left: cyan
        ];

        let colors = [];
        for (let color of rawFaceColors) {
            colors.push(...color, ...color, ...color, ...color);
        }
        WebGLDebugCube.faceColors = new Float32Array(colors);
    }

    static getVertices(): Float32Array {
        return WebGLDebugCube.vertices;
    }

    static getIndices(): Uint16Array {
        return WebGLDebugCube.indices;
    }

    static getFaceColors(): Float32Array {
        return WebGLDebugCube.faceColors;
    }
}

// Initialize the face colors when the class is loaded
WebGLDebugCube.initializeFaceColors();

export default WebGLDebugCube;