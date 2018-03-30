varying vec2 vUv;
uniform sampler2D tDiffuseA;
uniform sampler2D tDiffuseB;
uniform float mixRatio;

void main() {

	vec4 a = texture2D( tDiffuseA, vUv );
	vec4 b = texture2D( tDiffuseB, vUv );
	gl_FragColor = mix( a, b, mixRatio );

}
