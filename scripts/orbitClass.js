import * as THREE from "three";

export const orbitClassMap = {
      AMO: 0, // Amor NEO
      APO: 1, // Apollo NEO
      ATE: 2, // Aten NEO
      IEO: 3, // Inner-Earth Object (Atira)
      MCA: 4, // Mars-crossing
      IMB: 5, // Inner main belt
      MBA: 6, // Middle main belt
      OMB: 7, // Outer main belt
      CEN: 8, // Centaur
      TJN: 9, // Trojan
      TNO: 10, // Trans-Neptunian
      AST: 11, // Unspecified asteroid
};

const orbitClassColours = [
  new THREE.Color(0.96, 0.69, 0.25), // 0: AMO, warm orange
  new THREE.Color(0.90, 0.49, 0.45), // 1: APO, coral red
  new THREE.Color(0.80, 0.38, 0.33), // 2: ATE, dark red
  new THREE.Color(0.95, 0.58, 0.54), // 3: IEO, rose pink
  new THREE.Color(0.97, 0.86, 0.43), // 4: MCA, gold
  new THREE.Color(0.83, 0.85, 0.86), // 5: IMB, silver gray
  new THREE.Color(0.67, 0.72, 0.72), // 6: MBA, slate gray
  new THREE.Color(0.52, 0.57, 0.62), // 7: OMB, steel gray
  new THREE.Color(0.46, 0.84, 0.77), // 8: CEN, turquoise
  new THREE.Color(0.36, 0.68, 0.89), // 9: TJN, ocean blue
  new THREE.Color(0.69, 0.48, 0.77), // 10: TNO, violet
  new THREE.Color(0.44, 0.48, 0.49)   // 11: AST, neutral gray
];

export const coloursAsFloats = new Float32Array(orbitClassColours.flatMap(c => [c.r, c.g, c.b]));