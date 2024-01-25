// Attribute
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormalCoord;

// Uniforms
uniform mat4 uProjViewMatrix;
uniform mat4 uModelMatrix;
uniform mat4 uNormalMatrix;
uniform vec3 uLightPos;
uniform vec3 uLightColor;
uniform vec3 uCameraPos;

// Parameters (Could be Uniforms)
vec3 uAmbientStrength = vec3(0.1);
vec3 uDiffuseStrength = vec3(1.0);
float uSpecularStrength = 0.5;
float uShininess = 32.0;

// Varyings
varying highp vec2 vTextureCoord;
varying highp vec4 vColor;

void main() 
{
    vTextureCoord = aTextureCoord;

    vec3 norm = normalize(mat3(uNormalMatrix) * aNormalCoord);
    vec3 lightDir = normalize(uLightPos - vec3(uModelMatrix * vec4(aVertexPosition, 1)));
    vec3 viewDir = normalize(uCameraPos - vec3(uModelMatrix * vec4(aVertexPosition, 1)));

    // Ambient
    vec3 ambient = uAmbientStrength * uLightColor;

    // Diffuse
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = uDiffuseStrength * diff * uLightColor;

    // Specular
    vec3 reflectDir = reflect(-lightDir, norm);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), uShininess);
    vec3 specular = uSpecularStrength * spec * uLightColor;

    // Combining the light sources
    vec3 light = ambient + diffuse + specular;

    vColor = vec4(light, 1.0);
    gl_Position = uProjViewMatrix * uModelMatrix * vec4(aVertexPosition, 1);
}
