export default /* glsl */ `
precision mediump float;

out vec4 FragColor;

void main() {
	vec3 color = vec3(204.0, 255.0, 250.0) / 255.0; // temporary color
	FragColor = vec4(color, 1.0);
}
`;
