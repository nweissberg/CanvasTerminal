
MOM.get('obj2D_1').del()
var app_name = "3D tests"
var game_stg = new stg2D({
	color:colors.alpha,
	w:stg_w,
	h:stg_h
})

stage3D = new stg3D({
	cvs:"m_cvs",
	color:colors.alpha,
	// min_w:333,
	// min_h:333,
	// auto:true,
	vfx:[],
	rds:10,
	// w:60,
	// h:80,
	loop:(function (){
		// updateSky()
		// this.loop = null
		this.cube.position.y = Math.sin(time*0.001)*100
		// this.auto = true
		// console.log(time)
		if(render) render()
	}),
	init:(function (){
		var smallSphere;

		// Add Sky
		this.sky = new Sky();
		this.sky.scale.setScalar( 450000 );
		this.scene.add( this.sky );

		this.sun = new vec3D();
		
		const geometryBox = new BoxGeometry( 10, 10, 10 );
		const materialBox = new MeshPhongMaterial( {color: 0xff0000} );
		this.cube = new Mesh( geometryBox, materialBox );
		this.scene.add( this.cube );

		// const geometry = new PlaneGeometry( 16, 9 );
		// geometry.scale( 0.5, 0.5, 0.5 );
		// const material = new MeshBasicMaterial( { map: texture } );

		// const mesh = new THREE.Mesh( geometry, material );
		// // mesh.position.setFromSphericalCoords( radius, phi, theta );
		// mesh.lookAt( this.camera.position );
		// this.scene.add( mesh );

		// cube.position.y = 20
		this.cameraTrack.x = 0
		this.cameraTrack.y = 0
		this.cameraTrack.z = 0

		new hemi3D({
			scn: this.scene,
			// hlpr: true,
			pwr: 0.4,
			clr: 0x5599FF,
			clrb: 0xFF9955,
			rds: 100,
			pos: new vec3D(0,40,0)
		})
		
	}),
	prnt:game_stg
})

var game_hud = new stg2D({
	color:colors.alpha,
	w:stg_w,
	h:stg_h
})

const effectController = {
	turbidity: 7.1,
	rayleigh: 1.33,
	mieCoefficient: 0.038,
	mieDirectionalG: 0.97,
	elevation: 20,
	azimuth: 0,
	exposure: stage3D.renderer.toneMappingExposure
};

function updateSky() {

	const uniforms = stage3D.sky.material.uniforms;
	uniforms[ 'turbidity' ].value = effectController.turbidity;
	uniforms[ 'rayleigh' ].value = effectController.rayleigh;
	uniforms[ 'mieCoefficient' ].value = effectController.mieCoefficient;
	uniforms[ 'mieDirectionalG' ].value = effectController.mieDirectionalG;

	const phi = MathUtils.degToRad( 90 - effectController.elevation );
	const theta = MathUtils.degToRad( effectController.azimuth );

	// stage3D.sun.setFromSphericalCoords( 1, phi, theta );
	stage3D.sun.x = -20
	stage3D.sun.y = 60
	stage3D.sun.z = -100

	uniforms[ 'sunPosition' ].value.copy( stage3D.sun );

	// stage3D.renderer.toneMappingExposure = effectController.exposure;
	// stage3D.renderer.render( stage3D.scene, stage3D.camera );

}