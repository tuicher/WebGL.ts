precision highp float;

// Uniforms
uniform sampler2D cSampler;
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
varying highp vec3 vNormalCoord;
varying highp vec3 vFragPos;

void main(void)
{
    vec4 baseColor = texture2D(cSampler, vTextureCoord);
    vec3 norm = normalize(vNormalCoord);
    vec3 lightDir = normalize(uLightPos - vFragPos);
    vec3 viewDir = normalize(uCameraPos - vFragPos);

    // Cálculo de la atenuación
	// I(d) = I_d0 * (d0/d) ^ 2
    float d0 = 4.0;
	float attenuation = pow((d0 / length(uLightPos - vFragPos)), 2.0);

    // Diffuse
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = uDiffuseStrength * diff * uLightColor * attenuation;

    // Blinn-Phong Specular
    vec3 halfwayDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(norm, halfwayDir), 0.0), uShininess);
    vec3 specular = uSpecularStrength * spec * uLightColor * attenuation;

    // Ambient
    vec3 ambient = uAmbientStrength * uLightColor;

    // Combining the light sources
    vec3 finalColor = (ambient + diffuse + specular) * vec3(baseColor);

    gl_FragColor = vec4(finalColor, baseColor.a);
}
