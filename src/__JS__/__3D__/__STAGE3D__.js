import { render } from '../__ENGINE__.js';
import { WebGLRenderer,
		BasicShadowMap,
		ShaderMaterial,
		Scene,
		PerspectiveCamera,
		Layers,
		Vector2,
		Vector3,
		MathUtils,
		ReinhardToneMapping,
		ACESFilmicToneMapping,
		MeshBasicMaterial,
		Raycaster,
		GridHelper,
		IcosahedronGeometry,
		MeshPhongMaterial,
		Mesh
	} from '../__3D__/three.module.js';
import { Sky } from '../__3D__/Sky.js';
import { EffectComposer } from '../__3D__/__RENDER__/EffectComposer.js';
import { RenderPass } from '../__3D__/__RENDER__/RenderPass.js';
import { ShaderPass } from '../__3D__/__RENDER__/ShaderPass.js';
import { SSAOPass } from '../__3D__/__RENDER__/SSAOPass.js';
import { UnrealBloomPass } from '../__3D__/__RENDER__/UnrealBloomPass.js';
import { rotateAroundPoint } from '../__3D__/__OBJECTS3D__.js';
import { img2D } from '../__2D__/__IMAGE__.js';
import { pln2D } from '../__2D__/__PLANE__.js';
import { bttn2D } from '../__2D__/__BUTTON__.js';
import { tTyp } from '../__2D__/__OBJECTS__.js';

export class stg3D extends pln2D {
	constructor( attr = {} ) {
		super(attr)
		this.init 	= ( this.attr["init"] ) ? this.attr["init"] : (()=>{});
		this.camera;
		this.cameras = [];
		this.actv_cam = ( loadVar("actv_cam") ) ? loadVar("actv_cam") : 0;
		this.scene;
		this.renderer;
		this.container = document.getElementById( 'container' );
		this.vfx = this.attr["vfx"] ? this.attr["vfx"] : [];//["bloom","ssao","shadows","mirrors"]
		
		this.post = {
			bloom:{
				enabled:this.vfx.indexOf('bloom')!=-1?true:false,
				threshold:0.0,
				strength:2.0,
				radius:0.66
			},
			ssao:{
				enabled:this.vfx.indexOf('ssao')!=-1?true:false,
				radius:10,
				size:16,
				min:0.007,
				max:0.17
			},
			shadows:{
				enabled:this.vfx.indexOf('shadows')!=-1?true:false
			},
			mirrors:{
				enabled:this.vfx.indexOf('mirrors')!=-1?true:false
			}
		}

		// renderer
		this.renderer = new WebGLRenderer( { antialias: true, preserveDrawingBuffer: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.renderer.toneMapping = ACESFilmicToneMapping;
		if(this.post.shadows.enabled == true){
			this.renderer.shadowMap.enabled = true;
			this.renderer.shadowMap.type = BasicShadowMap; // default THREE.PCFShadowMap	
		}
		this.container.appendChild( this.renderer.domElement );
		this.layer = 1
		this.bloomLayer = new Layers();
		this.bloomLayer.set( this.layer );
		this.materials = {}

		this.effectController ={
			turbidity: 7.1,
			rayleigh: 1.33,
			mieCoefficient: 0.038,
			mieDirectionalG: 0.97,
			elevation: 20,
			azimuth: 0,
			exposure: this.renderer.toneMappingExposure
		};

		this.lon = 10;
		this.lat = 10;
		this.phi = 0;
		this.zoom = 10;
		this.fov = 100; 
		this.theta = 0;

		// scene
		this.scene = new Scene();
		this.scene.background = this.color

		const geometry = new IcosahedronGeometry( 1, 0 );
		const material = new MeshPhongMaterial( { color: 0xff0033, flatShading: true } );
		const smallSphere = new Mesh( geometry, material );
		// smallSphere.visible = false
		// smallSphere.layers.enable( 0 )
		this.scene.add( smallSphere );

		const size = 100;
		const divisions = 20;
		const gridHelper = new GridHelper( size, divisions );
		this.scene.add( gridHelper );

		// camera
		this.camera = new PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
		this.camera.position.set( 0, 50, 100 );
		this.camera.up.set( 0, 1, 0 );
		var cam_track = loadArray("cam_track")
		this.cameraTrack = ( cam_track ) ? new Vector3(cam_track[0],cam_track[1],cam_track[2]) : new Vector3(0,10,0); 
		this.camera.lookAt( this.cameraTrack );
		this.expand = false

		this.renderScene = new RenderPass( this.scene, this.camera );
		this.composer = new EffectComposer( this.renderer );
		this.composer.renderToScreen = false;
		this.composer.addPass( this.renderScene );

		if( this.post.bloom && this.post.bloom.enabled ){
			this.bloomPass = new UnrealBloomPass( new Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
			this.bloomPass.threshold = this.post.bloom.threshold//params.bloomThreshold;
			this.bloomPass.strength = this.post.bloom.strength//params.bloomStrength;
			this.bloomPass.radius = this.post.bloom.radius//params.bloomRadius;
			this.composer.addPass( this.bloomPass );
		}

		this.finalPass = new ShaderPass(
			new ShaderMaterial( {
				uniforms: {
					baseTexture: { value: null },
					bloomTexture: { value: this.composer.renderTarget2.texture }
				},
				vertexShader: document.getElementById( 'vertexshader' ).textContent,
				fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
				defines: {}
			} ), "baseTexture"
		);
		this.finalPass.needsSwap = true;

		this.finalComposer = new EffectComposer( this.renderer );
		this.finalComposer.addPass( this.renderScene );

		if(this.post.ssao.enabled ){
			this.ssaoPass = new SSAOPass( this.scene, this.camera, window.innerWidth, window.innerHeight );
			this.ssaoPass.kernelRadius = this.post.ssao.radius;
			this.ssaoPass.kernelSize = this.post.ssao.size;
			this.ssaoPass.minDistance = this.post.ssao.min;
			this.ssaoPass.maxDistance = this.post.ssao.max;
			this.finalComposer.addPass( this.ssaoPass );
		}
		this.finalComposer.addPass( this.finalPass );

		this.loop = ( this.attr["loop"] ) ? this.attr["loop"] : (()=>{
			console.log("loop "+ this.name)
			this.loop = null
		});



		// this.superDraw = this.drw
		// MOM.set(this.name, this)
		this.init()
		// Add Sky
		// this.sky = new Sky();
		// this.sky.scale.setScalar( 450000 );
		// this.scene.add( this.sky );

		// this.sun = new vec3D();
		// updateSky()
	}
	// onTch_U(){

	// }
	updateImg(){
		console.log(cursor.state)

		if(this.img) this.img.src = this.renderer.domElement.toDataURL();
		// console.log(this.post.shadows.enabled)
		// this.renderer.shadowMap.enabled = this.post.shadows.enabled;
		this.src = true
		// this.render3D()
	}
	onScrll(scrll){
		console.log(scrll)
		this.fov -= scrll*0.1
		if(this.fov > 70) this.fov = 70
		if(this.fov < 10) this.fov = 10
		// this.render3D()
	}
	onTch_U(){
		// this.updateImg()
	}
	onDrag_U(){
		// this.updateImg()
		
	}
	onTch_M(spd_x,spd_y){
		// console.log(spd_x,spd_y)
		// console.log(cursor.state)
		// if(cursor.state != 2) return
		// if(cursor.state != 2){
		// 	this.renderer.shadowMap.enabled = this.post.shadows.enabled;
		// }else{
		// 	this.renderer.shadowMap.enabled = false;
		// }
		// this.render3D()
		var smallSphere = this.scene.children[0]
		
		

		var wrldUP = new Vector3(0,1,0)
		var vectorUP = this.camera.position.clone().normalize()//.applyQuaternion( this.body.quaternion.clone() ).normalize()
		var vectorFRONT = wrldUP.clone().applyQuaternion( this.camera.quaternion.clone() ).normalize()
		var vectorRIGHT = wrldUP.clone().applyAxisAngle(vectorUP,Math.PI/2).applyQuaternion( this.camera.quaternion.clone() ).normalize()

		var anchorPoint = this.camera.position.clone()
		var moveDist = smallSphere.position.distanceTo(anchorPoint);
	
		smallSphere.position.y += (((spd_y)*0.25)*(moveDist*0.01))*(this.fov*0.01)

		rotateAroundPoint(smallSphere, this.camera.position, wrldUP, ((spd_x)*0.004)*(this.fov*0.01), false)
		
		if(smallSphere.position.x!=0,smallSphere.position.y!=0,smallSphere.position.z!=0){
			this.cameraTrack.x = smallSphere.position.x
			this.cameraTrack.y = smallSphere.position.y
			this.cameraTrack.z = smallSphere.position.z
		}else{
			smallSphere.position.x = this.cameraTrack.x
			smallSphere.position.y = this.cameraTrack.y
			smallSphere.position.z = this.cameraTrack.z
		}
		
		if(this.cameraTrack.x != null && this.cameraTrack.y != null && this.cameraTrack.z != null){
			saveArray("cam_track", [this.cameraTrack.x,this.cameraTrack.y,this.cameraTrack.z])
			saveVar("cam_fov", this.fov)
			saveVar("actv_cam", this.actv_cam)
			
		}
		// this.render3D()
		// render()

	}
	render3D(){
		
		// this.loop?.()

		const timer = Date.now() * 0.01;
		
		// this.container.style.display = "block";

		this.lon = timer%360
		this.lat = Math.max( - 85, Math.min( 85, this.lat ) );
		this.phi = MathUtils.degToRad( 90 - this.lat );
		this.theta = MathUtils.degToRad( this.lon );
		
		// const fov = this.camera.fov + this.zoom * 0.05;
		this.camera.fov = MathUtils.clamp( this.fov, 10, 75 );
		this.camera.updateProjectionMatrix();

		this.camera.lookAt( this.cameraTrack );
		if((cursor.state != 2 || !isMobile) && this.post.bloom.enabled == true){
			this.scene.traverse( darkenNonBloomed );
			this.composer.render();
			this.scene.traverse( restoreMaterial );	
			this.finalComposer.render()
		}else{
			this.renderer.render( this.scene, this.camera );	
		}
		
		if(this.src != true && this.img ){
			this.img.src = this.renderer.domElement.toDataURL();
			this.src = true
		}
		// this.buffer = true
		// this.drew = true
		
	}
	drw3D(s = true){
		// console.log(this.src)
		// this.super.drw(s)
		// super()
		this.container.style.left = this.area[0] +"px";
		this.container.style.top = this.area[1] +"px";

		if(this.expand == false){
			var setWidth = this.area[2]
			var setHeight = this.area[3]
			// cursor.scrollLock = false
		}else{
			// cursor.scrollLock = true
			var setWidth = stg_w
			var setHeight = stg_h
		}

		var threeWidth = (setWidth)//*Three_resolution)
		var threeHeight = (setHeight)//*Three_resolution)
		this.camera.aspect = threeWidth / threeHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize( threeWidth, threeHeight );
		this.composer.setSize( threeWidth, threeHeight );
		this.finalComposer.setSize( threeWidth, threeHeight );

		var scaleX = setWidth / threeWidth;
		var scaleY = setHeight / threeHeight;

		var threeScaleRes = Math.max(scaleX, scaleY);

		this.container.style.transformOrigin = '0 0'; //scale from top left
		this.container.style.transform = 'scale(' + threeScaleRes + ')';
		this.container.style.width = setWidth +"px"
		this.container.style.height = setHeight +"px"

		if(this.hide || (this.prnt && !s)) return this
		if(this.vis){
			if(this.src == true){
				if(!this.msk){
					if(this.clp) this.msk = this.prnt
				}else{
					this.a_clp = [	this.msk.area[0]-(this.msk.line*0.5),
									this.msk.area[1]-(this.msk.line*0.5),
									this.msk.area[2]+(this.msk.line),
									this.msk.area[3]+(this.msk.line)]
				}
			}else{
				this.render3D()
				this.container.style.display = "block";
			}
		}else{
			this.container.style.display = "none";
		}
		
		// this.ctx.restore();
		// this.img.src = this.renderer.domElement.toDataURL();
		// this.render3D()
		this.buffer = true
		this.drew = true
		return this
	}
	del(){
		this.container.style.display = "none";
		MOM.delete(this.name)
		if(this.chld.size > 0) this.chld.forEach( (k) => {
			k.del()
		} )
		render?.()
		if(this.prnt && this.prnt.chld.has(this)) this.prnt.chld.delete(this)
		// if(render) render()
		return this.name + " deleted"
	}

}
const darkMaterial = new MeshBasicMaterial( { color: "black" } );

function darkenNonBloomed( obj ) {

	if ( obj.isMesh && stage3D.bloomLayer.test( obj.layers ) === false ) {

		stage3D.materials[ obj.uuid ] = obj.material;
		obj.material = darkMaterial;

	}

}

function restoreMaterial( obj ) {

	if ( stage3D.materials[ obj.uuid ] ) {

		obj.material = stage3D.materials[ obj.uuid ];
		delete stage3D.materials[ obj.uuid ];

	}

}


// function updateSky() {
// 	console.log("UPDATE SKY")
// 	const uniforms = stage3D.sky.material.uniforms;
// 	uniforms[ 'turbidity' ].value = stage3D.effectController.turbidity;
// 	uniforms[ 'rayleigh' ].value = stage3D.effectController.rayleigh;
// 	uniforms[ 'mieCoefficient' ].value = stage3D.effectController.mieCoefficient;
// 	uniforms[ 'mieDirectionalG' ].value = stage3D.effectController.mieDirectionalG;

// 	const phi = MathUtils.degToRad( 90 - stage3D.effectController.elevation );
// 	const theta = MathUtils.degToRad( stage3D.effectController.azimuth );

// 	// stage3D.sun.setFromSphericalCoords( 1, phi, theta );
// 	stage3D.sun.x = -20
// 	stage3D.sun.y = 60
// 	stage3D.sun.z = -100

// 	uniforms[ 'sunPosition' ].value.copy( stage3D.sun );

// 	// stage3D.renderer.toneMappingExposure = stage3D.effectController.exposure;
// 	// stage3D.renderer.render( stage3D.scene, stage3D.camera );

// }