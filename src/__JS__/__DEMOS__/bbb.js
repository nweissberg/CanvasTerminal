
MOM.get('obj2D_1')?.del()
var app_name = "Big Brother Brasil"
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
	rds:10,
	// w:60,
	// h:80,
	loop:(function (){
		updateSky()
		this.loop = null
	}),
	init:(function (){
		var smallSphere;
		let geometry, material;

		// Add Sky
		this.sky = new Sky();
		this.sky.scale.setScalar( 450000 );
		this.scene.add( this.sky );

		this.sun = new vec3D();

		geometry = new IcosahedronGeometry( 1, 0 );
		material = new MeshPhongMaterial( { color: 0xff0033, flatShading: true } );
		smallSphere = new Mesh( geometry, material );
		smallSphere.visible = false
		// smallSphere.layers.enable( 0 )
		this.scene.add( smallSphere );
		var cam_track = loadArray("cam_track")
		// console.log(cam_track)
		if(cam_track != null){
			smallSphere.position.x = cam_track[0]
			smallSphere.position.y = cam_track[1]
			smallSphere.position.z = cam_track[2]
			this.cameraTrack.x = cam_track[0]
			this.cameraTrack.y = cam_track[1]
			this.cameraTrack.z = cam_track[2]
		}

		

		new hemi3D({
			scn: this.scene,
			// hlpr: true,
			pwr: 0.4,
			clr: 0x5599FF,
			clrb: 0xFF9955,
			rds: 100,
			pos: new vec3D(0,40,0)
		})
		
		loadGLTF('BBB_Casa.glb', this, ( gltf ) => {

			// gltf.scene.scale.x = 10
			// gltf.scene.scale.y = 10
			// gltf.scene.scale.z = 10
			
			// console.log(gltf.cameras[0])
			this.cameras = gltf.cameras

			// var set_cam = gltf.cameras[0].parent
			// this.camera.fov = MathUtils.clamp( this.fov, 10, 75 );
			var cam_pos = loadArray("cam_pos")
			// console.log(cam_pos)
			
			if(cam_pos){
				this.camera.updateProjectionMatrix();
				this.camera.position.x = cam_pos[0]
				this.camera.position.y = cam_pos[1]
				this.camera.position.z = cam_pos[2]	
			}else{
				var set_cam = gltf.cameras[0].parent
				// this.camera.fov = MathUtils.clamp( this.fov, 10, 75 );
				this.camera.updateProjectionMatrix();
				this.camera.position.x = set_cam.position.x
				this.camera.position.y = set_cam.position.y
				this.camera.position.z = set_cam.position.z
			}
		
			// var wrldUP = new vec3D(0,1,0)
			// var vectorFRONT = wrldUP.clone().applyQuaternion( this.camera.quaternion.clone() ).normalize()

			this.camera.lookAt( this.cameraTrack );

			
			// this.cameraTrack.position

			gltf.scene.traverse( function ( object ) {
				// console.log(object)

				if(stage3D.post.mirrors?.enabled == true && object.name.split("_")[0] == "MIRROR"){
					// console.log(object.name)
					object.visible = false
					geometry = new PlaneGeometry( 2, 2 );
					var mirror = new Reflector( geometry, {
						clipBias: 0.0003,
						textureWidth: 256,//window.innerWidth * window.devicePixelRatio,
						textureHeight: 256,//window.innerHeight * window.devicePixelRatio,
						color: 0x555555
					} );
					// console.log(object.rotation)
					
					mirror.rotation.y = object.rotation.y
					mirror.rotation.x = object.rotation.x
					mirror.rotation.z = object.rotation.z

					mirror.rotateX(  -Math.PI / 2 );
					mirror.rotateZ(  -Math.PI / 2 );

					mirror.position.x = object.position.x
					mirror.position.y = object.position.y
					mirror.position.z = object.position.z
					mirror.scale.x = object.scale.z
					mirror.scale.y = object.scale.x
					mirror.scale.z = object.scale.y

					stage3D.scene.add( mirror );
				}
				if(object.name.split("_")[0] == "LED"){
					object.layers.enable( 1 )
				}else{
					object.layers.enable( 0 )
				}
				if( object.parent && object.parent.type == "DirectionalLight"){
					var dirLight = object.parent
					
					dirLight.castShadow = true;

					dirLight.shadow.mapSize.width = 2048;
					dirLight.shadow.mapSize.height = 2048;

					const d = 50;

					dirLight.shadow.camera.left = - d;
					dirLight.shadow.camera.right = d;
					dirLight.shadow.camera.top = d;
					dirLight.shadow.camera.bottom = - d;

					dirLight.shadow.camera.far = 3500;
					dirLight.shadow.bias = - 0.0001;

					// const dirLightHelper = new DirectionalLightHelper( dirLight, 10 );
					// this.scene.add( dirLightHelper );
				}
				if(object.type == "PointLight"){
					
					object.castShadow = true
					object.shadow.bias = -0.001
					object.shadow.mapSize.width = 256;
					object.shadow.mapSize.height = 256;
				}
				if ( object.isMesh ){
					object.castShadow = true;
					object.receiveShadow = true;
				}
			} );
			this.scene.add( gltf.scene );
			this.render3D?.()
			render?.()
		} )
	}),
	prnt:game_stg
})

var game_hud = new stg2D({
	color:colors.alpha,
	w:stg_w,
	h:stg_h
})

new bttn2D({
	cvs:"m_cvs",
	pos: new vec3D(0,0,0),
	font_color:colors.font_light,
	color:colors.window,
	txt:"Next",
	line:3,
	size:15,
	style:"bold",
	w: 20,
	h: 20,
	pvt:[1,1],
	strk:colors.stroke,
	rds:[10,0,0,10],
	prnt: game_hud,
	onTch_U:(function(){
		stage3D.actv_cam+=1
		var set_cam = stage3D.cameras[(stage3D.actv_cam%stage3D.cameras.length)].parent
		stage3D.camera.updateProjectionMatrix();
		stage3D.camera.position.x = set_cam.position.x
		stage3D.camera.position.y = set_cam.position.y
		stage3D.camera.position.z = set_cam.position.z
		saveArray("cam_pos",[
			stage3D.camera.position.x,
			stage3D.camera.position.y,
			stage3D.camera.position.z
		])
		stage3D.render3D()
		// console.log("teste "+this.name)
	})
})

new bttn2D({
	cvs:"m_cvs",
	pos: new vec3D(0,0,0),
	font_color:colors.font_light,
	color:colors.window,
	txt:"Back",
	line:3,
	size:15,
	style:"bold",
	w: 20,
	h: 20,
	pvt:[0,1],
	rds:[0,10,10,0],
	strk:colors.stroke,
	prnt: game_hud,
	onTch_U:(function(){
		stage3D.actv_cam-=1
		if(stage3D.actv_cam < 0) stage3D.actv_cam = stage3D.cameras.length-1

		var set_cam = stage3D.cameras[(stage3D.actv_cam%stage3D.cameras.length)].parent
		stage3D.camera.updateProjectionMatrix();
		stage3D.camera.position.x = set_cam.position.x
		stage3D.camera.position.y = set_cam.position.y
		stage3D.camera.position.z = set_cam.position.z
		saveArray("cam_pos",[
			stage3D.camera.position.x,
			stage3D.camera.position.y,
			stage3D.camera.position.z
		])
		stage3D.render3D()
		// console.log("teste "+this.name)
	})
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