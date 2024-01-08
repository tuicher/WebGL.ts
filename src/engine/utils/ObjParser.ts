type Indexes = {
    vIndexes: number[];
    tIndexes: number[];
    nIndexes: number[];
};

export class ObjParser {
    private vertexPositions: number[];
    private vertexColors: number[];
    private vertexNormals: number[];
    private vertexTexCoords: number[];

    private textCoordData: number[][];
    private normalsData: number[][];

    private indexes: Indexes;
    
    private stats: any;

    constructor(objContent: string) {
        this.vertexPositions = [];
        this.vertexColors = [];
        this.vertexNormals = [];
        this.vertexTexCoords = [];

        this.textCoordData = [];
        this.normalsData = [];

        this.indexes = {
            vIndexes: [],
            tIndexes: [],
            nIndexes: []
        }

        this.stats = {
            numVertex: 0,
            numTriangles: 0
        }

        this.parse(objContent);
    }

    parse(objContent: string): void {
        this.stats.numVertex = 0;
        let tFaces = [];
        const lines = objContent.split('\n');
        for (const line of lines)
        {
            const parts = line.trim().split(/\s+/);

            switch(parts[0]) 
            {
                case 'v':
                    this.stats.numVertex++;
                    this.vertexPositions.push(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]));

                    if (parts.length === 7)
                    {
                        this.vertexColors.push(parseFloat(parts[4]), parseFloat(parts[5]), parseFloat(parts[6]), 1.0);
                    }
                    break;
                case 'vn':
                    this.normalsData.push([parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])]);
                    break;
                case 'vt':
                    this.textCoordData.push([parseFloat(parts[1]), parseFloat(parts[2])]);
                    break;
                case 'f':
                    const face = parts.slice(1).map(part => 
                        {
                            return part.split('/').map(p => p ? parseInt(p, 10) : -1);
                        });
                    
                    tFaces.push(face);
                    break;
            }
        }

        this.calculateIndexes(tFaces);
        this.calculateArrays();
    }



    private calculateIndexes(faces: number[][][]): void 
    {
        this.stats.numTriangles = 0;

        for (let face of faces) {
            const vertexIndices = face.map(vertex => vertex[0] - 1);
            const texCoordIndices = face.map(vertex => vertex[1] - 1);
            const normalIndices = face.map(vertex => vertex[2] - 1);

            for (let i = 1; i < vertexIndices.length - 1; i++) {
                this.stats.numTriangles++;
                this.indexes.vIndexes.push(vertexIndices[0], vertexIndices[i], vertexIndices[i + 1]);
                this.indexes.tIndexes.push(texCoordIndices[0], texCoordIndices[i], texCoordIndices[i + 1]);
                this.indexes.nIndexes.push(normalIndices[0], normalIndices[i], normalIndices[i + 1]);
            }
        }
    }

    private calculateArrays()
    {
        this.vertexNormals = this.extractIndexedData(this.indexes.nIndexes, this.normalsData);
        this.vertexTexCoords = this.extractIndexedData(this.indexes.tIndexes, this.textCoordData);
    }

    private  extractIndexedData(indexes: number[], data: number[][]): number[] {
        let extractedData: number[] = [];

        for (let index of indexes) {
            let dataIndex = index - 1;
    
            if (dataIndex >= 0 && dataIndex < data.length) {
                extractedData = extractedData.concat(data[dataIndex]);
            }
        }
        return extractedData;
    }

    public getVertexPositions(): number[] {
        return this.vertexPositions;
    }

    public getVertexColors(): number[] {
        return this.vertexColors;
    }

    public getVertexNormals(): number[] {
        return this.vertexNormals;
    }

    public getVertexTextCoord(): number[] {
        return this.vertexNormals;
    }

    public getVertexIndexes(): number[] {
        return this.indexes.vIndexes;
    }


}
