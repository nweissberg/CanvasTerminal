import { color } from '../../__COLOR__.js';
import { colors } from '../../__PALETTE__.js';
import { vec3D } from '../../__MATH__.js';
import { bttn2D } from '../__BUTTON__.js';
import { txt2D } from '../__TEXT__.js';
import { getKey, getKeyListen } from '../../__KEYBOARD__.js';

export class modal2D extends bttn2D {
	constructor( attr = {} ) {
		attr.blur = 0
		attr.color = colors.window.clone().sub( new color(0,0,0,0.79))
		attr.onOvr = (()=>{})
		attr.onTch_U = (()=>{ this.onClose() })
		
		super(attr);
		this.time = attr.time ? attr.time : 10;
		this.onClose = (function(){
			this.exec(()=>{
				if(this.title) this.title
				.lerpTo("pos.y",-3.33,this.time)
				.pause(this.time+1)
				.play()
				if(this.body) this.body
				.lerpTo("pos.y",100.0,this.time)
				.exec(()=>{
					this.body.vis = false
					this.body.chld.forEach( (k) => { k.vis = false })
				})
				.pause(this.time)
				.play()
			})
			.pause(this.time).stack()
			.lerpTo("color.a",0.001,this.time)
			.lerpTo("blur",0,this.time)
			.exec(()=>{
				this.del()
			})
			.play()
		})
		attr.onKey = (function(){
			if(getKey("ESC",1)){
				this.del()
			}
		})
		return this
	}
}

export function preview(name,txt,prnt){
	const modal = new modal2D({ prnt })

	modal.body = new bttn2D({
		txt:txt,
		color:colors.glass_dark,
		font_color:colors.font_light,
		h:80,
		w:90,
		// scale:0.8,
		vis:false,
		onLoad:(function(){
			this.prnt.pos.y = 100
			this.prnt
			.lerpTo("pos.y",0.0,15)
			.stack()
			.lerpTo("blur",10,20)
			.stack()
			.lerpTo("color.a",0.7,10)
			.exec(()=>{
				this.vis = true
				this.lbl.vis = true
				// this.lerpTo("scale",1,5)
				// .play()
			})
			.play()
		}),
		strk:colors.stroke,
		// txt_pvt:[0,0],
		rds:5,
		line:3,
		onOvr:(()=>{}),
		prnt: modal,
		onTch_U:(function(){
			this.prnt.onTch_U()
		}),
		onScrll:(function(){
			// console.log(this.lbl.txt_width)

			if(cursor.hit?.name == this.name){
				const cx = (cursor.pos.x-this._x - (this.lbl.ofst.x*this.lbl.pvt[0]))
				const px = ((cx*100)/(this.area[2]*this.lbl.pvt[0]))-(100*this.lbl.pvt[0])
				// console.log(cx)

				const cy = (cursor.pos.y-this._y)
				const py = ((cy*100)/this.lbl.txt_height)
				if(getKey("LEFTCOMMAND",2)){
					// console.log("LEFTCOMMAND")
					
					const obj = this.lbl
					if(obj){
						var size = obj.size
						const math = (cursor.scrllDlt/((size/size)*size))
						size -= math
						if(size < 5) size = 5
						if(size > 50) size = 50

						// let p_pos = new vec3D(obj.prnt._x,obj.prnt._y,0)
						obj.size = size
						obj.ofst.y += (math*py)//*this.lbl.pvt[1]//(cursor.pos.y-p_pos.y)/obj.prnt._h
						obj.ofst.x += (math*px)
						// if(Math.abs(obj.size-size) > 0.3){
						// 	obj.lerpTo("size",size,3).play()
						// }else{
						// 	obj.size = size
						// }
						// console.log(cursor.rltv_pos(this.prnt))
						// console.log(p_pos.distanceTo(cursor.pos),obj.ofst)
						// obj.ofst.y -= (cursor.pos.y-p_pos.y)/obj.prnt._h
						return
					}
				
				}
				this.lbl.ofst.y += cursor.scrll.y
				this.lbl.ofst.x += cursor.scrll.x
			}
		}),
		onDrag:(function(){
			this.lbl.ofst.x+=cursor.spd_x
			this.lbl.ofst.y+=cursor.spd_y
		}),
		onDrag_U:(function(){
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
	})
	modal.title = new txt2D({
		txt:name,
		color:colors.active,
		prnt:modal,
		pvt:[0.5,0],
		size:22,
		style:"bold",
		pos: new vec3D(0,-3.33,0),
		onLoad:(function(){
			this.lerpTo("pos.y",3.33,10).pause(11).play()
		})
	})
}