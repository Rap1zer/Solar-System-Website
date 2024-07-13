export default /* glsl */ `
uniform float time;

void main() {
	float epoch = 2451545.0;
	float amplitude = 1.;  // Adjust the amount of oscillation
	float frequency = 1.;  // Adjust the speed of oscillation

	float offset = sin(time * frequency) * amplitude;

	// Apply the offset to the vertex position
	vec3 offsetPosition = position + vec3(0., offset, 0.);

	gl_PointSize = 1.;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(offsetPosition, 1.0);
}
`;
