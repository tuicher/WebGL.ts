/**
 * ----------------------------------------------------------------
 *  This code was written by Javier R. Huertas (@tuicher)
 *
 *  Licensed under the MIT License. 
 *  For more details, see the LICENSE file in the repository.
 *
 *  Repository: https://github.com/tuicher/WebGL.ts
 * ----------------------------------------------------------------
 */


export class ObjParser {
    private vertexPositions: number[];
    private vertexColors: number[];
    private vertexNormals: number[];
    private vertexTexCoords: number[];
    private indexes: number[];
    private faces: number[][][];

    constructor(objContent: string) {
        this.vertexPositions = [];
        this.vertexColors = [];
        this.vertexNormals = [];
        this.vertexTexCoords = [];
        this.faces = [];
        this.indexes = [];

        this.parse(objContent);
    }

    parse(objContent: string): void {
        const lines = objContent.split('\n');
        for (const line of lines) {
            const parts = line.trim().split(/\s+/);

            switch(parts[0]) {
                case 'v':
                    this.vertexPositions.push(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]));

                    if (parts.length === 7) 
                    {
                        this.vertexColors.push(parseFloat(parts[4]), parseFloat(parts[5]), parseFloat(parts[6]), 1.0);
                    }
                    break;
                case 'vn':
                    this.vertexNormals.push(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]));
                    break;
                case 'vt':
                    this.vertexTexCoords.push(parseFloat(parts[1]), parseFloat(parts[2]));
                    break;
                case 'f':
                    const face = parts.slice(1).map(part => {
                        // Dividimos cada parte de la cara en sus componentes (vértice, textura, normal)
                        // y convertimos cada índice en un número. Si algún componente falta, usamos -1
                        return part.split('/').map(p => p ? parseInt(p, 10) : -1);
                    });
                    this.faces.push(face);
                    break;
            }
        }

        this.getIndices();
    }

    getIndices(): void {
        this.indexes = [];
        // Iterar sobre todas las caras
        for (let face of this.faces) {
            // Asumimos que la primera posición en cada subarray es el índice del vértice
            // y lo restamos 1 para ajustarlo a la indexación base-0 de WebGL
            const vertexIndices = face.map(vertex => vertex[0] - 1);

            // Para polígonos con más de 3 vértices, creamos triángulos
            // utilizando el primer vértice y cada par de vértices adyacentes
            for (let i = 1; i < vertexIndices.length - 1; i++) {
                this.indexes.push(vertexIndices[0], vertexIndices[i], vertexIndices[i + 1]);
            }
        }
    }

    public getVertexPositions(): number[] {
        return this.vertexPositions;
    }

    public getVertexColors(): number[] {
        return this.vertexColors;
    }

    public getIndexes(): number[] {
        return this.indexes;
    }
}

