#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

void main(){
  vec2 st = gl_FragCoord.xy/resolution.xy;
  // Remap the space to -1. to 1.
  st = st *2.-1.;
  st.x *= resolution.x/resolution.y;

  vec3 color = vec3(0.0);

  // Make the distance field
  float d = length( abs(st) - sin(time * 0.001) );

  // Visualize the distance field
  gl_FragColor = vec4(vec3(fract(d*10.0)),1.0);
}
