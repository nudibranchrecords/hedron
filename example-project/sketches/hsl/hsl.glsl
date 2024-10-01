uniform sampler2D u_texture;
uniform vec3 u_hsl;  // Hue, saturation, lightness adjustments
varying vec2 vUv;

// Function to convert an RGB color to HSL
vec3 rgb2hsl(vec3 color) {
    float maxC = max(max(color.r, color.g), color.b);
    float minC = min(min(color.r, color.g), color.b);
    float l = (maxC + minC) / 2.0;
    if (maxC == minC) {
        return vec3(0.0, 0.0, l);
    } else {
        float h = 0.0;
        float s = 0.0;
        if (l < 0.5) s = (maxC - minC) / (maxC + minC);
        else s = (maxC - minC) / (2.0 - maxC - minC);
        if (color.r == maxC) h = (color.g - color.b) / (maxC - minC);
        else if (color.g == maxC) h = 2.0 + (color.b - color.r) / (maxC - minC);
        else h = 4.0 + (color.r - color.g) / (maxC - minC);
        h /= 6.0;
        if (h < 0.0) h += 1.0;
        return vec3(h, s, l);
    }
}

// Function to convert an HSL color to RGB
vec3 hsl2rgb(vec3 color) {
    if (color.y == 0.0) {
        return vec3(color.z);
    } else {
        float q = 0.0;
        if (color.z < 0.5) q = color.z * (1.0 + color.y);
        else q = color.z + color.y - color.y * color.z;
        float p = 2.0 * color.z - q;
        float hk = color.x;
        vec3 tc = vec3(hk + 1.0/3.0, hk, hk - 1.0/3.0);
        vec3 result;
        for(int i=0; i<3; i++) {
            if (tc[i] < 0.0) tc[i] += 1.0;
            if (tc[i] > 1.0) tc[i] -= 1.0;
            if (tc[i] < 1.0/6.0) result[i] = p + ((q - p) * 6.0 * tc[i]);
            else if (tc[i] < 0.5) result[i] = q;
            else if (tc[i] < 2.0/3.0) result[i] = p + ((q - p) * 6.0 * (2.0/3.0 - tc[i]));
            else result[i] = p;
        }
        return result;
    }
}

void main() {
    vec4 texColor = texture2D(u_texture, vUv);
    vec3 hsl = rgb2hsl(texColor.rgb);

    // Apply HSL adjustments
    hsl.x += u_hsl.x;  // Hue
    hsl.y *= u_hsl.y;  // Saturation
    hsl.z *= u_hsl.z;  // Lightness

    // Convert back to RGB
    vec3 rgb = hsl2rgb(hsl);

    gl_FragColor = vec4(rgb, 1.0);
}
