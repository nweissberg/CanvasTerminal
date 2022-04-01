import { bttn2D } from '../__BUTTON__.js';
import { pln2D } from '../__PLANE__.js';
import { colors } from '../../__PALETTE__.js';
import { vec3D } from '../../__MATH__.js';
import { getKey } from '../../__KEYBOARD__.js';

export class inputfield extends bttn2D {
	constructor( attr = {} ) {
		attr.txt = ( attr["txt"] ) ? attr["txt"] : "...";
		attr.txt_style = false;
		attr.strk = colors.stroke;
		// attr.font_color = colors.font_code;
		attr.min_ofst = new vec3D()
		attr.max_ofst = new vec3D()
		attr.txt_pvt = ( attr["txt_pvt"] ) ? attr["txt_pvt"] : [0,0];
		attr.line = 2;
		attr.edit = true;
		attr.family = "Courier New"

		attr.onTch_U = (function(){

			if(cursor.active == null){
				this.active = true
				this.toggle_select()
			}
			if(cursor.active == this && this.active == true){
				this.lbl.txt_cursor.touch_pos.x = cursor._x
				this.lbl.txt_cursor.touch_pos.y = cursor._y
				// console.log(this.lbl.txt_cursor.touch_pos)
			}
			
		})

		attr.onDrag_U = (function(){
			if(cursor.state == 3 || cursor.state == 0){
				if( this.lbl.txt_width < this.area[2]){
					this.lbl.lerpTo("ofst.x",0,5).stack()
				}
				if( this.lbl.txt_height < this.area[3]){
					this.lbl.lerpTo("ofst.y",0,5).stack()
				}
				this.lbl.play()
			}
		})

		// attr.onTch_D = (function(){
		// 	if(cursor.active == this && this.active == true){
		// 		this.lbl.txt_cursor.touch_pos.x = cursor._x
		// 		this.lbl.txt_cursor.touch_pos.y = cursor._y
		// 		// console.log(this.lbl.txt_cursor.touch_pos)
		// 	}
		// })

		if(attr.onTch_Out) var onTch_Out = attr.onTch_Out
		attr.onTch_Out = (function(){
			this.onDrag_U()
			if(cursor.active != null){
				// console.log(this.name)
				this.active = false
				this.toggle_select()
				if(onTch_Out) this.onTch_Out_Callback = onTch_Out
				if(this.onTch_Out_Callback) this.onTch_Out_Callback()
			}
		})

		attr.onDrag = (function(){
			if(this.active){
				this.lbl.ofst.x+=cursor.spd_x
				this.lbl.ofst.y+=cursor.spd_y
			}
		})

		attr.onScrll = (function(){
			
			if(this.active && cursor.hit?.name == this.name){
				this.lbl.ofst.y += cursor.scrll.y
				this.lbl.ofst.x += cursor.scrll.x
			}
		})
		var onLoad = attr.onLoad
		attr.onLoad = null

		super(attr);

		this.onLoad = onLoad
		if(this.onLoad){
			this.onLoad()
			this.onLoad = null
		}

		this.lbl.ofst = (attr.txt_ofst?attr.txt_ofst:new vec3D());

		this.active = false

		this.toggle_select = (function(){
			this.strk = (this.active) ? colors.active : colors.stroke;
			if(cursor.active != null && cursor.active != this){
				cursor.active.onTch_Out()
				if(cursor.active == this) cursor.active = null
			}
			// console.log(this.active)
			if(this.active){
				textField.value = this.lbl.txt
				cursor.active = this
				showTouchKeyboard = this
				textField.focus()
			}else{
				showTouchKeyboard = null
				cursor.active = null
				textField.blur()
				this.lbl.rst()
			}
		})
		
		this.pin = new pln2D({
			prnt:this,
			rltv:false,
			w:2,
			h:this.lbl.size+6,
			pvt:attr.txt_pvt,
			// pos: new vec3D(0,-1,0),
			color:colors.active,
			// clp:false,
			// loop:(function(){
			// 	if(showTouchKeyboard == this.prnt){
			// 		// console.log(textField.selectionStart, textField.selectionEnd)
			// 		var lbl = this.prnt.lbl
			// 		this.indx = 0
			// 		this.ofst.x = lbl.txt_cursor.x+lbl.ofst.x
			// 		this.ofst.y = lbl.txt_cursor.y+lbl.ofst.y
			// 	}else{
			// 		this.indx = 1
			// 	}
			// })
		})

		return this

	}
}
