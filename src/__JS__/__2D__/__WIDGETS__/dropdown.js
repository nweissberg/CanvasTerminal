import { colors } from '../../__PALETTE__.js';
import { bttn2D } from '../__BUTTON__.js';
import { vec3D } from '../../__MATH__.js';
import { listview } from './listview.js';
import { rRcrsv } from '../__OBJECTS__.js';
import { inputfield } from './inputfield.js';
import { getKey} from '../../__KEYBOARD__.js';

export class dropdown extends inputfield {
	constructor( attr = {} ) {
		attr.txt = "...";
		attr.color = colors.glass_terminal;
		attr.font_color = colors.font_medium;
		attr.strk = colors.stroke;
		attr.size = ( attr["font_size"] ) ? attr["font_size"] : 15;
		attr.rds = 5;
		attr.w = ( attr["w"] ) ? attr["w"] : 100;
		attr.h = ( attr["h"] ) ? attr["h"] : 10;
		attr.txt_pvt = [0.5,0.5]
		attr.line = 2;

		attr.onLoad = (function(){
			this.state = false
		})
		attr.onTch_U = (function(){
			// if(cursor.active == null){
				this.toggle()
			// }
		})

		attr.onTch_Out = (function(){
			// console.log(this)
			this.action_bot.indx = 0
			// if(cursor.active == this){
			// 	this.toggle()
			// }
		})
		attr.onKey = (function(){
			if(cursor.active != this) return

			var empty = (this.lbl.txt == "..." || this.lbl.txt == "" || this.lbl.txt == "\n")
			if(getKey("ENTER",1)){
				this.lbl.txt = this.lbl.txt.slice(0, -1);
				if(empty){
					this.action_bot.indx = 0
				}else{
					this.action_bot.onTch_U()
				}
				this.toggle()
				return this
			}

			if(this.list.items.includes(this.lbl.txt) == false && !empty){
				this.x_bot.vis = false
				this.lbl.color = colors.font_medium
				this.action_bot.mode("add")
			}else{
				this.x_bot.vis = false
				this.action_bot.mode("dropdown")
				this.action_bot.indx = 1
			}
			if(this.list.items.includes(this.lbl.txt) == true){
				this.lbl.color = colors.font_light
				this.x_bot.vis = true
				this.action_bot.mode("open")
			}
		
		})
		super(attr)
		
		this.onDrag_U = (function(){
			if(cursor.state == 3 ){
				if( this.lbl.txt_width < this.area[2]){
					this.lbl.lerpTo("ofst.x",0,5).stack()
				}
				if( this.lbl.txt_height < this.area[3]){
					this.lbl.lerpTo("ofst.y",0,5).stack()
				}
				this.lbl.play()
			}
		})

		this.def_txt = attr.txt
		let h = attr.h//attr.max_h && attr.h < attr.max_h ? ((attr.max_h*10)/this.prnt._h) : attr.h
		this.list = new listview({
			prnt:this.prnt,
			pos:this.pos.clone().add(new vec3D(0,(h*1.5)+(h/2),0)),
			rds:[0,0,5,5],
			w:attr.w,
			h:h*3,
			indx:this.indx,
			// blur:5,
			item_h:attr.item_h,
			rltv:attr.rltv,
			vis:false,
			font_size:attr.size,
			items:attr.items,
			onTch_U:(function(){
				var bttn = this.prnt.bttn
				bttn.lbl.color = colors.font_light
				bttn.lbl.txt = this.lbl.txt
				bttn.x_bot.vis = true
				bttn.state = bttn.action_bot.state
				bttn.action_bot.state = false
				bttn.action_bot.img.set('./__SVG__/arrow-down.svg')
				bttn.toggle()
				if(bttn.onChange) bttn.onChange()
			})
		})
		this.action_bot = new bttn2D({
			prnt:this,
			src:"./__SVG__/arrow-down.svg",
			color:colors.window,
			img_color:colors.positive,
			strk:colors.positive,
			line:2,
			img_scale:2,
			rltv:false,
			w:35,
			h:35,
			rds:5,
			pvt:[1,0.5],
			pos: new vec3D(-10,0,0),
			onLoad:(function(){
				this.state = false
				this.action = "dropdown"
			}),
			// vis:false,
			onTch_U:(function(){
				// console.log(this.prnt)
				if(this.action == "open"){
					// console.log("__OPEN__ FILE")
				}
				if(this.action == "add"){
					// console.log("__ADD__ FILE")
					this.prnt.list.add(this.prnt.lbl.txt)
					this.prnt.lbl.color = colors.font_light
					this.prnt.x_bot.vis = true
				}
				if(this.action == "dropdown"){
					// console.log("__TOGGLE__ LIST")
					this.prnt.state = this.state
					cursor.active = this.prnt
					this.prnt.toggle()
					this.state = !this.state
					if(this.state){
						this.img.set('./__SVG__/arrow-up.svg')
					}else{
						this.img.set('./__SVG__/arrow-down.svg')
					}
				}else{
					if(this.prnt.onChange) this.prnt.onChange()
					this.mode("dropdown")
				}
			})
		})
		this.action_bot.mode = function(mode){
			if(mode == "dropdown"){
				this.state = false
				this.strk = colors.positive
				this.img.color = colors.positive
				this.img.set('./__SVG__/arrow-down.svg')
			}
			if(mode == "add"){
				this.indx = 0
				this.strk = colors.sun
				this.img.color = colors.sun
				this.img.set('./__SVG__/plus.svg')
			}
			if(mode == "open"){
				this.indx = 0
				this.img.color = colors.active
				this.strk = colors.active
				this.img.set('./__SVG__/download.svg')
			}
			this.action = mode
		}
		this.x_bot = new bttn2D({
			prnt:this,
			src:"./__SVG__/x.svg",
			color:colors.window,
			img_color:colors.negative,
			strk:colors.negative,
			line:2,
			img_scale:2,
			rltv:false,
			w:35,
			h:35,
			rds:5,
			pvt:[0,0.5],
			pos: new vec3D(10,0,0),
			vis:false,
			onTch_U:(function(){
				this.prnt.lbl.txt = this.prnt.def_txt
				this.prnt.lbl.color = colors.font_medium
				this.vis = false
			})
		})
		this.onChange = ( attr["onChange"] ) ? attr["onChange"] : null;
		this.list.bttn = this
		return(this)
	}
	toggle(){
		
		// console.log("toggle ", this.name, this.action_bot.state)
		this.state = !this.state
		this.strk = (this.state) ? colors.active : colors.stroke;
		this.list.vis = this.state
		this.list.chld.forEach( (k) => {
			rRcrsv(k, ((k) => {
				k.vis = this.state
			}))
		} )

		if(cursor.active != null && cursor.active != this){
			cursor.active.onTch_Out()
			// if(cursor.active == this) cursor.active = null
		}else{
			showTouchKeyboard = null
		}
		if(this.state){
			this.rds = [5,5,0,0]
			cursor.active = this
		}else{
			this.rds = 5
			cursor.active = null
		}
		// console.log("dropdown "+this.name,)
	}
}