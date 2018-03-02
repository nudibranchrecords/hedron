varying vec2 vUv;
varying vec3 vWorldPosition;

uniform vec2 iResolution;
uniform float iTime;
uniform float seed;
uniform vec3 color1;
uniform vec3 color2;

vec2 GetGradient(vec2 intPos, float t) {
    float rand = fract(sin(dot(intPos, vec2(12.9898, 78.233))) * seed);;
    float angle = 6.283185 * rand + 4.0 * t * rand;
    return vec2(cos(angle), sin(angle));
}


float Pseudo3dNoise(vec3 pos) {
    vec2 i = floor(pos.xy);
    vec2 f = pos.xy - i;
    vec2 blend = f * f * (3.0 - 2.0 * f);
    float noiseVal =
        mix(
            mix(
                dot(GetGradient(i + vec2(0, 0), pos.z), f - vec2(0, 0)),
                dot(GetGradient(i + vec2(1, 0), pos.z), f - vec2(1, 0)),
                blend.x),
            mix(
                dot(GetGradient(i + vec2(0, 1), pos.z), f - vec2(0, 1)),
                dot(GetGradient(i + vec2(1, 1), pos.z), f - vec2(1, 1)),
                blend.x),
        blend.y
    );
    return noiseVal / 0.7; // normalize to about [-1..1]
}


void main() {
	vec2 uv = vUv.xy;
  float noiseVal = 0.5 + 0.5 * Pseudo3dNoise(vec3(uv * 1.0, iTime / 2.));
  noiseVal = mod(noiseVal, 0.1) * 10.;
  gl_FragColor = vec4(mix(color1, color2, noiseVal), 1.);
}
