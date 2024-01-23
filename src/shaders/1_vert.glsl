// Attribute
attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;
attribute vec2 aTextureCoord;

// Uniforms
uniform mat4 uProjViewMatrix;
uniform mat4 uModelMatrix;

// Varyings
varying lowp vec4 vColor;
varying highp vec2 vTextureCoord;

void main() 
{
	gl_Position = uProjViewMatrix * uModelMatrix * aVertexPosition;
	
	vColor = aVertexColor;
	vTextureCoord = aTextureCoord;
}