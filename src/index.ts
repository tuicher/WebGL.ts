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
import mesh from '../models/Sphere.obj';
//import mesh from '../models/Sphere_LowPoly.obj';
//import mesh from "../models/IcoSphere.obj";
import gun from '../models/PistolModel/Pistol_Model.obj';
//import mesh from '../models/PRIVATE/TCT_Grenade.obj';
// Shaders
import vert from './shaders/1_vert.glsl';
import frag from './shaders/1_frag.glsl';
import frag2 from './shaders/1_1_frag.glsl';
// Light rendering
import vPhong from './shaders/1_Light/Phong_vert.glsl';
import fPhong from './shaders/1_Light/Phong_frag.glsl';
import vFlat from './shaders/1_Light/Flat_vert.glsl';
import fFlat from './shaders/1_Light/Flat_frag.glsl'
import vGouraud from './shaders/1_Light/Gouraud_vert.glsl';
import fGouraud from './shaders/1_Light/Gouraud_frag.glsl';
import vBlinn from './shaders/1_Light/Blinn_vert.glsl';
import fBlinn from './shaders/1_Light/Blinn_frag.glsl';
// Textures 
import uvText from '../models/textures/lol.png'
import cText from '../models/PistolModel/_Berreta M9_Material_BaseColor.png';
import rText from '../models/textures/metal/Metal046A_4K-PNG_Roughness.png';
import flatColor from '../models/textures/cyan.png';

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

const fps = 60;
const fpsInterval = 1000 / fps;

function MainLoop(gl: WebGLRenderingContext, resources: any)
{
    // Render
    drawScene(gl, resources);

    // Call next render
    setTimeout(() => MainLoop(gl, resources), fpsInterval);
}

function drawScene(gl: WebGLRenderingContext, resources: any): void
{
	gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
 
    // Clear the canvas AND the depth buffer.
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


	mainCam.far = 1000.0;
	mainCam.configureProjection();

	let index = -1;
	let jndex = 0;

	for (const obj of resources.objects)
	{
		// Actualiza la transformación del objeto
		let aux = axis[jndex]
        obj.transform.rotation.rotateAroundAxis(aux, index * 0.25 / fps);
		index *= -1;
		if(index == -1)
		{
			jndex++;
		}

		const programInfo = resources.shaders[obj.shader].program;
        gl.useProgram(programInfo.program);

		setMatrixUniforms(gl, programInfo, mainCam.projViewMatrix, obj.transform.getModelMatrix());

		OBJ.initMeshBuffers(gl, obj.mesh);

		setShaderAttributes(gl, programInfo, obj.mesh);
        setShaderUniforms(gl, programInfo, obj, resources);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.mesh.indexBuffer);
        gl.drawElements(gl.TRIANGLES, obj.mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	}
}

/*
function drawScene(gl: WebGLRenderingContext, resources: any): void
{
	gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
 
    // Clear the canvas AND the depth buffer.
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


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

		const programInfo = resources.shaders[obj.shader].program;
        gl.useProgram(programInfo.program);

		 // ProjView
		 gl.uniformMatrix4fv(
            programInfo.uLocations.uProjViewMatrix,
            false,
            mainCam.projViewMatrix
        );

		// Model
        gl.uniformMatrix4fv(
            programInfo.uLocations.uModelMatrix,
            false,
            obj.transform.getModelMatrix()
        );

		OBJ.initMeshBuffers(gl, obj.mesh);

		// Enlazar y configurar el buffer de vértices
		gl.bindBuffer(gl.ARRAY_BUFFER, obj.mesh.vertexBuffer);
		gl.vertexAttribPointer(
			programInfo.aLocations.aVertexPosition,
			obj.mesh.vertexBuffer.itemSize,
			gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(programInfo.aLocations.aVertexPosition);
	
		// Enlazar y configurar el buffer de coordenadas de textura
		gl.bindBuffer(gl.ARRAY_BUFFER, obj.mesh.textureBuffer);
		gl.vertexAttribPointer(
			programInfo.aLocations.aTextureCoord,
			obj.mesh.textureBuffer.itemSize,
			gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(programInfo.aLocations.aTextureCoord);
	
		// Cargar y enlazar la textura del objeto
		let textureInfo = resources.textures[obj.texture];
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
		gl.uniform1i(programInfo.uLocations.cSampler, 0);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.mesh.indexBuffer);
        gl.drawElements(gl.TRIANGLES, obj.mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	}
}
*/
async function initScene(resources: any): Promise<void> {
    const gl = initWebGL();

    if (!gl) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    mainCam.aspectRatio = gl.canvas.width / gl.canvas.height;

    // Iterar a través de cada shader y compilarlos
    for (const shaderKey in resources.shaders) {
        const shader = resources.shaders[shaderKey];
        const shaderProgram = initShaderProgram(gl, shader.vertShader, shader.fragShader);

        if (!shaderProgram) {
            alert("Error creating shader program for: " + shaderKey);
            continue;
        }

        // Almacenar la información del programa compilado
        shader.program = {
            program: shaderProgram,
            aLocations: {},
            uLocations: {}
        };

        shader.attributes.forEach((attr: string) => {
            shader.program.aLocations[attr] = gl.getAttribLocation(shaderProgram, attr);
        });

        shader.uniforms.forEach((uniform: string) => {
            shader.program.uLocations[uniform] = gl.getUniformLocation(shaderProgram, uniform);
        });

		console.log(shader);
    }

    // Cargar texturas
    await loadTextures(gl, resources.textures);

    // Render
    MainLoop(gl, resources);
}

window.onload = function() {

	let icoSphere = new OBJ.Mesh(mesh);

	let pistol = new OBJ.Mesh(gun);

	let bias = 4.0;

    let resources = {
		objects: [
			{
				mesh: icoSphere,
				texture: 'flatColorTexture',
				transform: new Transform(new Vector3([bias,0.0,0.0])),
				shader: 'BlinnShading'
			}, 
			{
				mesh: icoSphere,
				texture: 'flatColorTexture',
				transform: new Transform(new Vector3([-bias,0.0,0.0])),
				shader: 'GouraudShading'
			},
			{
				mesh: icoSphere,
				texture: 'flatColorTexture',
				transform: new Transform(new Vector3([0.0,bias,0.0])),
				shader: 'FlatShading'
			},
			{
				mesh: icoSphere,
				texture: 'flatColorTexture',
				transform: new Transform(new Vector3([0.0,-bias,0.0])),
				shader: 'PhongShading'
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
			},
			flatColorTexture:{
				src: flatColor,
				texture: undefined
			},
		},
		shaders: {
			'basicShader': {
				vertShader: vert,
				fragShader: frag,
				attributes: ['aVertexPosition', 'aTextureCoord'],
				uniforms: ['uProjViewMatrix', 'uModelMatrix', 'cSampler'],
				program: null,
			},
			'inverseShader': {
				vertShader: vert,
				fragShader: frag2,
				attributes: ['aVertexPosition', 'aTextureCoord'],
				uniforms: ['uProjViewMatrix', 'uModelMatrix', 'cSampler'],
				program: null,
			},
			'PhongShading': {
				vertShader: vPhong,
				fragShader: fPhong,
				attributes: ['aVertexPosition', 'aTextureCoord', 'aNormalCoord'],
				uniforms: ['uProjViewMatrix', 'uModelMatrix', 'uNormalMatrix', 'cSampler', 'uCameraPos', 'uLightPos', 'uLightColor'],
				program: null,
			},
			'FlatShading': {
				vertShader: vFlat,
				fragShader: fFlat,
				attributes: ['aVertexPosition', 'aTextureCoord', 'aNormalCoord'],
				uniforms: ['uProjViewMatrix', 'uModelMatrix', 'uNormalMatrix', 'cSampler', 'uLightPos', 'uLightColor'],
				program: null,
			},
			'GouraudShading': {
				vertShader: vGouraud,
				fragShader: fGouraud,
				attributes: ['aVertexPosition', 'aTextureCoord', 'aNormalCoord'],
				uniforms: ['uProjViewMatrix', 'uModelMatrix', 'uNormalMatrix', 'cSampler', 'uCameraPos', 'uLightPos', 'uLightColor'],
				program: null,
			},
			'BlinnShading': {
				vertShader: vBlinn,
				fragShader: fBlinn,
				attributes: ['aVertexPosition', 'aTextureCoord', 'aNormalCoord'],
				uniforms: ['uProjViewMatrix', 'uModelMatrix', 'uNormalMatrix', 'cSampler', 'uCameraPos', 'uLightPos', 'uLightColor'],
				program: null,
			},
		},
		lights: [
			{
				position: [ 0.0, 0.0, bias],
				color: [ 1.0 ,1.0, 1.0]
			}
		]
	}

	objects = resources.objects;
    initScene(resources);
}

function setMatrixUniforms(gl: WebGLRenderingContext, programInfo: any, projViewMatrix: any, modelMatrix: any): void
{
    gl.uniformMatrix4fv(
        programInfo.uLocations.uProjViewMatrix,
        false,
        projViewMatrix
    );

    gl.uniformMatrix4fv(
        programInfo.uLocations.uModelMatrix,
        false,
        modelMatrix
    );

	if ('uNormalMatrix' in programInfo.uLocations) 
	{
        let normalMatrix = glMatrix.mat4.transpose( glMatrix.mat4.create(), 
		glMatrix.mat4.invert( glMatrix.mat4.create(), modelMatrix));

        gl.uniformMatrix4fv(
            programInfo.uLocations.uNormalMatrix,
            false,
            normalMatrix
        );
    } 
}

function setShaderAttributes(gl: WebGLRenderingContext, programInfo: any, mesh: any): void
{
    for (let attr in programInfo.aLocations)
	{
        const location = programInfo.aLocations[attr];
        let buffer;

        // Mapeo explícito de atributos a buffers
        switch (attr) {
            case 'aVertexPosition':
                buffer = mesh.vertexBuffer;
                break;

            case 'aTextureCoord':
                buffer = mesh.textureBuffer;
                break;

			case 'aNormalCoord':
				buffer = mesh.normalBuffer;
                break;

            default:
                buffer = null;
        }

        if (buffer)
		{
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.vertexAttribPointer(location, buffer.itemSize, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(location);
        }
    }
}

function setShaderUniforms(gl: WebGLRenderingContext, programInfo: any, obj: any, resources: any): void
{
    for (let uniform in programInfo.uLocations)
	{
		const location = programInfo.uLocations[uniform];

        switch (uniform) {
            case 'cSampler':
                // Configuración para uniformes de tipo textura
                let textureInfo = resources.textures[obj.texture];
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
                gl.uniform1i(location, 0);
                break;

			case 'uCameraPos':
				gl.uniform3fv(location, mainCam.pos.toArr);
				break;

			case'uLightColor':
				gl.uniform3fv(location, resources.lights[0].color);
				break;

			case 'uLightPos':
				gl.uniform3fv(location, resources.lights[0].position)
				break;

            // Añade casos adicionales para otros tipos de uniformes
            // Por ejemplo, para uniformes de tipo float, vec3, vec4, etc.
            // case 'uSomeFloatUniform':
            //     gl.uniform1f(location, obj.someFloatValue);
            //     break;

            // case 'uSomeVec3Uniform':
            //     gl.uniform3fv(location, obj.someVec3Value);
            //     break;

            default:
                //console.warn(`Uniform no implementado: ${uniform}`);
                break;
        }
	}
}