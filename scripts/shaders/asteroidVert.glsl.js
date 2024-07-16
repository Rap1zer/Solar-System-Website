export default /* glsl */ `
uniform float time; // time passed where each second is a day

attribute float M; // mean anomaly at epoch
attribute float n; // mean motion
attribute float e; // eccentricity
attribute float a; // semimajor axis
attribute float i; // inclination
attribute float ascNode; // longitude of ascending node
attribute float w; // argument of perihelion

// Newton Raphson method for approximating eccentric anomaly
// Method is explained here: https://graphicmaths.com/pure/numerical-methods/newton-raphson-method/
float calculateEccentricAnomaly(float M, float e) {
	int maxIterations = 10;
	float tolerance = 0.00001;
	// Initial guess (better for small eccentricities)
	float E = M + e * sin(M);
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
	float epoch = 2460400.5;
	float startDay = 2460506.5;
	float scale = 10.;

	// Calculate kepler orbital position
	float currentTime = startDay + time; // seconds are treated as days
	float meanAnomaly = M + n * (currentTime - epoch);
	float eccentricAnomaly = calculateEccentricAnomaly(meanAnomaly, e);
	float trueAnomaly = 2. * atan(sqrt((1. + e) / (1. - e)) * tan(eccentricAnomaly / 2.));
	float r = a * (1. - e * e) / (1. + e * cos(trueAnomaly));

	// convert to perifocal coordinates
	float x = r * (cos(ascNode) * cos(w + trueAnomaly) - sin(ascNode) * sin(w + trueAnomaly) * cos(i));
	float y = r * sin(w + trueAnomaly) * sin(i);
	float z = r * (sin(ascNode) * cos(w + trueAnomaly) + cos(ascNode) * sin(w + trueAnomaly) * cos(i));
	vec3 orbitalPos = vec3(x, y, z) * scale;

	gl_PointSize = 10.;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(orbitalPos, 1.0);
}
`;
