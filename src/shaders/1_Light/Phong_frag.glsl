precision highp float;

// Uniforms
uniform sampler2D cSampler;
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
varying highp vec3 vNormalCoord;
varying highp vec3 vFragPos;

void main(void)
{
    vec4 baseColor = texture2D(cSampler, vTextureCoord);

    vec3 norm = normalize(vNormalCoord);
    vec3 lightDir = normalize(uLightPos - vFragPos);
	vec3 viewDir = normalize(uCameraPos - vFragPos);

    // Difuse
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = uDiffuseStrength * diff * uLightColor;

    // Specular
    vec3 reflectDir = reflect(-lightDir, norm);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), uShininess);
    vec3 specular = uSpecularStrength * spec * uLightColor;

    // Ambient
    vec3 ambient = uAmbientStrength * uLightColor;

    // Combining all sources
    vec3 finalColor = (ambient + diffuse + specular) * vec3(baseColor);

    gl_FragColor = vec4(finalColor, baseColor.a);
}