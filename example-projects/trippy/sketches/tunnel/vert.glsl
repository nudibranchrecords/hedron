varying vec3 vWorldPosition;
varying vec2 vUv;

#pragma glslify: import('./chunks/fog_pars_vertex.glsl')

void main() {

	vUv = uv;

	vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
	vWorldPosition = worldPosition.xyz;
	
	#pragma glslify: import('./chunks/fog_vertex.glsl')

	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

}
