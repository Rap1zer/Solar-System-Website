export default /* glsl */ `
precision lowp float;

uniform float time; // time passed where each second is a day

// Attributes become 'in' variables
in float M; // mean anomaly at epoch
in float n; // mean motion
in float e; // eccentricity
in float a; // semimajor axis
in float i; // inclination
in float om; // longitude of ascending node
in float w; // argument of perihelion

// Newton Raphson method for approximating eccentric anomaly
// Method is explained here: https://graphicmaths.com/pure/numerical-methods/newton-raphson-method/
float calculateEccentricAnomaly(float M, float e) {
	int maxIterations = 10;
	float tolerance = 0.00001;
	// Initial guess (better for small eccentricities)
	float E = M + e * sin(M);
	for (int j = 0; j < maxIterations; j++) {
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
	float scale = 30.;

	// Calculate kepler orbital position
	float currentTime = startDay + time; // seconds are treated as days
	float meanAnomaly = M + n * (currentTime - epoch);
	float eccentricAnomaly = calculateEccentricAnomaly(meanAnomaly, e);
	float trueAnomaly = 2. * atan(sqrt((1. + e) / (1. - e)) * tan(eccentricAnomaly / 2.));
	float r = a * (1. - e * e) / (1. + e * cos(trueAnomaly));

	// convert to perifocal / cartesian coordinates
	float x = r * (cos(om) * cos(w + trueAnomaly) - sin(om) * sin(w + trueAnomaly) * cos(i));
	float y = r * sin(w + trueAnomaly) * sin(i);
	float z = r * (sin(om) * cos(w + trueAnomaly) + cos(om) * sin(w + trueAnomaly) * cos(i));
	vec3 orbitalPos = vec3(x, y, z) * scale;

	gl_PointSize = 3.;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(orbitalPos, 1.0);
}

`;
