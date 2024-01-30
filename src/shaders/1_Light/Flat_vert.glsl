// Attribute
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormalCoord;

// Uniforms
uniform mat4 uProjViewMatrix;
uniform mat4 uModelMatrix;
uniform mat4 uNormalMatrix;
uniform vec3 uLightPos;

// Varyings
varying highp vec2 vTextureCoord;
varying highp vec3 vFaceNormal;
varying highp vec3 vFragPos;
varying highp float vAttenuation;

void main() 
{
	vTextureCoord = aTextureCoord;

	vFaceNormal = normalize(mat3(uNormalMatrix) * aNormalCoord);
	
	vec4 worldPosition = uModelMatrix * vec4(aVertexPosition, 1);
	vFragPos = vec3(worldPosition);

	// Cálculo de la atenuación
	// I(d) = I_d0 * (d0/d) ^ 2
    float d0 = 4.0;
	vAttenuation = pow((d0 / length(uLightPos - vFragPos)), 2.0);

	gl_Position = uProjViewMatrix * worldPosition;
}