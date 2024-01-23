precision highp float;

varying highp vec2 vTextureCoord;
varying highp vec3 vNormalCoord;
varying highp vec3 vFragPos;

uniform sampler2D cSampler;
uniform sampler2D rSampler;

uniform vec3 lightPos;
uniform vec3 lightColor;
uniform vec3 viewPos;


void main(void) {
	// Cálculo de la distancia
	float distance = length(lightPos - vFragPos);

	// Cálculo de la atenuación
	// I(d) = I_d0 * (d0/d) ^ 2
	float d0 = 100.0;
	float attenuation = pow((d0 / distance), 2.0);

	float roughness = texture2D(rSampler, vTextureCoord).r; 

	// Ambient
	float ambientStrength = 0.05;
	vec3 ambient = ambientStrength * lightColor;

	//Diffuse
	float diffuseStrength = 0.9;
	vec3 norm = normalize(vNormalCoord);
	vec3 lightDir = normalize(lightPos - vFragPos);
	float diff = max(dot(norm, lightDir), 0.0);
	vec3 diffuse = diffuseStrength * diff * lightColor * attenuation;

  	//Specular
	float shininess = 50.0 * (1.0 - (roughness * 3.0));
	float specularStrength = 0.5 * (1.0 - roughness);
	vec3 viewDir = normalize(viewPos - vFragPos);
	vec3 reflectDir = reflect(-lightDir, norm);
	float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
	vec3 specular = specularStrength * spec * lightColor * attenuation;

	vec4 result = vec4(ambient + diffuse + specular, 1.0);
	//vec4 color = texture2D(cSampler, vTextureCoord);
	
	vec4 color = vec4(0.22, 0.22, 0.22, 1.0);

	gl_FragColor = result * color;
}