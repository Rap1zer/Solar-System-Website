export default /* glsl */ `
uniform float time;
uniform float M; // mean anomaly at epoch
uniform float n; // mean motion
uniform float e; // eccentricity
uniform float a; // semimajor axis
uniform float i; // inclination
uniform float longOfNode; // longitude of ascending node
uniform float peri; // argument of perihelion

// Newton Raphson method for eccentric anomaly
// Newton Raphson method for approximate is explained here: https://graphicmaths.com/pure/numerical-methods/newton-raphson-method/
float calculateEccentricAnomaly(float M, float e) {
	int maxIterations = 10;
	float tolerance = 0.00001;
		// Initial guess using Kepler's equation rearrangement
		float E = M + e * sin(M) + 0.5 * e * e * sin(2.0 * M);
	for (int i = 0; i < maxIterations; i++) {
		// Enew = Eold - f(Eold)/df(Eold)
		float delta = (E - e * sin(E) - M) / (1. - e * cos(E));
		E = E - delta;
		if (abs(delta) < tolerance) {
			return E;
		}
	}
	return E;
}

void main() {
	float epoch = 2451545.0;

	float meanAnomaly = M + n * (time - epoch);
	float eccentricAnomaly = calculateEccentricAnomaly(meanAnomaly, e);
	float trueAnomaly = 2. * atan(sqrt((1. + e) / (1. - e)) * tan(eccentricAnomaly / 2.));
	float x = a * (cos(trueAnomaly) - e);
	float y = 0.;
	float z = a * sqrt(1. - e * e) * sin(trueAnomaly);
	vec3 orbitalPos = vec3(x, y, z);

	gl_PointSize = 10.;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(orbitalPos, 1.0);
}
`;
