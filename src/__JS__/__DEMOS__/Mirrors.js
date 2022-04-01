import { color } from '../__COLOR__.js';
import {PlaneGeometry,
		Object3D,
		CylinderGeometry,
		MeshPhongMaterial,
		IcosahedronGeometry,
		DirectionalLightHelper,
		DirectionalLight,
		Mesh,
		Vector3,
		SphereGeometry
} from '../__3D__/three.module.js';

import { Reflector } from '../__3D__/Reflector.js';


import {obj3D} from '../__3D__/__OBJECTS3D__.js';
import {lght3D,hemi3D} from '../__3D__/__LIGHTS__.js';
import {stg3D} from '../__3D__/__STAGE3D__.js';
import {loadGLTF} from '../__LOADER__.js'
import { render } from '../__ENGINE__.js';


stage3D = new stg3D({
	color: color(0,0,0,0.01),
	// min_w:333,
	// min_h:333,
	// auto:true,
	// w:60,
	// h:80,
	prnt:m_stg
})


// let cameraControls;

var sphereGroup, smallSphere;

let groundMirror, verticalMirror, verticalMirror2;


init();
// rndr_3D();

function init() {

	

	// const planeGeo = new PlaneGeometry( 100, 100 );

	// // reflectors/mirrors

	let geometry, material;

	// // geometry = new THREE.CircleGeometry( 40, 64 );
	// // groundMirror = new Reflector( geometry, {
	// // 	clipBias: 0.003,
	// // 	textureWidth: 256,//window.innerWidth * window.devicePixelRatio,
	// // 	textureHeight: 256,//window.innerHeight * window.devicePixelRatio,
	// // 	color: 0x777777
	// // } );
	// // groundMirror.position.y = 0.5;
	// // groundMirror.rotateX( - Math.PI / 2 );
	// // stage3D.scene.add( groundMirror );

	// geometry = new PlaneGeometry( 100, 100 );
	// verticalMirror = new Reflector( geometry, {
	// 	clipBias: 0.003,
	// 	textureWidth: 256,//window.innerWidth * window.devicePixelRatio,
	// 	textureHeight: 256,//window.innerHeight * window.devicePixelRatio,
	// 	color: 0x000000
	// } );
	// // verticalMirror.rotateX(  Math.PI / 4 );
	// verticalMirror.position.y = 50;
	// verticalMirror.position.z = - 50;
	// stage3D.scene.add( verticalMirror );

	// geometry = new PlaneGeometry( 100, 100 );
	// verticalMirror2 = new Reflector( geometry, {
	// 	clipBias: 0.003,
	// 	textureWidth: 256,//window.innerWidth * window.devicePixelRatio,
	// 	textureHeight: 256,//window.innerHeight * window.devicePixelRatio,
	// 	color: 0x000000
	// } );
	// verticalMirror2.rotateY(  Math.PI );
	// verticalMirror2.position.y = 50;
	// verticalMirror2.position.z = 50;
	// stage3D.scene.add( verticalMirror2 );


	// sphereGroup = new Object3D();
	// stage3D.scene.add( sphereGroup );

	// geometry = new CylinderGeometry( 0.1, 15 * Math.cos( Math.PI / 180 * 30 ), 0.1, 24, 1 );
	// material = new MeshPhongMaterial( { color: 0xffffff} );
	// const sphereCap = new Mesh( geometry, material );
	// sphereCap.position.y = - 15 * Math.sin( Math.PI / 180 * 30 ) - 0.05;
	// sphereCap.rotateX( - Math.PI );
	// sphereCap.receiveShadow = true
	// sphereCap.castShadow = true

	// geometry = new SphereGeometry( 15, 24, 24, Math.PI / 2, Math.PI * 2, 0, Math.PI / 180 * 120 );
	// const halfSphere = new Mesh( geometry, material );
	// halfSphere.add( sphereCap );
	// halfSphere.rotateX( - Math.PI / 180 * 135 );
	// halfSphere.rotateZ( - Math.PI / 180 * 20 );
	// halfSphere.position.y = 7.5 + 15 * Math.sin( Math.PI / 180 * 30 );
	// halfSphere.receiveShadow = true
	// halfSphere.castShadow = true
	// sphereGroup.add( halfSphere );


	geometry = new IcosahedronGeometry( 1, 0 );
	material = new MeshPhongMaterial( { color: 0xff0033, flatShading: true } );
	smallSphere = new Mesh( geometry, material );
	smallSphere.visible = false
	// smallSphere.receiveShadow = true
	// smallSphere.castShadow = true
	// smallSphere.position.x = -5
	// smallSphere.position.y = 5
	// smallSphere.position.z = -5
	stage3D.scene.add( smallSphere );

	// // walls
	// const planeTop = new Mesh( planeGeo, new MeshPhongMaterial( { color: 0x7f7fff } ) );
	// planeTop.position.y = 100;
	// planeTop.rotateX( Math.PI / 2 );
	// stage3D.scene.add( planeTop );

	// const planeBottom = new Mesh( planeGeo, new MeshPhongMaterial( { color: 0xffffff } ) );
	// planeBottom.rotateX( - Math.PI / 2 );
	// planeBottom.receiveShadow = true
	// planeBottom.castShadow = true
	// stage3D.scene.add( planeBottom );

	// // const planeFront = new Mesh( planeGeo, new MeshPhongMaterial( { color: 0x7f7fff } ) );
	// // planeFront.position.z = 50;
	// // planeFront.position.y = 50;
	// // planeFront.rotateY( Math.PI );
	// // scene.add( planeFront );

	// const planeRight = new Mesh( planeGeo, new MeshPhongMaterial( { color: 0x00ff00 } ) );
	// planeRight.position.x = 50;
	// planeRight.position.y = 50;
	// planeRight.receiveShadow = true
	// planeRight.castShadow = true
	// planeRight.rotateY( - Math.PI / 2 );
	// stage3D.scene.add( planeRight );

	// const planeLeft = new Mesh( planeGeo, new MeshPhongMaterial( { color: 0xff0000 } ) );
	// planeLeft.position.x = - 50;
	// planeLeft.position.y = 50;
	// planeRight.receiveShadow = true
	// planeRight.castShadow = true
	// planeLeft.rotateY( Math.PI / 2 );
	// stage3D.scene.add( planeLeft );

	// lights
	
	// new lght3D({
	// 	// name:"mainLight",
	// 	scn: stage3D.scene,
	// 	shdw: true,
	// 	// hlpr: true,
	// 	pwr: 1.5,
	// 	clr: 0xAAAAFF,
	// 	rds: 150,
	// 	pos: new Vector3(0,80,0)
	// })

	// new lght3D({
	// 	// name:"greenLight",
	// 	scn: stage3D.scene,
	// 	shdw: true,
	// 	// hlpr: true,
	// 	pwr: 0.5,
	// 	clr: 0x00ff00,
	// 	rds: 100,
	// 	pos: new Vector3(40,50,0)
	// })

	// new lght3D({
	// 	// name:"greenLight",
	// 	scn: stage3D.scene,
	// 	shdw: true,
	// 	// hlpr: true,
	// 	pwr: 0.5,
	// 	clr: 0xff0000,
	// 	rds: 100,
	// 	pos: new Vector3(-40,50,0)
	// })

	new hemi3D({
		scn: stage3D.scene,
		// hlpr: true,
		pwr: 0.4,
		clr: 0x5599FF,
		clrb: 0xFF9955,
		rds: 100,
		pos: new Vector3(0,40,0)
	})
	

	// //

	// const dirLight = new DirectionalLight( 0xffffff, 1 );
	// dirLight.color.setHSL( 0.1, 1, 0.95 );
	// dirLight.position.set( - 5, 5.75, 5 );
	// dirLight.position.multiplyScalar( 30 );
	// stage3D.scene.add( dirLight );

	// dirLight.castShadow = true;

	// dirLight.shadow.mapSize.width = 2048;
	// dirLight.shadow.mapSize.height = 2048;

	// const d = 50;

	// dirLight.shadow.camera.left = - d;
	// dirLight.shadow.camera.right = d;
	// dirLight.shadow.camera.top = d;
	// dirLight.shadow.camera.bottom = - d;

	// dirLight.shadow.camera.far = 3500;
	// dirLight.shadow.bias = - 0.0001;

	// const dirLightHelper = new DirectionalLightHelper( dirLight, 10 );
	// stage3D.scene.add( dirLightHelper );

	// const blueLight = new THREE.PointLight( 0x7f7fff, 0.5, 1000 );
	// blueLight.position.set( 0, 50, 550 );
	// stage3D.scene.add( blueLight );

	// window.addEventListener( 'resize', onWindowResize3D, false );
	
	loadGLTF('BBB_Casa.glb',function ( gltf ) {

		// gltf.scene.scale.x = 10
		// gltf.scene.scale.y = 10
		// gltf.scene.scale.z = 10
		
		// console.log(gltf.cameras[0])
		stage3D.cameras = gltf.cameras

		var set_cam = gltf.cameras[0].parent
		// stage3D.camera.fov = MathUtils.clamp( stage3D.fov, 10, 75 );
		stage3D.camera.updateProjectionMatrix();
		stage3D.camera.position.x = set_cam.position.x
		stage3D.camera.position.y = set_cam.position.y
		stage3D.camera.position.z = set_cam.position.z

		// var wrldUP = new Vector3(0,1,0)
		// var vectorFRONT = wrldUP.clone().applyQuaternion( this.camera.quaternion.clone() ).normalize()

		stage3D.camera.lookAt( stage3D.cameraTrack );

		
		// stage3D.cameraTrack.position

		gltf.scene.traverse( function ( object ) {
			// console.log(object)
			if(object.name.substring(0,3) == "LED"){
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
				// stage3D.scene.add( dirLightHelper );
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
		stage3D.scene.add( gltf.scene );
		if(render) render();
	} )

}

