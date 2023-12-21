import { initShaderProgram } from "./engine/utils/ShaderLoader";
import { printMatrix4x4 } from "./engine/utils/MatrixUtils";
import { Vector3 } from './engine/utils/Vector3';
import { Camera } from "./engine/assets/Camera";
const glMatrix = require('gl-matrix');
const OBJ = require('webgl-obj-loader');
// Meshes
import diamond from '../models/DiaGem.obj';
// Shaders
import vert from './shaders/0_vert.glsl';
import frag from './shaders/0_frag.glsl';


function initWebGL(): WebGLRenderingContext | null {
    const canvas = document.getElementById('glCanvas') as HTMLCanvasElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const gl = canvas.getContext('webgl');

    if (!gl) {
        console.error('WebGL no está disponible en tu navegador');
        return null;
    }

    return gl;
}

function render(gl: WebGLRenderingContext, programInfo: any, meshInfo: any, textInfo: any): void {
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.EQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //Camera config

    //Matrix
    let modelMatrix = new Float32Array(16);
    glMatrix.mat4.identity(modelMatrix);

    let scaleMatrix = new Float32Array(16);

	let identityMatrix = new Float32Array(16);
	glMatrix.mat4.identity(identityMatrix);

	let angle = (performance.now() / 1000 / 12) * 2 * Math.PI;
	glMatrix.mat4.rotate(modelMatrix, modelMatrix, angle, [0.0, 1.0, 0.0]);
	glMatrix.mat4.rotate(modelMatrix, modelMatrix, angle, [1.0, 1.0, 0.0]);


	// Definir un factor de escala
	let scaleFactor = 50.0;
	glMatrix.mat4.scale(scaleMatrix, identityMatrix, [
		scaleFactor,
		scaleFactor,
		scaleFactor,
	]);

	glMatrix.mat4.mul(modelMatrix, modelMatrix, scaleMatrix);

    //let viewMatrix = mainCam.viewMatrix;
	//let projectionMatrix = mainCam.projectionMatrix;

    /**********************************/
	/********** Bind Buffers **********/
	/**********************************/

	gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
	gl.bindBuffer(gl.ARRAY_BUFFER, meshInfo.vertexBuffer);
	gl.vertexAttribPointer(
		programInfo.attribLocations.vertexPosition, // attribute
		meshInfo.vertexBuffer.itemSize, // size
		gl.FLOAT, // type
		false, // normalized?
		0, // stride
		0 // array buffer offset
	);

	gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
	gl.bindBuffer(gl.ARRAY_BUFFER, meshInfo.textureBuffer);
	gl.vertexAttribPointer(
		programInfo.attribLocations.textureCoord, // attribute
		meshInfo.textureBuffer.itemSize, // size
		gl.FLOAT, // type
		false, // normalized?
		0, // stride
		0 // array buffer offset
	);

	gl.enableVertexAttribArray(programInfo.attribLocations.normalCoord);
	gl.bindBuffer(gl.ARRAY_BUFFER, meshInfo.normalBuffer);
	gl.vertexAttribPointer(
		programInfo.attribLocations.normalCoord, // attribute
		meshInfo.normalBuffer.itemSize, // size
		gl.FLOAT, // type
		false, // normalized?
		0, // stride
		0 // array buffer offset
	);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, meshInfo.indexBuffer);
}

function main(meshes : any): void {
    const gl = initWebGL();

    if (!gl)
    {
        alert(
			"Unable to initialize WebGL. Your browser or machine may not support it."
		);
		return;
    }

    for (const i in meshes)
	{
        OBJ.initMeshBuffers(gl, meshes[i]);
    }
    
    const shaderProgram = initShaderProgram(gl, vert, frag)


    if(!shaderProgram){
        alert(
			"Error creating shaderProgram"
		);
        return;
    }

    // Uniform info
    const programInfo = {
		program: shaderProgram,
		attribLocations: {
			vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
			textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord"),
			normalCoord: gl.getAttribLocation(shaderProgram, "aNormalCoord"),
		},
		uniformLocations: {
			projectionMatrix: gl.getUniformLocation(
				shaderProgram,
				"uProjectionMatrix"
			),
			worldMatrix: gl.getUniformLocation(shaderProgram, "uWorldMatrix"),
			viewMatrix: gl.getUniformLocation(shaderProgram, "uViewMatrix"),
			modelMatrix: gl.getUniformLocation(shaderProgram, "uModelMatrix"),
			normalMatrix: gl.getUniformLocation(shaderProgram, "uNormalMatrix"),
			uSampler: gl.getUniformLocation(shaderProgram, "cSampler"),
			rSampler: gl.getUniformLocation(shaderProgram, "rSampler"),
			lightPos: gl.getUniformLocation(shaderProgram, "lightPos"),
			lightColor: gl.getUniformLocation(shaderProgram, "lightColor"),
			viewPos: gl.getUniformLocation(shaderProgram, "viewPos"),
		},
	};


	
    render(gl, programInfo, meshes.diamond, null);
}

// Load .obj s and Textures
window.onload = function() {
	let camera = new Camera([0.0,0.0,0.0]);

    let resources = {
        'diamond': new OBJ.Mesh(diamond),
    }
    main(resources);
}
