precision highp float;

// Uniforms
uniform sampler2D cSampler;

// Varyings
varying highp vec2 vTextureCoord;
varying highp vec4 vColor;

void main(void)
{
    vec4 baseColor = texture2D(cSampler, vTextureCoord);
    gl_FragColor = vColor * baseColor;
}
