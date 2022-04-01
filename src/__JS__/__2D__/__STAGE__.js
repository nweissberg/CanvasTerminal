import { pln2D } from './__PLANE__.js';
// import { bttn2D } from './__BUTTON__.js';
import { img2D } from './__IMAGE__.js';
import { rRcrsv } from './__OBJECTS__.js';

export class stg2D extends pln2D {
	constructor( attr = {} ) {
		super(attr)
		this._w = ( this.attr["w"] ) ? this.attr["w"] : stg_w;
		this._h = ( this.attr["h"] ) ? this.attr["h"] : stg_h;
		this.area 	= ( this.attr["area"] ) ? this.attr["area"] : [this._x, this._y, this._w, this._h];
		
		this.scrllStrt 	= ( this.attr["scrllStrt"] ) ? this.attr["scrllStrt"] : 0; // Scroll Start
		this.scrll 		= ( this.attr["scrll"] ) ? this.attr["scrll"] : {x:0,y:0};
		this.scrllTo 	= ( this.attr["scrllTo"] ) ? this.attr["scrllTo"] : {x:0,y:0};
		this.scrllMn 	= ( this.attr["scrllMn"] ) ? this.attr["scrllMn"] : {x:0,y:0};
		this.scrllMx 	= ( this.attr["scrllMx"] ) ? this.attr["scrllMx"] : {x:0,y:0};
		this.rltv 		= ( this.attr["rltv"] != undefined ) ? this.attr["rltv"] : false;
		this.pllUp 		= ( this.attr["pllUp"] ) ? this.attr["pllUp"] : null;
		this.pllDown 	= ( this.attr["pllDown"] ) ? this.attr["pllDown"] : null;
		this.scrllDwn 	= ( this.attr["scrllDwn"] ) ? this.attr["scrllDwn"] : null;

		this.drgR 	= ( this.attr["drgR"] ) ? this.attr["drgR"] : null;
		this.drgL 	= ( this.attr["drgL"] ) ? this.attr["drgL"] : null;
		this.active 	= ( this.attr["active"] = undefined ) ? this.attr["active"] : false;

		if(attr.src != undefined){
			attr.scale = ( this.attr["img_scale"] ) ? this.attr["img_scale"] : 1;
			attr.mode = 2
			attr.w = 100
			attr.h = 100
			attr.prnt = this
			attr.ofst = false
			this.img = new img2D(attr)
		}
		this.chld
		if(this.active == true) activeStage = this.name

		return this
	}
	updt(){
		// if(!this.rltv) return
		this.drew = false
		if(!this.prnt){
			this.area = [this._x, this._y, this._w,this._h];
			return
		}
		this.area = this.areaInPrnt()
		
		// if(this.ofst != false){
		// 	this.area[0] += this.ofst.x + this.scrll_ofst.x
		// 	this.area[1] += this.ofst.y + this.scrll_ofst.y
		// }
		
		if(this.clp && this.inPrnt() == false){
			this.hide = true
		}
		// if(!this.rltv) return
		if(this.prnt){
			if(this.rltv){
				var w = (this.prnt.area[2])*((this._w)/100)
				var h = (this.prnt.area[3])*((this._h)/100)	
			}else{
				var w = this._w
				var h = this._h
			}
			
			if(w < this.min_w) w = this.prnt.area[2]
			if(h < this.min_h) h = this.prnt.area[3]
			// if(this.ofst == false) this.ofst = {x:0,y:0}
			this._x = (this.prnt.area[2]*(this.pos.x/100)) + this.prnt._x + this.prnt.area[2]*this.pvt[0] - (w*this.pvt[0])*this.scale
			this._y = (this.prnt.area[3]*(this.pos.y/100)) + this.prnt._y + this.prnt.area[3]*this.pvt[1] - (h*this.pvt[1])*this.scale
			
			this.area = [	this._x+this.ofst.x+this.scrll_ofst.x, this._y+this.ofst.y+this.scrll_ofst.y, w*this.scale, h*this.scale]
			
		}else{
			// console.log(this.name)
			this.area = [this._x+this.ofst.x, this._y+this.ofst.y, this._w,this._h];
		}

		if(this.scrll.x > this.scrllMn.x*this.area[2]){
			this.scrll.x = this.scrllMn.x*this.area[2]
			// this.scrllLimit()
		}
		if(this.scrll.x < this.scrllMx.x*this.area[2]){
			this.scrll.x = this.scrllMx.x*this.area[2]
			// this.scrllLimit()
		}

		if(this.scrll.y > this.scrllMn.y*this.area[3]){
			this.scrll.y = this.scrllMn.y*this.area[3]
			// this.scrllLimit()
		}
		if(this.scrll.y < this.scrllMx.y*this.area[3]){
			this.scrll.y = this.scrllMx.y*this.area[3]
			// this.scrllLimit()
		}
		if(cursor.pip(this)){
			this.line =2
		}else{
			this.line =0
		}
		if(this.chld.size > 0) this.chld.forEach( (k) => {
			rRcrsv(k, ((k) => {
				if(k.scrll_ofst != false){
					k.scrll_ofst.x = this.scrll.x + this.scrll_ofst.x
					k.scrll_ofst.y = this.scrll.y + this.scrll_ofst.y
				}
			}))
		})
	}
	scrllLimit(){
		var top_prnt = this.prnt
		var cont = 1
		if(this.prnt){
			while(top_prnt.prnt){
				top_prnt = top_prnt.prnt
				cont++
			}
			top_prnt.scrll.y += cursor.spd_y*cont
			// top_prnt.scrll.y += cursor.scrllDlt
			top_prnt.scrll.x += cursor.spd_x*cont
			// top_prnt.scrll.x += cursor.scrllDlt
		}
	}
	onScrll(scrllDlt){
		if(cursor.hit?.name == this.name){
			// this.scrll.y += scrllDlt
			this.scrll.y += cursor.scrll.y
			this.scrll.x += cursor.scrll.x
		}
	}
	onTch_M(){
		if(cursor.hit == this ){
			this.scrll.y += cursor.spd_y
			this.scrll.x += cursor.spd_x
		}
	}
}