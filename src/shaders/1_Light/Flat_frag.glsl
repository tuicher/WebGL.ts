precision highp float;

// Uniforms
uniform sampler2D cSampler;
uniform vec3 uLightPos;
uniform vec3 uLightColor;
uniform vec3 uAmbientStrength;
uniform vec3 uDiffuseStrength;

// Varyings
varying highp vec2 vTextureCoord;
varying highp vec3 vFaceNormal;
varying highp vec3 vFragPos;
varying highp float vAttenuation;

void main(void)
{
    vec4 baseColor = texture2D(cSampler, vTextureCoord);

    vec3 lightDir = normalize(uLightPos - vFragPos);


    // Diffuse
    float diff = max(dot(vFaceNormal, lightDir), 0.0);
    vec3 diffuse = uDiffuseStrength * diff * uLightColor * vAttenuation;

    // Ambient
    vec3 ambient = uAmbientStrength * uLightColor;
    

    // Combining the light sources
    vec3 finalColor = (ambient + diffuse) * vec3(baseColor);

    gl_FragColor = vec4(finalColor, baseColor.a);
}