// Atribs
attribute vec3 aVertexPosition;
attribute vec3 aNormalCoord;
attribute vec2 aTextureCoord;

// Uniforms
uniform mat4 uWorldMatrix;
uniform mat4 uModelMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uNormalMatrix;

// outs
varying highp vec2 vTextureCoord;
varying highp vec3 vNormalCoord;
varying highp vec3 vFragPos;

void main(void)
{
	vec4 worldPosition = uModelMatrix * vec4(aVertexPosition, 1);
	vFragPos = vec3(worldPosition);

	gl_Position = uProjectionMatrix * uViewMatrix * worldPosition;

	vTextureCoord = aTextureCoord;
	vNormalCoord = normalize(mat3(uNormalMatrix) * aNormalCoord);
}