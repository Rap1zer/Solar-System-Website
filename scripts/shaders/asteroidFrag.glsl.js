export default /* glsl */ `
precision mediump float;

in float vClassId;
out vec4 FragColor;

vec3 getColorByClass(float id) {
    // Near-Earth Objects (warm colors)
    if (id < 0.5) return vec3(1.00, 0.75, 0.30); // AMO – orange
    else if (id < 1.5) return vec3(1.00, 0.45, 0.25); // APO – red-orange
    else if (id < 2.5) return vec3(1.00, 0.25, 0.15); // ATE – red
    else if (id < 3.5) return vec3(1.00, 0.55, 0.65); // IEO – pinkish (Atira)
    
    // Mars region
    else if (id < 4.5) return vec3(1.00, 0.80, 0.25); // MCA – yellow
    
    // Main belt (neutral grays)
    else if (id < 5.5) return vec3(0.75, 0.75, 0.80); // IMB – light gray
    else if (id < 6.5) return vec3(0.65, 0.65, 0.70); // MBA – medium gray
    else if (id < 7.5) return vec3(0.55, 0.55, 0.60); // OMB – darker gray
    
    // Outer solar system (cool tones)
    else if (id < 8.5) return vec3(0.40, 0.65, 1.00); // CEN – cyan-blue
    else if (id < 9.5) return vec3(0.25, 0.45, 1.00); // TJN – deep blue
    else if (id < 10.5) return vec3(0.55, 0.35, 0.90); // TNO – violet
    
    // Misc / unspecified
    else return vec3(0.0, 0.0, 0.0); // AST – dark gray
}

void main() {
    // gl_PointCoord gives UV coordinates within the point sprite
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);

    // discard fragments outside the circle
    if (dist > 0.5) discard;

    vec3 color = getColorByClass(vClassId);
    FragColor = vec4(color, 1.0);
}
`;
