precision highp float;

varying highp vec2 vTextureCoord;
//varying highp vec3 vNormalCoord;

uniform sampler2D cSampler;

void main(void) {

	//vec2 coord  =vec2(vTextureCoord.x, 1.0 - vTextureCoord.y);
    //gl_FragColor =  texture2D(cSampler,coord);
	gl_FragColor = texture2D(cSampler,vTextureCoord);
}