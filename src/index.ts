import { initShaderProgram } from "./engine/utils/ShaderLoader";
import { printMatrix4x4 } from "./engine/utils/MatrixUtils";
import { Vector3 } from './engine/utils/Vector3';
import { Camera } from "./engine/assets/Camera";
import { loadTextures } from "./engine/utils/TextureLoader";
import WebGLDebugCube  from "./engine/utils/WebGLDebugCube";
const glMatrix = require('gl-matrix');
const OBJ = require('webgl-obj-loader');
const dat = require('dat.gui');
// Meshes
import diamond from '../models/DiaGem.obj';
// Shaders
import vert from './shaders/0_vert.glsl';
import frag from './shaders/0_frag.glsl';
// Textures 
import uvText from '../models/textures/UVchecker.jpg'
import aText from '../models/textures/metal/Metal046A_4K-PNG_Color.png';
import rText from '../models/textures/metal/Metal046A_4K-PNG_Roughness.png';

let mainCam = new Camera([0, 0, 10]);

let gui = new dat.GUI();

let settings = {
	fov: 60
};

let fovController = gui.add(settings,'fov', 1, 120);

fovController.onChange(function(value: number) {
	mainCam.fov = (value * Math.PI) / 180;;
	console.log(value);
});

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

function render(gl: WebGLRenderingContext, programInfo: any, resources: any)
{
	drawScene(gl, programInfo, resources.meshes.diamond, resources.textures);

	// Hold loop
	 requestAnimationFrame(() => render(gl, programInfo, resources));
}

function drawScene(gl: WebGLRenderingContext, programInfo: any, meshInfo: any, textInfo: any): void {

	/**************************************/
	/********** Positions Update **********/
	/**************************************/

	gl.enable(gl.DEPTH_TEST);
	mainCam.far = 1000.0;

	

	/****************************************/
	/********** Matrix Calculation **********/
	/****************************************/

    let modelMatrix = new Float32Array(16);
    glMatrix.mat4.identity(modelMatrix);

    let scaleMatrix = new Float32Array(16);
	glMatrix.mat4.identity(scaleMatrix);

	let identityMatrix = new Float32Array(16);
	glMatrix.mat4.identity(identityMatrix);

	let angle = (performance.now() / 1000 / 12) * 2 * Math.PI;
	glMatrix.mat4.rotate(modelMatrix, modelMatrix, angle, [0.0, 1.0, 0.0]);
	glMatrix.mat4.rotate(modelMatrix, modelMatrix, angle, [1.0, 1.0, 0.0]);

	let scaleFactor = 1.5;
	glMatrix.mat4.scale(scaleMatrix, identityMatrix, [
		scaleFactor,
		scaleFactor,
		scaleFactor,
	]);

	glMatrix.mat4.mul(modelMatrix, modelMatrix, scaleMatrix);

	mainCam.configureProjection();

    /**********************************/
	/********** Bind Buffers **********/
	/**********************************/

	gl.useProgram(programInfo.program);

	// Vertex Buffer
	let vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

	let vertices = WebGLDebugCube.getVertices();
	// Send data to buffer
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	// Color Buffer
	let colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

	let colors = WebGLDebugCube.getFaceColors();
	// Send data to buffer
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

	// Assing vertex data
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	let vertexPosition = gl.getAttribLocation(programInfo.program, 'aVertexPosition');
	gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
  	gl.enableVertexAttribArray(vertexPosition);

	// Assing colors data
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	let vertexColor = gl.getAttribLocation(programInfo.program, 'aVertexColor');
	gl.vertexAttribPointer(vertexColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vertexColor);

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	var indexBuffer = gl.createBuffer();
  	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

	let indices = WebGLDebugCube.getIndices();
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

	/*
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
	*/

	/*
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
	*/
	//gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, meshInfo.indexBuffer);

	/**********************************/
	/***** Set the shader uniforms ****/
	/**********************************/

	//gl.useProgram(programInfo.program);
	
	gl.uniformMatrix4fv(
		programInfo.uLocations.projViewMatrix,
		false,
		mainCam.projViewMatrix
	);

	gl.uniformMatrix4fv(
		programInfo.uLocations.modelMatrix,
		false,
		modelMatrix
	);

	/*
	gl.uniformMatrix4fv(
		programInfo.uniformLocations.modelMatrix,
		false,
		modelMatrix
	);

	var normalMatrix = glMatrix.mat4.create();
	glMatrix.mat4.invert(normalMatrix, modelMatrix);
	glMatrix.mat4.transpose(normalMatrix, normalMatrix);

	gl.uniformMatrix4fv(
		programInfo.uniformLocations.normalMatrix,
		false,
		normalMatrix
	);
	*/

	// Illumination Uniforms
	//gl.uniform3fv(programInfo.uniformLocations.lightPos, [50, 50, 100]);
	//gl.uniform3fv(programInfo.uniformLocations.lightColor, [0.9, 0.9, 1]);
	//gl.uniform3fv(programInfo.uniformLocations.viewPos, mainCam.pos.toArr);

	// Tell WebGL we want to affect texture unit 0
	//gl.activeTexture(gl.TEXTURE0);

	// Bind the texture to texture unit 0
	//let index = gl.bindTexture(gl.TEXTURE_2D, textInfo.colorTexture.texture);

	// Tell the shader we bound the texture to texture unit 0
	//gl.uniform1i(programInfo.uniformLocations.cSampler, 0);

	//gl.activeTexture(gl.TEXTURE1);
	//index = gl.bindTexture(gl.TEXTURE_2D, textInfo.roughnessTexture.texture);
	//gl.uniform1i(programInfo.uniformLocations.rSampler, 1);
	
	/*
	gl.drawElements(
		gl.TRIANGLES,
		meshInfo.indexBuffer.numItems,
		gl.UNSIGNED_SHORT,
		0
	);
	*/
	

	// Draw Call
	gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
	
}

function main(resources : any): void {
    const gl = initWebGL();

    if (!gl)
    {
        alert(
			"Unable to initialize WebGL. Your browser or machine may not support it."
		);
		return;
    }

	mainCam.aspectRatio = gl.canvas.width / gl.canvas.height;

    for (const i in resources.meshes)
	{
        OBJ.initMeshBuffers(gl, resources.meshes[i]);
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
		aLocations: {
			vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition")
		},
		uLocations: {
			projViewMatrix: gl.getUniformLocation(shaderProgram, "uProjViewMatrix"),
			modelMatrix: gl.getUniformLocation(shaderProgram, "uModelMatrix")
		}
	}
	/*
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
*/
	loadTextures(gl, resources.textures).then(() =>
		requestAnimationFrame(() => 
			render(gl, programInfo, resources))
	);
	
    //render(gl, programInfo, resources);
}

// Load .obj s and Textures
window.onload = function() {

    let resources = {
		meshes:
		{
			'diamond': new OBJ.Mesh(diamond),
		},
		textures:{
			colorTexture:{
				src: aText,
				texture: undefined
			},
			roughnessTexture:{
				src: rText,
				texture: undefined
			}
		}
	}

    main(resources);
}