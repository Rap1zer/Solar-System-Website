export default /* glsl */ `
uniform float time;

void main() {
    // Adjust the amplitude and frequency of oscillation
    float amplitude = 1.0;  // Adjust the amount of oscillation
    float frequency = 0.01;  // Adjust the speed of oscillation

    // Compute offset based on time to create animation
    float offset = sin(time * frequency) * amplitude;

    // Apply the offset to the vertex position
    vec3 offsetPosition = position + vec3(0., offset, 0.);

    // Set point size (you can adjust this as needed)
    gl_PointSize = 10.0;

    // Calculate final position using model-view-projection matrix
    gl_Position = projectionMatrix * modelViewMatrix * vec4(offsetPosition, 1.0);
}
`;
