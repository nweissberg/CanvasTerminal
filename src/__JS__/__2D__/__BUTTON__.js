import { obj2D, tTyp } from './__OBJECTS__.js';
import { color } from '../__COLOR__.js';
import { pln2D } from './__PLANE__.js';
import { img2D } from './__IMAGE__.js';
import { txt2D } from './__TEXT__.js';
import { vec3D } from '../__MATH__.js';

export class bttn2D extends pln2D {
	constructor( attr = {} ) {
		super(attr)
		attr.name = undefined
		this.onTch_D = ( this.attr["onTch_D"] ) ? this.attr["onTch_D"] : null;
		this.onTch_M = ( this.attr["onTch_M"] ) ? this.attr["onTch_M"] : null;
		this.onTch_U = ( this.attr["onTch_U"] ) ? this.attr["onTch_U"] : null;
		this.onScrll = ( this.attr["onScrll"] ) ? this.attr["onScrll"] : null;
		this.onTch_DC = ( this.attr["onTch_DC"] ) ? this.attr["onTch_DC"] : null;
		this.onKey = ( this.attr["onKey"] ) ? this.attr["onKey"] : null;
		attr["onKey"] = null
		this.attr["onKey"] = null
		this.onTch_Out = ( this.attr["onTch_Out"] ) ? this.attr["onTch_Out"] : null;
		this.onOvr = ( this.attr["onOvr"] ) ? this.attr["onOvr"] : (()=>{
			if(cursor.active == this) return
			if(!this.color_over || this.color.getStyle() == this.color_def.getStyle()){
				this.color_over = this.color.clone().add(color(0.3,0.3,0.3,0))
				this.color_def = this.color
			}
			this.color = this.color_over
		});
		this.onOut = ( this.attr["onOut"] ) ? this.attr["onOut"] : (()=>{
			if(!this.color_def) this.color_def = this.color
			this.color = this.color_def
			if(this.onDrag_U) this.onDrag_U()
		});

		this.onDrag = ( this.attr["onDrag"] ) ? this.attr["onDrag"] : (()=>{
			// console.log(this.name)
			// var top_prnt = this.prnt
			// if(this.prnt){
			// 	while(top_prnt.prnt) top_prnt = top_prnt.prnt
			// 	top_prnt.scrll += cursor.spd_y
			// }
			cursor.hit = null
		});

		this.onDrag_U = ( this.attr["onDrag_U"] ) ? this.attr["onDrag_U"] : (()=>{
			
		});

		attr.prnt = this
		attr.pvt = [0.5,0.5]
		// attr.size = 20
		attr.pos = new vec3D(0,0)
		attr.indx = 0
		if(attr.src != undefined){
			attr.color = ( this.attr["img_color"] ) ? this.attr["img_color"] : color("black");
			attr.scale = ( this.attr["img_scale"] ) ? this.attr["img_scale"] : 1;
			attr.rds = ( this.attr["img_rds"] ) ? this.attr["img_rds"] : 0;
			attr.mode = 1
			// attr.w = 100
			// attr.h = 100
			attr.pos = new vec3D(0,0,0)
			attr.rltv = true
			attr.vis = true
			this.img = new img2D(attr)
		}
		attr.color = ( this.attr["font_color"] ) ? this.attr["font_color"] : color("white");
		attr.pvt = ( this.attr["txt_pvt"] ) ? this.attr["txt_pvt"] : [0.5,0.5];
		attr.pos = ( this.attr["txt_pos"] ) ? this.attr["txt_pos"] : new vec3D(0,0,0);
		
		if(attr.txt) this.lbl = new txt2D(attr)
		return this
	}
	set_color(c){
		this.color = c
		this.color_over = this.color.clone().add(color(0.3,0.3,0.3,0))
		this.color_def = this.color.clone()
	}
}