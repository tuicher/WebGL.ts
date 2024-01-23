import { initShaderProgram } from "./engine/utils/ShaderLoader";
import { printMatrix4x4 } from "./engine/utils/math/MatrixUtils";
import { Vector3 } from './engine/utils/math/Vector3';
import { Camera } from "./engine/assets/Camera";
import { loadTextures } from "./engine/utils/TextureLoader";
import WebGLDebugCube  from "./engine/utils/WebGLDebugCube";
import { ObjParser } from "./engine/utils/ObjParser";
import { Transform } from "./engine/assets/Transform";
const glMatrix = require('gl-matrix');
const OBJ = require('webgl-obj-loader');
const dat = require('dat.gui');
// Meshes
//import mesh from '../models/IceGem.obj';
import mesh from '../models/untitled.obj';
//import mesh from "../models/IcoSphere.obj";
import gun from '../models/PistolModel/Pistol_Model.obj';
//import mesh from '../models/PRIVATE/TCT_Grenade.obj';
// Shaders
import vert from './shaders/1_vert.glsl';
import frag from './shaders/1_frag.glsl';
// Textures 
import uvText from '../models/textures/lol.png'
import cText from '../models/PistolModel/_Berreta M9_Material_BaseColor.png';
import rText from '../models/textures/metal/Metal046A_4K-PNG_Roughness.png';

let mainCam = new Camera([0, 0, 10]);

let axis = [Vector3.UP, Vector3.RIGHT];

let objects: any[] = [];

let gui = new dat.GUI();

let settings = {
	fov: 60,
	meshScale: 1.0
};

let fovController = gui.add(settings,'fov', 0.01, 120);
let meshScaleController = gui.add(settings,'meshScale', 0.01, 10);

fovController.onChange(function(value: number) {
	mainCam.fov = (value * Math.PI) / 180;
	//console.log(value);
});

meshScaleController.onChange(function(value: number) {
	for (const obj of objects) {
        if (obj.transform && obj.transform.setUniformScale) {
            obj.transform.setUniformScale(value);
        }
    }
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


// Definir la frecuencia deseada (FPS)
const fps = 120;
const fpsInterval = 1000 / fps;

function render(gl: WebGLRenderingContext, programInfo: any, resources: any)
{
    // Código de renderización
    drawScene(gl, programInfo, resources);

    // Programar la próxima llamada
    setTimeout(() => render(gl, programInfo, resources), fpsInterval);
}
/*
function render(gl: WebGLRenderingContext, programInfo: any, resources: any)
{
	drawScene(gl, programInfo, resources.meshes.test, resources.textures);

	// Hold loop
	 requestAnimationFrame(() => render(gl, programInfo, resources));
}
*/

function drawScene(gl: WebGLRenderingContext, programInfo: any, resources: any): void {

	/**************************************/
	/********** Positions Update **********/
	/**************************************/

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
 
    // Clear the canvas AND the depth buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	mainCam.far = 1000.0;
	mainCam.configureProjection();

	let index = -1;
	let jndex = 0;

	for (const obj of resources.objects)
	{
		// Actualiza la transformación del objeto

		let aux = axis[jndex]
        obj.transform.rotation.rotateAroundAxis(aux, index * 0.5 / fps);
		index *= -1;
		if(index == -1)
		{
			jndex++;
		}

		gl.useProgram(programInfo.program);

		 // ProjView
		 gl.uniformMatrix4fv(
            programInfo.uLocations.projViewMatrix,
            false,
            mainCam.projViewMatrix
        );

		// Model
        gl.uniformMatrix4fv(
            programInfo.uLocations.modelMatrix,
            false,
            obj.transform.getModelMatrix()
        );

		OBJ.initMeshBuffers(gl, obj.mesh);

		// Enlazar y configurar el buffer de vértices
		gl.bindBuffer(gl.ARRAY_BUFFER, obj.mesh.vertexBuffer);
		gl.vertexAttribPointer(
			programInfo.aLocations.vertexPosition,
			obj.mesh.vertexBuffer.itemSize,
			gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(programInfo.aLocations.vertexPosition);
	
		// Enlazar y configurar el buffer de coordenadas de textura
		gl.bindBuffer(gl.ARRAY_BUFFER, obj.mesh.textureBuffer);
		gl.vertexAttribPointer(
			programInfo.aLocations.textureCoord,
			obj.mesh.textureBuffer.itemSize,
			gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(programInfo.aLocations.textureCoord);
	
		// Cargar y enlazar la textura del objeto
		let textureInfo = resources.textures[obj.texture];
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
		gl.uniform1i(programInfo.uLocations.cSampler, 0);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.mesh.indexBuffer);
        gl.drawElements(gl.TRIANGLES, obj.mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	}
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
/*
    for (const i in resources.meshes)
	{
        OBJ.initMeshBuffers(gl, resources.meshes[i]);
    }
*/
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
			vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
			textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord"),
		},
		uLocations: {
			projViewMatrix: gl.getUniformLocation(shaderProgram, "uProjViewMatrix"),
			modelMatrix: gl.getUniformLocation(shaderProgram, "uModelMatrix"),
			cSampler: gl.getUniformLocation(shaderProgram, "cSampler"),
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
	{
		//console.log(resources.textures);
		requestAnimationFrame(() => 
			render(gl, programInfo, resources))
	}
	);
	
    //render(gl, programInfo, resources);
}

// Load .obj s and Textures
window.onload = function() {

	let icoSphere = new OBJ.Mesh(mesh);

	let pistol = new OBJ.Mesh(gun);

	let bias = 3.0;

    let resources = {
		objects: [
			{
				mesh: icoSphere,
				texture: 'colorTexture',
				transform: new Transform(new Vector3([bias,0.0,0.0]))
			}, 
			{
				mesh: icoSphere,
				texture: 'uvCheckerTexture',
				transform: new Transform(new Vector3([-bias,0.0,0.0]))
			},
			{
				mesh: pistol,
				texture: 'colorTexture',
				transform: new Transform(new Vector3([0.0,bias,0.0]))
			},
			{
				mesh: pistol,
				texture: 'uvCheckerTexture',
				transform: new Transform(new Vector3([0.0,-bias,0.0]))
			} 
		],
		textures:{
			uvCheckerTexture:{
				src: uvText,
				texture: undefined
			},
			colorTexture:{
				src: cText,
				texture: undefined
			},
			roughnessTexture:{
				src: rText,
				texture: undefined
			}
		}
	}

	objects = resources.objects;
    main(resources);
}