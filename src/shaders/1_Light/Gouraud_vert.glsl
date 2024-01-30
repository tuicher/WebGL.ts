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
uniform vec3 uAmbientStrength;
uniform vec3 uDiffuseStrength;
uniform float uSpecularStrength;
uniform float uShininess;

// Varyings
varying highp vec2 vTextureCoord;
varying highp vec4 vColor;

void main() 
{
    vTextureCoord = aTextureCoord;

    vec4 worldPosition = uModelMatrix * vec4(aVertexPosition, 1);
	vec3 vFragPos = vec3(worldPosition);

    vec3 norm = normalize(mat3(uNormalMatrix) * aNormalCoord);
    vec3 lightDir = normalize(uLightPos - vec3(uModelMatrix * vec4(aVertexPosition, 1)));
    vec3 viewDir = normalize(uCameraPos - vec3(uModelMatrix * vec4(aVertexPosition, 1)));

    // Cálculo de la atenuación
	// I(d) = I_d0 * (d0/d) ^ 2
    float d0 = 4.0;
	float attenuation = pow((d0 / length(uLightPos - vFragPos)), 2.0);

    // Ambient
    vec3 ambient = uAmbientStrength * uLightColor;

    // Diffuse
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = uDiffuseStrength * diff * uLightColor * attenuation;

    // Specular
    vec3 reflectDir = reflect(-lightDir, norm);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), uShininess);
    vec3 specular = uSpecularStrength * spec * uLightColor * attenuation;

    // Combining the light sources
    vec3 light = ambient + diffuse + specular;

    vColor = vec4(light, 1.0);

    
    gl_Position = uProjViewMatrix * worldPosition;
    
}
