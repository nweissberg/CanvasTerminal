import { GLTFLoader } from './__3D__/GLTFLoader.js';
import { KTX2Loader } from './__3D__/KTX2Loader.js';
import { MeshoptDecoder } from './__3D__/meshopt_decoder.module.js';

export function loadGLTF(path, stg3d, func = ((gltf)=>{stg3d.scene.add( gltf.scene )})){
	const ktx2Loader = new KTX2Loader()
		.setTranscoderPath( './libs/KTX2Loader.js' )
		.detectSupport( stg3d.renderer );

	const loader = new GLTFLoader().setPath( '__MODELS__/gltf/' );
	loader.setKTX2Loader( ktx2Loader );
	loader.setMeshoptDecoder( MeshoptDecoder );
	loader.load( path, func);
}