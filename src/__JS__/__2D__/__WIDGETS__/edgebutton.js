import { bttn2D } from '../__BUTTON__.js';
import { colors } from '../../__PALETTE__.js';
import { vec3D } from '../../__MATH__.js';


export class edgebutton extends bttn2D {
	constructor( attr = {} ) {
		attr.cvs = "h_cvs";
		attr.src = attr.src;
		attr.indx = 0;
		attr.color = colors.glass_dark;
		attr.pos =  ( attr["pos"] ) ? attr["pos"] : new vec3D(10,10,0);
		attr.pvt = [0,0];
		attr.img_color = colors.font_light;
		attr.w = 40;
		attr.h = 40;
		attr.img_scale = 2;
		attr.rds = 20;
		attr.rltv = false;
		attr.state = false
		attr.onTch_U = attr.onTch_U ? attr.onTch_U : (function(){
			this.state = !this.state
			// if(cursor.hit!=this.popup)return
			if(this.state == true){
				this.popup.lerpTo("pos.x",this.popup.pos_end.x,this.time).stack()
				.lerpTo("pos.y",this.popup.pos_end.y,this.time).play()
				this.img.set('./__SVG__/x.svg')
				if(cursor.active == null) cursor.active = this.popup
				cursor.hit = this.popup
			}else{
				this.popup.lerpTo("pos.x",this.popup.pos_init.x,this.time).stack()
				.lerpTo("pos.y",this.popup.pos_init.y,this.time).play()
				this.img.set(this.src_init)
				if(cursor.active == this.popup) cursor.active = null
			}
			this.popup.play();
		})
		super(attr);
		this.time = ( attr["time"] ) ? attr["time"] : 7;
		this.src_init = attr.src
		this.popup = attr.popup
		this.popup.pos_init = attr["pos_init"] ? attr.pos_init : new vec3D(-100,-100,0);
		this.popup.pos_end = attr["pos_end"] ? attr.pos_end : new vec3D();
		this.popup.bttn = this
		return this
	}
}