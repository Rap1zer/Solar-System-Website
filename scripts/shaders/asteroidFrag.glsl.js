export default /* glsl */ `
precision mediump float;
out vec4 FragColor;

void main() {
    // gl_PointCoord goes from 0.0 to 1.0 across the point
    vec2 coord = gl_PointCoord - 0.5; 
    float dist = length(coord);
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist); // softer edges
    vec3 color = vec3(0.8, 1.0, 1.0); // bluish glow
    FragColor = vec4(color, alpha);
}
`;
