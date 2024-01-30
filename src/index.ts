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
//import mesh from '../models/Sphere.obj';
//import mesh from '../models/Sphere_LowPoly.obj';
import torus from '../models/Torus.obj';
import NoNormalSmoorhTorus from '../models/Torus_NoSmooth.obj'
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
import vFull from './shaders/FullShading/CompleteShader_vert.glsl';
import fFull from './shaders/FullShading/CompleteShader_frag.glsl';
// Textures 
import uvText from '../models/textures/lol.png'
import cText from '../models/PistolModel/_Berreta M9_Material_BaseColor.png';
//import cText from '../models/textures/rock/Rock050_4K-PNG_Color.png';
import rText from '../models/PistolModel/_Berreta M9_Material_Roughness.png';
//import rText from '../models/textures/rock/Rock050_4K-PNG_Roughness.png';
import nText from '../models/PistolModel/_Berreta M9_Material_Normal.png';
import aoText from '../models/PistolModel/_Berreta M9_Material_AO.png';
//import aoText from '../models/textures/rock/Rock050_4K-PNG_AmbientOcclusion.png';
import flatColor from '../models/textures/cyan.png';

let mainCam = new Camera([0, 0, 15]);

document.addEventListener("keydown", (event) => {
	mainCam.handleEvent(event, 1/fps);
});

let objects: any[] = [];

let gui = new dat.GUI();

let settings = {
	fov: 60,
	meshScale: 1.0
};

let fovController = gui.add(settings,'fov', 0.01, 120);

let meshScaleController = gui.add(settings,'meshScale', 0.01, 10);

let ambientComponent = [0.1, 0.1, 0.1]

const ambient = {
	r: ambientComponent[0],
	g: ambientComponent[1],
	b: ambientComponent[2],
	uniformValue: 0.1
};

const ambientFolder = gui.addFolder('Ambient');

const raController = ambientFolder.add(ambient, 'r', 0, 1, 0.025).name('Red').onChange((newValue : any) => 
{
	ambientComponent[0] = newValue;
});
const gaController = ambientFolder.add(ambient, 'g', 0, 1, 0.025).name('Green').onChange((newValue : any) => 
{
	ambientComponent[1] = newValue;
});
const baController = ambientFolder.add(ambient, 'b', 0, 1, 0.025).name('Blue').onChange((newValue : any) => 
{
	ambientComponent[2] = newValue;
});
ambientFolder.add(ambient, 'uniformValue', 0, 1).name('Uniform').onChange((newValue : any) => {
	ambient.r = newValue;
	ambient.g = newValue;
	ambient.b = newValue;
	raController.updateDisplay();
	gaController.updateDisplay();
	baController.updateDisplay();
	ambientComponent[0] = newValue;
	ambientComponent[1] = newValue;
	ambientComponent[2] = newValue;
  });

//ambientFolder.open();

let diffuseComponent = [1.0, 1.0, 1.0]

const diffuse = {
	r: diffuseComponent[0],
	g: diffuseComponent[1],
	b: diffuseComponent[2],
	uniformValue: 1.0
}

const diffuseFolder = gui.addFolder('Diffuse');

const rdController = diffuseFolder.add(diffuse, 'r', 0, 1, 0.05).name('Red').onChange((newValue : any) => 
{
	diffuseComponent[0] = newValue;
});
const gdController = diffuseFolder.add(diffuse, 'g', 0, 1, 0.05).name('Green').onChange((newValue : any) => 
{
	diffuseComponent[1] = newValue;
});
const bdController = diffuseFolder.add(diffuse, 'b', 0, 1, 0.05).name('Blue').onChange((newValue : any) => 
{
	diffuseComponent[2] = newValue;
});

diffuseFolder.add(diffuse, 'uniformValue', 0, 1).name('Uniform').onChange((newValue : any) => {
	diffuse.r = newValue;
	diffuse.g = newValue;
	diffuse.b = newValue;
	rdController.updateDisplay();
	gdController.updateDisplay();
	bdController.updateDisplay();
	diffuseComponent[0] = newValue;
	diffuseComponent[1] = newValue;
	diffuseComponent[2] = newValue;
  });

//diffuseFolder.open();

const materialProperties = {
	specular: 0.5 ,
	shininess: 32 
};

let specularComponent = 0.5;
let shininessComponent = 32;
gui.add(materialProperties, 'specular', 0, 1,0.05).name('Specular').onChange((newValue : any) => {
	specularComponent = newValue;
});

gui.add(materialProperties, 'shininess', 1, 250).name('Shininess').onChange((newValue : any) => {
	shininessComponent = newValue;
});

let lightPos = [0.0,3.0,5.0];
let lightColor = [1.0,1.0,1.0];

const lightSettings = {
	positionX: lightPos[0],
	positionY: lightPos[1],
	positionZ: lightPos[2],
	color: "#ffffff"
};

// Crear el folder Luz
const lightFolder = gui.addFolder('Light');

// Agregar controles para la posición
lightFolder.add(lightSettings, 'positionX', -10, 10, 0.1).onChange((value: any) => {
	lightPos[0] = value;
});
lightFolder.add(lightSettings, 'positionY', -10, 10, 0.1).onChange((value: any) => {
	lightPos[1] = value;
});
lightFolder.add(lightSettings, 'positionZ', -10, 10, 0.1).onChange((value: any) => {
	lightPos[2] = value;
});

const colorFolder = lightFolder.addFolder('Color');

colorFolder.addColor(lightSettings, 'color').onChange((value : any) => {
	lightColor = hexToNormalizedRgb(value);
});

// Abrir los folders automáticamente
//lightFolder.open();
//colorFolder.open();

fovController.onChange(function(value: number) {
	mainCam.fov = (value * Math.PI) / 180;
	//console.log(value);
});

meshScaleController.onChange(function(value: number) {
	for (const obj of objects) {
		if (obj.transform && obj.transform.setUniformScale)
		{
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

const fps = 144;
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

	for (const obj of resources.objects)
	{
        obj.transform.rotation.rotateAroundAxis(Vector3.UP, 0.25 / fps);
		obj.transform.rotation.rotateAroundAxis(Vector3.FORWARD, 0.25 / fps);
		
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


async function initScene(resources: any): Promise<void> {
    const gl = initWebGL();

    if (!gl) 
	{
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

	let toro = new OBJ.Mesh(torus);
	let flatToro = new OBJ.Mesh(NoNormalSmoorhTorus);

	let pistol = new OBJ.Mesh(gun);

	let bias = 4.0;

	/*
    let resources = {
		objects: [
			{
				mesh: toro,
				texture: 'flatColorTexture',
				transform: new Transform(new Vector3([-bias,bias,0.0])),
				shader: 'BlinnShading'
			}, 
			{
				mesh: toro,
				texture: 'flatColorTexture',
				transform: new Transform(new Vector3([-bias,-bias,0.0])),
				shader: 'GouraudShading'
			},
			{
				mesh: flatToro,
				texture: 'flatColorTexture',
				transform: new Transform(new Vector3([bias,bias,0.0])),
				shader: 'FlatShading'
			},
			{
				mesh: toro,
				texture: 'flatColorTexture',
				transform: new Transform(new Vector3([bias,-bias,0.0])),
				shader: 'PhongShading'
			} 
		],
		textures:{
			uvCheckerTexture:{
				src: uvText,
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
				uniforms: ['uProjViewMatrix', 'uModelMatrix', 'uNormalMatrix', 'cSampler', 'uCameraPos', 'uLightPos', 'uLightColor', 'uAmbientStrength', 'uDiffuseStrength', 'uSpecularStrength', 'uShininess'],
				program: null,
			},
			'FlatShading': {
				vertShader: vFlat,
				fragShader: fFlat,
				attributes: ['aVertexPosition', 'aTextureCoord', 'aNormalCoord'],
				uniforms: ['uProjViewMatrix', 'uModelMatrix', 'uNormalMatrix', 'cSampler', 'uLightPos', 'uLightColor','uAmbientStrength', 'uDiffuseStrength'],
				program: null,
			},
			'GouraudShading': {
				vertShader: vGouraud,
				fragShader: fGouraud,
				attributes: ['aVertexPosition', 'aTextureCoord', 'aNormalCoord'],
				uniforms: ['uProjViewMatrix', 'uModelMatrix', 'uNormalMatrix', 'cSampler', 'uCameraPos', 'uLightPos', 'uLightColor', 'uAmbientStrength', 'uDiffuseStrength', 'uSpecularStrength', 'uShininess'],
				program: null,
			},
			'BlinnShading': {
				vertShader: vBlinn,
				fragShader: fBlinn,
				attributes: ['aVertexPosition', 'aTextureCoord', 'aNormalCoord'],
				uniforms: ['uProjViewMatrix', 'uModelMatrix', 'uNormalMatrix', 'cSampler', 'uCameraPos', 'uLightPos', 'uLightColor', 'uAmbientStrength', 'uDiffuseStrength', 'uSpecularStrength', 'uShininess'],
				program: null,
			},
		},
		lights: [
			{
				position: [ 0.0, 0.0, bias],
				color: [ 1.0 , 1.0, 1.0]
			}
		]
	}
	*/
	
	let resources = {
		objects: [
			{
				mesh: pistol,
				texture: 'colorTexture',
				transform: new Transform(new Vector3([-bias,0.0,0.0])),
				shader: 'FullShading'
			},
			{
				mesh: pistol,
				texture: 'colorTexture',
				transform: new Transform(new Vector3([bias,0.0,0.0])),
				shader: 'BlinnShading'
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
			normalTexture:{
				src: nText,
				texture: undefined
			},
			aoTexture:{
				src: aoText,
				texture: undefined
			},
			flatColorTexture:{
				src: flatColor,
				texture: undefined
			},
		},
		shaders: {
			'FullShading': {
				vertShader: vFull,
				fragShader: fFull,
				attributes: ['aVertexPosition', 'aTextureCoord', 'aNormalCoord'],
				uniforms: ['uProjViewMatrix', 'uModelMatrix', 'uNormalMatrix', 'cSampler', 'nSampler','rSampler', 'aoSampler', 'uCameraPos', 'uLightPos', 'uLightColor', 'uAmbientStrength', 'uDiffuseStrength', 'uSpecularStrength', 'uShininess'],
				program: null,
			},
			'PhongShading': {
				vertShader: vPhong,
				fragShader: fPhong,
				attributes: ['aVertexPosition', 'aTextureCoord', 'aNormalCoord'],
				uniforms: ['uProjViewMatrix', 'uModelMatrix', 'uNormalMatrix', 'cSampler', 'uCameraPos', 'uLightPos', 'uLightColor', 'uAmbientStrength', 'uDiffuseStrength', 'uSpecularStrength', 'uShininess'],
				program: null,
			},
			'BlinnShading': {
				vertShader: vBlinn,
				fragShader: fBlinn,
				attributes: ['aVertexPosition', 'aTextureCoord', 'aNormalCoord'],
				uniforms: ['uProjViewMatrix', 'uModelMatrix', 'uNormalMatrix', 'cSampler', 'uCameraPos', 'uLightPos', 'uLightColor', 'uAmbientStrength', 'uDiffuseStrength', 'uSpecularStrength', 'uShininess'],
				program: null,
			},
		},
		lights: [
			{
			position: lightPos,
			color: lightColor
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
			case 'nSampler':
				gl.activeTexture(gl.TEXTURE1);
				gl.bindTexture(gl.TEXTURE_2D, resources.textures['normalTexture'].texture);
				gl.uniform1i(location, 1);
				break;
			case 'rSampler':
				gl.activeTexture(gl.TEXTURE2);
				gl.bindTexture(gl.TEXTURE_2D, resources.textures['roughnessTexture'].texture);
				gl.uniform1i(location, 2);
				break;
			case 'aoSampler':
				gl.activeTexture(gl.TEXTURE3);
				gl.bindTexture(gl.TEXTURE_2D, resources.textures['aoTexture'].texture);
				gl.uniform1i(location, 3);
				break;
			case 'uCameraPos':
				gl.uniform3fv(location, mainCam.pos.toArr);
				break;

			case'uLightColor':
				gl.uniform3fv(location, lightColor);
				break;

			case 'uLightPos':
				gl.uniform3fv(location,lightPos)
				break;

			case 'uDiffuseStrength':
				gl.uniform3fv(location, diffuseComponent)
				break;
			
			case 'uAmbientStrength':
				gl.uniform3fv(location, ambientComponent)
				break;
			case 'uSpecularStrength':
				gl.uniform1f(location, specularComponent)
				break;
			case 'uShininess':
				gl.uniform1f(location, shininessComponent)
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

function hexToNormalizedRgb(hex: string): [number, number, number] {
	// Verificar si el formato hexadecimal incluye el símbolo '#'
	if (hex.startsWith('#')) {
	  hex = hex.slice(1);
	}
  
	// Convertir los componentes hexadecimales en valores enteros
	let r = parseInt(hex.substring(0, 2), 16);
	let g = parseInt(hex.substring(2, 4), 16);
	let b = parseInt(hex.substring(4, 6), 16);
  
	// Normalizar los valores (rango de 0 a 1)
	return [r / 255, g / 255, b / 255];
  }