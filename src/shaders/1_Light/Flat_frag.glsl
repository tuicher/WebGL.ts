precision highp float;

// Uniforms
uniform sampler2D cSampler;
uniform vec3 uLightPos;
uniform vec3 uLightColor;

// Parameters (Could be Uniforms)
vec3 uAmbientStrength = vec3(0.1);
vec3 uDiffuseStrength = vec3(1.0);

// Varyings
varying highp vec2 vTextureCoord;
varying highp vec3 vNormalCoord;
varying highp vec3 vFragPos;

void main(void)
{
    vec4 baseColor = texture2D(cSampler, vTextureCoord);

    vec3 norm = normalize(vNormalCoord);
    vec3 lightDir = normalize(uLightPos - vFragPos);

    // Diffuse
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = uDiffuseStrength * diff * uLightColor;

    // Ambient
    vec3 ambient = uAmbientStrength * uLightColor;

    // Combining the light sources
    vec3 finalColor = (ambient + diffuse) * vec3(baseColor);

    gl_FragColor = vec4(finalColor, baseColor.a);
}
