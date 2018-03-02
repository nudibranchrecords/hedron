varying vec3 vWorldPosition;
varying vec2 vUv;

void main() {

	vUv = uv;

	vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
	vWorldPosition = worldPosition.xyz;

	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

}
