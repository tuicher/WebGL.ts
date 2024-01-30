precision highp float;

// Uniforms
uniform sampler2D cSampler;
uniform sampler2D nSampler;
uniform sampler2D rSampler;
uniform sampler2D aoSampler;

uniform vec3 uLightPos;
uniform vec3 uLightColor;
uniform vec3 uCameraPos;

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
    vec3 normMap = normalize(texture2D(nSampler, vTextureCoord).rgb * 2.0 - 1.0);
    float roughness = texture2D(rSampler, vTextureCoord).r;
    float ao = texture2D(aoSampler, vTextureCoord).r;

    vec3 norm = normalize(vNormalCoord + normMap);
    vec3 lightDir = normalize(uLightPos - vFragPos);
    vec3 viewDir = normalize(uCameraPos - vFragPos);

    // Atenuación como en tu shader original
    float d0 = 5.0;
    float attenuation = pow((d0 / length(uLightPos - vFragPos)), 2.0);

    // Difuso
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = uDiffuseStrength * diff * uLightColor * attenuation;

    // Especular
    vec3 reflectDir = reflect(-lightDir, norm);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), uShininess / roughness);
    vec3 specular = uSpecularStrength * spec * uLightColor * attenuation;

    // Ambiental
    vec3 ambient = uAmbientStrength * ao * uLightColor;

    // Combinar todas las fuentes de luz
    vec3 finalColor = (ambient + diffuse + specular) * vec3(baseColor);

    gl_FragColor = vec4(finalColor, baseColor.a);
}