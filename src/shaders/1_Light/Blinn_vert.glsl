// Attribute
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormalCoord;

// Uniforms
uniform mat4 uProjViewMatrix;
uniform mat4 uModelMatrix;
uniform mat4 uNormalMatrix;

// Varyings
varying highp vec2 vTextureCoord;
varying highp vec3 vNormalCoord;
varying highp vec3 vFragPos;

void main() 
{
    vTextureCoord = aTextureCoord;
    vNormalCoord = normalize(mat3(uNormalMatrix) * aNormalCoord);
    vec4 worldPosition = uModelMatrix * vec4(aVertexPosition, 1);
    vFragPos = vec3(worldPosition);
    gl_Position = uProjViewMatrix * worldPosition;
}
