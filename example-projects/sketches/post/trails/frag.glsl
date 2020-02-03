uniform sampler2D bufferTexture;
uniform float rotAngle;
uniform float scale;
uniform float mixAmp;

mat2 rotate2d(float _angle){
  return mat2(cos(_angle),-sin(_angle),
              sin(_angle),cos(_angle));
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {

    vec2 nUv = uv;

    nUv -= 0.5;
    nUv *= rotate2d(rotAngle * 0.1);
    nUv /= 1. + scale * 0.5;
    nUv += 0.5;

    vec4 bufferCol = texture2D(bufferTexture, nUv);
    vec4 col = inputColor;

    outputColor = mix(col, bufferCol, mixAmp);
}