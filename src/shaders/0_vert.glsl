attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;

uniform mat4 uProjViewMatrix;
uniform mat4 uModelMatrix;

varying lowp vec4 vColor;

void main() {
	gl_Position = uProjViewMatrix * uModelMatrix * aVertexPosition;
	vColor = aVertexColor;
}