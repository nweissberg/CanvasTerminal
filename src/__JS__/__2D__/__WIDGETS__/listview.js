import { colors } from '../../__PALETTE__.js';
import { stg2D } from '../__STAGE__.js';
import { pln2D } from '../__PLANE__.js';
import { bttn2D } from '../__BUTTON__.js';
import { vec3D } from '../../__MATH__.js';
import { inputfield } from './inputfield.js'

export function addList(argument) {
	return new listview(argument)
}
export class listview extends stg2D {
	constructor( attr = {} ) {
		attr.size = ( attr["size"] ) ? attr["size"] : 22;
		attr.color = colors.alpha;
		// attr.strk = colors.active;
		attr.rltv = ( attr["rltv"] != undefined ) ? attr["rltv"] : true;
		attr.scrllMx = {x:0,y:-100};

		super(attr)
		this.attr = attr
		this.font_size = ( attr["font_size"] ) ? attr["font_size"] : 15;
		// this.blur = ( attr["blur"] ) ? attr["blur"] : 5;
		this.items = ( attr["items"] ) ? attr["items"] : [];
		this.actions = ( attr["actions"] ) ? attr["actions"] : null;
		this.cell_attr = ( attr["cell"] ) ? attr["cell"] : { h:10 };
		this.cell_obj = attr['cell_obj'] ? attr['cell_obj'] : null;
		this.txt_pvt = ( attr["txt_pvt"] ) ? attr["txt_pvt"] : [0.5,0.5];
		// this.input = ( attr["input"] ) ? new inputfield(attr) : false;
		this.def_onTch_U = ( attr["onTch_U"] ) ? attr["onTch_U"] : null;
		
		for (var j = 0; j < this.items.length; j++) {
			var txt = this.items[j]
			var action = (this.actions) ? this.actions[j]:this.def_onTch_U;
			var obj
			if(this.cell_obj) obj = this.cell_obj[j]

			this.add(txt, action, obj)
		}
		return(this)
	}
	get_attr(key,def_val){
		return this.attr[key] ? this.attr[key] : def_val ;
	}
	// onDrag(){
	// 	// if(isMobile){
	// 	if(cursor.hit == this.prnt) return
	// 	cursor.hit = this.prnt 
	// 	this.prnt.onDrag?.()
	// }
	// onScrll(scrllDlt){
	// 	if(cursor.hit == this.prnt) return
	
	// 	cursor.hit = this.prnt 
	// 	this.prnt.onScrll?.(scrllDlt)
	// }
	sort(newItem){
		var cell_h = this.cell_attr.h
		if(this._h/this.items.length >= this.cell_attr.h) cell_h = this._h/this.items.length
		this.i_height = ((100/this.items.length)*this.items.length)/(this._h/cell_h)
		this.scrllMx.y = -((this.i_height*this.items.length)/100)+1

		if(newItem){
			this.chld.forEach( (k) => {
				var i = this.items.indexOf(k.lbl.txt)
				k._h = this.i_height
				k.pos = new vec3D(0,(this.i_height)*i,0)
			} )
		}
	}
	clear(){
		this.chld.forEach( (k) => {
			k.del()
		} )
		this.items = []
	}
	sub(txt){
		const index = this.items.indexOf(txt);
		if (index > -1) {
			this.chld.forEach( (k) => {
				var i = this.items.indexOf(k.lbl.txt)
				if(index == i){
					k.del()
				}
			} )
			this.items.splice(index, 1);
		}
		this.sort(true)
		// console.log(this.items)
	}
	add(txt, action=null, obj=null){
		var newItem = false

		if(this.items.includes(txt) == false){
			this.items.push(txt)
			if(!action)action = this.def_onTch_U
			newItem = true
		}

		this.sort(newItem)
		const cell_attr = {...this.cell_attr,
			prnt:this,
			txt:txt?txt:'...',
			size:this.font_size,
			font_color: this.get_attr('font_color',colors.font_light),
			color:colors.window,
			h:this.i_height,
			pvt:[0.5,0],
			pos:new vec3D(0,(this.i_height)*this.chld.size,0),
			vis:this.vis,
			onTch_U:action
		}
		if(!this.cell_obj || !obj){
			this.cell = new bttn2D(cell_attr)
			if(this.cell.lbl.txt == '...') this.cell.lbl.txt = ''
		}else{
			if(!obj) return
			// console.log(obj)
			if(obj.lbl) obj.lbl.txt = txt
			obj.prnt = this
			obj.mask = this
			obj._h = this.i_height
			obj.pvt = [0.5,0]
			obj.pos = new vec3D(0,(this.i_height)*this.chld.size,0)
			this.addChild(obj)
			obj.indx = this.attr.indx
			this.cell = obj//new this.cell_obj(cell_attr)
		}

		// console.log(this.items)
	}
}