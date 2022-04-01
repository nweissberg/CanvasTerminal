import {PointLight,
		PointLightHelper,
		HemisphereLight,
		HemisphereLightHelper
		} from '../__3D__/three.module.js';
import {obj3D} from '../__3D__/__OBJECTS3D__.js';

export class lght3D extends obj3D{
	constructor( attr = {} ) {
		super(attr)
		this.pwr = ( this.attr["pwr"] ) ? this.attr["pwr"] 	: 1;
		this.clr = ( this.attr["clr"] ) ? this.attr["clr"] 	: 0xffffff;
		this.rds = ( this.attr["rds"] ) ? this.attr["rds"] 	: 200;
		this.light = new PointLight( this.clr, this.pwr, this.rds );
		this.light.position.set(this.pos.x,this.pos.y,this.pos.z);
		this.light.castShadow = ( this.attr["shdw"] ) ? this.attr["shdw"] 	: false;
		this.res = ( this.attr["res"] ) ? this.attr["res"] 	: 256;
		this.hlpr = ( this.attr["hlpr"] ) ? this.attr["hlpr"] 	: false;
		
		if(this.attr["shdw"]){
			this.light.shadow.bias = -0.001
			this.light.shadow.mapSize.width = this.res;
			this.light.shadow.mapSize.height = this.res;
			this.light.shadow.camera.near = 0.5;
			this.light.shadow.camera.far = 500;
		}

		this.scn.add( this.light );

		if(this.hlpr){
			this.light_hlpr = new PointLightHelper( this.light, this.rds/10 );
			this.scn.add( this.light_hlpr );
		}
	}
}

export class hemi3D extends lght3D{
	constructor( attr = {} ) {
		super(attr)
		this.clrb = ( this.attr["clrb"] ) ? this.attr["clrb"] 	: 0xffffff;
		this.light = new HemisphereLight( this.clr, this.clrb, this.pwr );
		this.light.position.set(this.pos.x,this.pos.y,this.pos.z);

		this.scn.add( this.light );

		if(this.hlpr){
			this.light_hlpr = new HemisphereLightHelper( this.light, this.rds/10 );
			this.scn.add( this.light_hlpr );
		}
	}
}