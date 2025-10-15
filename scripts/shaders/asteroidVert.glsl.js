export default /* glsl */ `
precision highp float;

uniform float time; // time passed where each second is a day

// Attributes become 'in' variables
in float M; // mean anomaly at epoch (radians)
in float n; // mean motion (radians/day)
in float e; // eccentricity
in float a; // semimajor axis
in float i; // inclination (radians)
in float om; // longitude of ascending node (Ω) (radians)
in float w; // argument of perihelion (ω) (radians)
in float epoch; // Reference epoch (Julian Date) of the mean anomaly and other orbital parameters

const float PI = 3.141592653589793;

// Newton-Raphson for eccentric anomaly
float calculateEccentricAnomaly(float Mval, float eVal) {
    int maxIterations = 12;
    float tol = 1e-6;

    // - for small-to-moderate e use M + e*sin(M)
    // - for large e use PI (better convergence in many cases)
    float E = (eVal < 0.8) ? (Mval + eVal * sin(Mval)) : PI;

    for (int k = 0; k < maxIterations; ++k) {
        float f = E - eVal * sin(E) - Mval;
        float fp = 1.0 - eVal * cos(E); // derivative
        float delta = f / fp;
        E -= delta;
        if (abs(delta) < tol) break;
    }
    return E;
}

void main() {
    float startDay = 2460961.5;
    float scale = 30.0;

    // --- time & mean anomaly (time in days) ---
    float currentTime = startDay + time;
    float meanAnom = mod(M + n * (currentTime - epoch), 2.0 * PI);

    // --- solve Kepler's equation for E ---
    float E = calculateEccentricAnomaly(meanAnom, e);

    // --- reuse trig/subexpressions ---
    float cosE = cos(E);
    float sinE = sin(E);

    float denom = 1.0 - e * cosE; // reused below; guard for near-zero if needed
    float sqrtTerm = sqrt(max(0.0, 1.0 - e * e));

    // cos(v) and sin(v) computed directly (avoids atan/tan)
    float cosv = (cosE - e) / denom;
    float sinv = (sqrtTerm * sinE) / denom;

    // radius r using cos(v)
    float r = a * (1.0 - e * e) / (1.0 + e * cosv);

    // compute cos(w+v) and sin(w+v) from cosv/sinv and cos/sin(w)
    float cosw = cos(w);
    float sinw = sin(w);
    float cos_wpv = cosw * cosv - sinw * sinv; // cos(ω + ν)
    float sin_wpv = sinw * cosv + cosw * sinv; // sin(ω + ν)

    // precompute node/inclination trig
    float cosO = cos(om);
    float sinO = sin(om);
    float cosi = cos(i);
    float sini = sin(i);

    // final inertial coordinates (perifocal -> inertial)
    float X = r * (cosO * cos_wpv - sinO * sin_wpv * cosi);
    float Y = r * (sinO * cos_wpv + cosO * sin_wpv * cosi);
    float Z = r * (sin_wpv * sini);

    vec3 orbitalPos = vec3(X, Y, Z) * scale;

    gl_PointSize = 1.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(orbitalPos, 1.0);
}
`;
