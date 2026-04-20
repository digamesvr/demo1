// based on https://www.youtube.com/watch?v=RPku1hVNi8Q
// import as type="module"
import { ImprovedNoise } from "https://cdn.skypack.dev/three@0.133.1/examples/jsm/math/ImprovedNoise.js";

AFRAME.registerComponent('wormhole', {

schema: {
  visible: {default: true}
},

init: function() {
// make these schema
const radius = 3;
const tubeLength = 200;
const tubeGeo = new THREE.CylinderGeometry(radius, radius, tubeLength, 235, 4096);
const tubeVerts = tubeGeo.attributes.position;
const colors = [];
const noise = new ImprovedNoise();
let p = new THREE.Vector3();
let v3 = new THREE.Vector3();
const noisefreq = 0.07;
const noiseAmp = 0.5;
const color = new THREE.Color();
const hueNoiseFreq = 0.009;
for (let i = 0; i < tubeVerts.count; i += 1) {
  p.fromBufferAttribute(tubeVerts, i);
  v3.copy(p);
  let vertexNoise = noise.noise(
    v3.x * noisefreq,
    v3.y * noisefreq,
    v3.z
  );
  v3.addScaledVector(p, vertexNoise * noiseAmp);
  tubeVerts.setXYZ(i, v3.x, p.y, v3.z);
  
  let colorNoise = noise.noise(v3.x * hueNoiseFreq, v3.y * hueNoiseFreq, i * 0.001 * hueNoiseFreq);
  color.setHSL(0.5 - colorNoise, 1, 0.5);
  colors.push(color.r, color.g, color.b);
}
const mat = new THREE.PointsMaterial({ size: 0.09, vertexColors: true });
this.roll = 0;

function getTube(index) {
  const startPosZ =  -tubeLength * index;
  const endPosZ = tubeLength;
  const resetPosZ =  -tubeLength;
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", tubeVerts);
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  const points = new THREE.Points(geo, mat);
  points.rotation.x = Math.PI * 0.5;
  points.position.z = startPosZ;
  const speed = 0.02;

  function update(delta, roll) {
    points.rotation.y += roll;
    points.position.z += speed * delta;
    if (points.position.z > endPosZ) {
      points.position.z = resetPosZ;
    }
  }
  return { points, update };
}

const tubeA = getTube(0);
const tubeB = getTube(1);
this.tubes = [tubeA, tubeB]; 
this.el.sceneEl.object3D.add(tubeA.points, tubeB.points);
this.el.sceneEl.setAttribute("fog", "type: exponential; density: 0.07");
},

update: function() {
  this.tubes[0].points.visible = this.data.visible;
  this.tubes[1].points.visible = this.data.visible;
},

tick: function(time, delta) {
	this.roll += (Math.random() - 0.5)*0.0002;
	this.roll = Math.max(-0.001, Math.min(this.roll, 0.001))
  this.tubes.forEach((tb) => tb.update(delta, this.roll*delta));
},
});
