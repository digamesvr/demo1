// space explosion effect
AFRAME.registerComponent("explosion", {
	init: function () {
		const NBITS = 50;
		const VMAX = 20;
		const BITMS = 900;
		
		// create a bunch of triangle bits
		var i;
		var el;
		for (i=0; i<NBITS; i++) {
			el = document.createElement('a-triangle');
			el.setAttribute("material", "metalness", 0.7);
			el.setAttribute("material", "side", "double");

			var vx = Math.random() * 2*VMAX - VMAX;
			var vy = Math.random() * 2*VMAX - VMAX;
			var vz = Math.random() * 2*VMAX - VMAX;
			el.setAttribute("animation", 
				"property: position; from: 0 0 0;" +
				`to: ${vx} ${vy} ${vz}; dur: ${BITMS}; ` + 
				"startEvents: blowup");

			vx = Math.random()*200;
			vy = Math.random()*200;
			vz = Math.random()*200;
			el.setAttribute("animation__r", 
				"property: rotation; from: 0 0 0; to: " + 
				`${vx} ${vy} ${vz}; dur: ${BITMS};` + 
				"startEvents: blowup");

			this.el.appendChild(el);
		}

		el.addEventListener('animationcomplete', function() {
			el.parentEl.object3D.visible = false;
		});
		
		// expanding shock wave ring
		el = document.createElement('a-cylinder');
		el.setAttribute("material",
			"side: double; color: #440; emissive: #FF4");
		el.setAttribute("geometry", "openEnded: true");
		el.setAttribute("animation", 
			"property: scale; from: .01 .01 .01; to: 30 .4 30; easing: linear; startEvents: blowup; dur:" + BITMS);	
		el.setAttribute("animation__c", 
			"property: material.emissiveIntensity; from: 4; to: 0; easing: easeOutCubic; startEvents: blowup; dur:" + BITMS);

		this.el.appendChild(el);
	},
  
	// start explosion at given location Vector3
	trigger: function(pos) {
		this.el.object3D.position.copy(pos);
		this.el.object3D.visible = true;
		var rx = Math.random() * 90;
		var rz = Math.random() * 90;
		var ring = this.el.childElementCount - 1;
		this.el.children[ring].setAttribute("rotation", 
			{x:rx, y:0, z:rz});
		for (const w of this.el.children) {
			w.emit('blowup', {}, false);
		}
	},
	
});
	

function x() {
	boom.components['explosion'].trigger(new THREE.Vector3(0,0,-50));
}
