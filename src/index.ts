import { initShaderProgram } from "./engine/ShaderLoader";
const OBJ = require('webgl-obj-loader');
import diamond from '../models/DiaGem.obj';
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

function render(gl: WebGLRenderingContext): void {
    
    gl.clearColor(0.5, 0.5, 0.5, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
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

    for (const i in meshes){
        OBJ.initMeshBuffers(gl, meshes[i]);
    }
    
    const shaderProgram = initShaderProgram(gl, vert, frag)

    console.log(shaderProgram);
    
    render(gl);
}

// Load .obj s and Textures
window.onload = function() {

    let resources = {
        'diamond': new OBJ.Mesh(diamond),
    }
   
    main(resources);
}
