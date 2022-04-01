import { bttn2D } from '../__BUTTON__.js';
import { colors } from '../../__PALETTE__.js';
import { pln2D } from '../__PLANE__.js';
// import { getKey} from '../../__KEYBOARD__.js';
import { edgebutton } from './edgebutton.js';
import { vec3D } from '../../__MATH__.js';
import { color } from '../../__COLOR__.js';

export class joystick extends edgebutton {
	constructor( attr = {} ) {
		attr.src = "./__SVG__/joystick.svg"
		attr.pos =  new vec3D(stg_w-50,stg_h - 50,0)
		attr.pos_init =  new vec3D(stg_w,stg_h,0)
		attr.pos_end =  new vec3D(stg_w-200,stg_h-200,0)
		attr.popup = new pln2D({
			cvs:"h_cvs",
			prnt:attr.prnt,
			rltv:false,
			pvt:[0,0],
			pos: new vec3D(stg_w,stg_h,0),
			rds:75,
			w:150,
			h:150,
			item_h:50,
			color:colors.glass_light.clone().add(new color(0,0,0,-0.2)),
		})

		attr.popup.lock_bttn = new bttn2D({
			cvs : "h_cvs",
			src : "./__SVG__/lock.svg",
			indx : 0,
			color : colors.glass_dark,
			pos :  ( attr["pos"] ) ? attr["pos"].clone().add(new vec3D(0,-50,0)) : new vec3D(10,50,0),
			pvt : [0,0],
			img_color : colors.font_light.clone(),
			w : 40,
			h : 40,
			img_scale : 1.7,
			rds : 20,
			rltv : false,
			prnt :  attr.prnt,
			state : false,
			onTch_U : attr.onTch_U ? attr.onTch_U : (function(){
				this.state = !this.state
				if(this.state == true){
					// this.popup.lerpTo("pos.x",this.popup.pos_end.x,9).stack()
					// .lerpTo("pos.y",this.popup.pos_end.y,9).play()
					cursor.onTch_D = (function(){
						if(!cursor.hit){
							// touchpad.pos.x = 0
							// touchpad.pos.y = 0
							cursor.hit = touchpad
							touchpad.prnt.pos.x = cursor.pos.x
							touchpad.prnt.pos.y = cursor.pos.y

							touchpad.prnt.lerpTo("scale",1.0,5).stack()
							.lerpTo("pos.x",cursor.pos.x-75,5).stack()
							.lerpTo("pos.y",cursor.pos.y-75,5).play()
							touchpad.prnt.pos_end.x = touchpad.prnt.pos.x
							touchpad.prnt.pos_end.y = touchpad.prnt.pos.y
							touchpad.drag = true
							touchpad.lerpTo("pos.x",0,5).stack().lerpTo("pos.y",0,5).play()
						}
						touchpad.crsr_rltv = new vec3D()//cursor.rltv_pos(touchpad.prnt)
						touchpad.crsr_init = new vec3D()//cursor.rltv_pos(touchpad.prnt)//.add(new vec3D(0.9,0.9,0))
						// console.log(cursor.pos.x,cursor.pos.y)
					})
					this.img.color.set(colors.active)
					this.img.set('./__SVG__/unlock.svg')
				}else{
					// touchpad.pos.x = 0
					// touchpad.pos.y = 0
					touchpad.prnt.lerpTo("scale",1.0,5).stack()
					.lerpTo("pos.x",touchpad.prnt.pos_end.x-75,5).stack()
					.lerpTo("pos.y",touchpad.prnt.pos_end.y-75,5).play()
					cursor.onTch_D = null
					// this.popup.lerpTo("pos.x",this.popup.pos_init.x,9).stack()
					// .lerpTo("pos.y",this.popup.pos_init.y,9).play()
					this.img.set('./__SVG__/lock.svg')
					this.img.color.set(colors.font_light)
				}
				// this.popup.play()
			})
		})

		new pln2D({
			cvs:"h_cvs",
			prnt:attr.popup,
			rds:60,
			w:60,
			h:60,
			color:colors.glass_dark.clone().add(new color(0,0,0,-0.1)),
		})
		
		touchpad = new bttn2D({
			cvs:"h_cvs",
			// txt:" ",
			rds:50,
			w:50,
			h:50,
			line:3,
			color:colors.glass_blue,
			strk:colors.active,
			prnt:attr.popup,
			onOvr:(()=>{}),
			onTch_U:(function(){
				// this.lbl.txt = ""
				this.dir = ""
				if(this.prnt.lock_bttn.state == true){
					this.prnt.lerpTo("scale",0.0,5).stack()
					.lerpTo("pos.x",cursor._x,5).stack()
					.lerpTo("pos.y",cursor._y,5).play()
					// this.pos.x = 0
					// this.pos.y = 0

				}else{
					this.lerpTo("pos.x",0,5).stack().lerpTo("pos.y",0,5).play()
				}
			}),
			onOut:(function(){

				if(this.prnt.lock_bttn.state == true){
					this.prnt.lerpTo("scale",0.0,5).stack()
					.lerpTo("pos.x",cursor._x,5).stack()
					.lerpTo("pos.y",cursor._y,5).play()
				}else{
					this.lerpTo("pos.x",0,5).stack().lerpTo("pos.y",0,5).play()
				}
			}),
			onTch_D: (function(){
				// console.log(this.prnt.lock_bttn.state)

				if(this.prnt.lock_bttn.state != true){
					this.drag = true
					this.crsr_init = cursor.rltv_pos(this.prnt)
					this.crsr_rltv = cursor.rltv_pos(this.prnt)
				}
			}),
			onLoad:(function(){
				// this.time = Date.now();
				// this.crsr_init = new vec3D(0,0,0)
				this.dir = ""
			}),
			onDrag:(function(){
				if(!this.crsr_init || this.prnt.scale < 1) return
				this.crsr_rltv = cursor.rltv_pos(this.prnt)
				let ox = (this.crsr_rltv.x - this.crsr_init.x)*100
				let oy = (this.crsr_rltv.y - this.crsr_init.y)*100
				
				const px = this.crsr_init.x
				const py = this.crsr_init.y

				const theta = Math.PI
				var dis = (new vec3D(px, py, 0)).distanceTo(new vec3D(ox, oy, 0) )

				if(dis > 25){
					this.crsr_rltv = this.crsr_rltv.sub(this.crsr_init).normalize()
					ox = this.crsr_rltv.x*25
					oy = this.crsr_rltv.y*25
					dis = 25
				}

				this.pos.x = Math.cos(theta) * (px-ox) - Math.sin(theta) * (py-oy)
				this.pos.y = Math.sin(theta) * (px-ox) + Math.cos(theta) * (py-oy)
				if(dis>22 && dis<=25){
					// console.log(this.prnt.scale)
					this.angle = Math.atan2(this.pos.y*(-1), this.pos.x)
					this.degres = Math.round((this.angle/theta)*180)
					if(this.degres > -45 && this.degres < 45){
						// this.lbl.txt = "Right"
						this.dir = "D"
					}
					if(this.degres > 45 && this.degres < 135){
						// this.lbl.txt = "Up"
						this.dir = "W"
					}
					if((this.degres > 135 && this.degres < 180) || (this.degres < -135 && this.degres > -180)){
						// this.lbl.txt = "Left"
						this.dir = "A"
					}
					if(this.degres < -45 && this.degres > -135){
						// this.lbl.txt = "Down"
						this.dir = "S"
					}
					// this.lbl.txt = `${this.degres}º`
				}else{
					// this.lbl.txt = " "
					this.dir = ""
				}
				// console.log(`${this.degres}º`)
				// this.time = Date.now()
			})
		})
		super(attr);
		// this.lock = lock_bttn
		return this
	}
}