export default /* glsl */ `
precision mediump float;

uniform vec3 orbitColors[12];

in float vClassId;
out vec4 FragColor;

void main() {
    // gl_PointCoord gives UV coordinates within the point sprite
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);

    // discard fragments outside the circle
    if (dist > 0.5) discard;

    int id = int(clamp(floor(vClassId + 0.5), 0.0, 11.0));
    vec3 color = orbitColors[id];
    FragColor = vec4(color, 1.0);
}
`;
