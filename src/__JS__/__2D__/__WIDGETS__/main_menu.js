import { bttn2D } from '../__BUTTON__.js';
import { colors } from '../../__PALETTE__.js';
import { pln2D } from '../__PLANE__.js';
import { vec3D } from '../../__MATH__.js';
import { color } from '../../__COLOR__.js';
import { txt2D } from '../__TEXT__.js';
import { edgebutton } from './edgebutton.js';
import { checkbox } from './checkbox.js';
import { alert } from './alert.js';

export class main_menu extends edgebutton {
	constructor( attr = {} ) {
		attr.cvs = "h_cvs"
		attr.src = "./__SVG__/menu.svg"
		attr.pos =  new vec3D(10,10,0)
		attr.popup =  new bttn2D({
			cvs:"h_cvs",
			prnt:attr.prnt,
			rltv:false,
			pvt:[0,0],
			pos:new vec3D(-222,0,0),
			rds:[0,10,0,10],
			line:3,
			strk:colors.stroke,
			w:222,
			h:stg_h,
			// blur:5,
			item_h:50,
			color:colors.window,
			onOvr:(()=>{}),
			// onTch_U:(function(){
			// 	cursor.active = this
			// }),
			onDrag:(()=>{}),
			onTch_Out:(function(){
				this.bttn.onTch_U()
			}),
		})
		attr.pos_init = new vec3D(-222,0,0)
		attr.pos_end = new vec3D(0,0,0)
	

		new txt2D({
			cvs:"h_cvs",
			color:colors.active,
			txt:"Canvas App Web Engine",
			pvt:[0.5,0],
			// family:"Times New Roman",
			size:15,
			style:"bold",
			pos: new vec3D(0,10,0),
			prnt: attr.popup
		})

		new txt2D({
			cvs:"h_cvs",
			pvt:[0.5,0],
			txt:"Envisioned by <b>@Nyco3D</b>",
			color:colors.font_light,
			pos: new vec3D(0,85,0),
			size:14,
			// clp:false,
			prnt: attr.popup
		})

		new bttn2D({
			cvs:"h_cvs",
			prnt: attr.popup,
			txt:"Logout",
			indx:0,
			color:colors.negative,
			pos: new vec3D(0,-3,0),
			pvt:[0.5,1],
			size:15,
			w:60,
			h:5,
			// rltv:false,
			rds:50,
			onTch_U:(function(){
				this.prnt.bttn.onTch_U()
				alert("Logout","Are you sure?",(()=>{
					db_server.logout(()=>{
						document.location.reload(true);
						// if(login_bot) return
						// login_bot = new bttn2D({
						// 	prnt: user_stg?.prnt,
						// 	txt:"Login",
						// 	indx:0,
						// 	color:colors.positive,
						// 	pos: new vec3D(0,30,0),
						// 	size:18,
						// 	w:30,
						// 	h:10,
						// 	rds:50,
						// 	onTch_U:(function(){
						// 		db_server.login("google",()=>{
						// 			// console.log(db_server.user)
						// 			this.del()
						// 		})
						// 	})
						// })
						// user_stg?.del()

						// this.del()
					})
					// file_dropdown.lbl.txt = "..."
					// terminal_box.lbl.txt = ""
					// file_dropdown.list.clear()
					// file_dropdown.x_bot.vis = false
					// files = []
					localStorage.clear()
				}))
			})
		})

		new bttn2D({
			cvs:"h_cvs",
			// indx:0,
			txt:"<i>RELOAD</i> <b>APP</b>",
			font_color:colors.font_light,
			color:colors.active,
			pos: new vec3D(0,15,0),
			pvt:[0.5,0],
			// line:3,
			// strk: new color("red"),
			size:20,
			w:90,
			h:8,
			rds:5,
			// vis:false,
			prnt: attr.popup,
			onTch_U:(function(){
				this.prnt.bttn.onTch_U()
				alert("<c=red><i>RED</i></c> ALERT","Force reload?",(()=>{
					document.location.reload(true);
				}))
			})
		})

		new txt2D({
			cvs:"h_cvs",
			txt:"Theme",
			color:colors.font_light,
			pos: new vec3D(0,-20,0),
			size:20,
			prnt: attr.popup
		})

		new bttn2D({
			cvs:"h_cvs",
			src: (dark_theme) ? './__SVG__/sun.svg' : './__SVG__/moon.svg',
			indx:0,
			color:(dark_theme) ? colors.sun : colors.moon,
			pos: new vec3D(0,-80,0),
			pvt:[0.5,0.5],
			// line:3,
			// strk: new color("blue"),
			// size:20,
			img_color:colors.font_dark,
			w:60,
			h:60,
			img_scale:1,
			// scale:0.1,
			rds:30,
			// vis:false,
			rltv:false,
			prnt: attr.popup,
			onLoad:(function(){
				this.state = dark_theme
			}),
			onTch_D:(function(){
				// this.lerpTo("scale",0.9,3).play()
			}),
			onTch_U:(function(){
				// this.lerpTo("scale",1.0,3).play()
				this.state = !this.state
				if(this.state){
					for(var c in colors){
						if(c == "colors_light" || c == "colors_dark") continue
						colors[c].r = colors.colors_dark[c].r
						colors[c].g = colors.colors_dark[c].g
						colors[c].b = colors.colors_dark[c].b
						colors[c].a = colors.colors_dark[c].a
					}
					this.img.set('./__SVG__/sun.svg')
					this.set_color(colors.sun)
				}else{
					for(var c in colors){
						if(c == "colors_light" || c == "colors_dark") continue
						colors[c].r = colors.colors_light[c].r
						colors[c].g = colors.colors_light[c].g
						colors[c].b = colors.colors_light[c].b
						colors[c].a = colors.colors_light[c].a
					}
					this.img.set('./__SVG__/moon.svg')
					// this.img.color = colors.font_light
					this.set_color(colors.moon)
				}
				saveVar("dark_theme",this.state)
				// console.log(this.state)
			})
		})

		new txt2D({
			cvs:"h_cvs",
			txt:"Glass Blur",
			color:colors.font_light,
			pos: new vec3D(0,0,0),
			size:20,
			prnt: attr.popup
		})

		new checkbox({
			cvs:"h_cvs",
			// indx:0,
			pos: new vec3D(0,7,0),
			prnt: attr.popup,
			state:glass_blur,
			onChange:(function(){
				glass_blur = this.state
				saveVar("glass_blur",this.state)
			})
		});

		new txt2D({
			cvs:"h_cvs",
			txt:"Volume",
			color:colors.font_light,
			pos: new vec3D(0,18,0),
			size:20,
			prnt: attr.popup
		})

		new pln2D({
			cvs:"h_cvs",
			color:colors.active,
			w:engine_volume*100,
			pvt:[0,0.5],
			// blur:5,
			prnt: new bttn2D({
				cvs:"h_cvs",
				indx:0,
				txt:false,
				font_color:colors.font_light,
				color:colors.alpha,
				pos: new vec3D(0,26,0),
				// pvt:[0.5,1.0],
				line:3,
				strk:colors.stroke,
				size:20,
				w:90,
				h:7,
				rds:100,
				prnt: attr.popup,
				onTch_M:(function(){
					if(cursor.hit!=this || cursor.state!=2)return
					// console.log(getLastValue(this.chld))
					if(this.bar == undefined) this.bar = getLastValue(this.chld)
					this.bar._w += (cursor.spd_x/(this.area[2]*0.01))
					if(this.bar._w < 0) this.bar._w = 0
					if(this.bar._w > 100) this.bar._w = 100
					// this.lbl.txt = Math.ceil(this.bar._w)+"%"
					engine_volume = Math.ceil(this.bar._w)/100
					Howler.volume(engine_volume);
					saveVar("engine_volume",engine_volume)
					// console.log( this.bar._w )

				}),
				onDrag:(()=>{})
			})
		})
		super(attr);
		// this.lock = lock_bttn
		return this
	}
}