#ifdef GL_ES
precision mediump float;
#endif

uniform float distanceStep;
uniform float xMorphAmp;
uniform float xMorphMix;
uniform float yMorphAmp;
uniform float yMorphMix;

const vec2 center = vec2(0.5);

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  // Remap the space to -1. to 1.
  vec2 st = uv - center;
  st.x *= resolution.x/resolution.y;

  float xMorph = mix(1., st.x * xMorphAmp, xMorphMix);
  float yMorph = mix(1., st.y * yMorphAmp, yMorphMix);

  // Make the distance field
  float d = length( st * yMorph * xMorph );

  // Visualize the distance field
  outputColor = vec4(vec3(fract(d*distanceStep)),1.0);
}
