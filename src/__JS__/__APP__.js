import { color } from './__COLOR__.js';
import { colors } from './__PALETTE__.js';
import { stg2D } from './__2D__/__STAGE__.js';
import { addCanvas2D, onWindowResize } from './__2D__/__CANVAS__.js';
import { pln2D } from './__2D__/__PLANE__.js';
import { bttn2D } from './__2D__/__BUTTON__.js';
import { txt2D } from './__2D__/__TEXT__.js';
import { vec3D } from './__MATH__.js';
import { img2D } from './__2D__/__IMAGE__.js';
import { render } from './__ENGINE__.js';
import { crsr2D, mseWhl } from './__CURSOR__.js';
import { kybrd, getKey, kybrd_rst } from './__KEYBOARD__.js';
import { listview } from './__2D__/__WIDGETS__/listview.js';
import { matrixview } from './__2D__/__WIDGETS__/matrixview.js';
import { dropdown } from './__2D__/__WIDGETS__/dropdown.js';
import { inputfield } from './__2D__/__WIDGETS__/inputfield.js';
import { alert } from './__2D__/__WIDGETS__/alert.js';
import { edgebutton } from './__2D__/__WIDGETS__/edgebutton.js';
import { joystick } from './__2D__/__WIDGETS__/joystick.js';
import { main_menu } from './__2D__/__WIDGETS__/main_menu.js';
import { server } from './__LIBS__/firebase.js';
// import codegrid from './__LIBS__/codegrid.js'
import { modal2D, preview } from './__2D__/__WIDGETS__/modal.js';
import { database } from './__DATABASE__.js';
import { setFullScreen } from './__2D__/__BROWSER__.js'
// import { athena } from './__2D__/__WIDGETS__/athena.js';
import { OrbitControls } from './__3D__/OrbitControls.js'

import { stg3D } from './__3D__/__STAGE3D__.js';

import {
		MeshPhongMaterial,
		PlaneGeometry,
		IcosahedronGeometry,
		DirectionalLightHelper,
		DirectionalLight,
		Mesh,
		Vector3,
		MathUtils,
		BoxGeometry,
		MeshBasicMaterial
} from './__3D__/three.module.js';

import {obj3D} from './__3D__/__OBJECTS3D__.js';
import { Reflector } from './__3D__/Reflector.js';
import {lght3D,hemi3D} from './__3D__/__LIGHTS__.js';
import {loadGLTF} from './__LOADER__.js'
import { Sky } from './__3D__/Sky.js';

// 1. Web application using api
// 2. Bronchure site
// 3. E-commerce site
// 4. Personal Portfolio
// 5. Simple game


var motion = new vec3D()
var user_speed = motion.clone()
var last_motion = motion.clone()

// console.log(gps, gps.getCurrentPosition(success, error, options) )

if (window.DeviceMotionEvent) {
	window.addEventListener("devicemotion", deviceMotionHandler);
}

function deviceMotionHandler(event){
	let motionEvent = event
	// console.log(event.accelerationIncludingGravity)
	// if("in_out" in myObjectDictionary){
		// log(event)

		//myObjectDictionary["in_out"].text = "x:" + event.acceleration.x +"\ny:"+ event.acceleration.y +"\nz:"+ event.acceleration.z
		// myObjectDictionary["in_out"].text = "x:" + event.accelerationIncludingGravity.x +"\ny:"+ event.accelerationIncludingGravity.y +"\nz:"+ event.accelerationIncludingGravity.z
		// char_P1 = myObjectDictionary["char_P1"]
		// char_P1.position.x = motionEvent.accelerationIncludingGravity.x//event.rotationRate.beta/10
		// char_P1.position.x = lerp(char_P1.position.x, event.accelerationIncludingGravity.x, 1/3)
		// char_P1.position.x += event.accelerationIncludingGravity.x/10
		// char_P1.position.y = event.accelerationIncludingGravity.y
		//char_P1.position.y = -event.rotationRate.alpha/10
		// char_P1.rotation.y += event.acceleration.y
		// char_P1.rotation.z += event.acceleration.z
	// }
	motion.x = event.accelerationIncludingGravity.x
	motion.y = event.accelerationIncludingGravity.y
	motion.z = event.accelerationIncludingGravity.z
	if(!motion)return
	if(motion && last_motion && user_speed){
		user_speed.x = motion.x - last_motion.x
		user_speed.y = motion.y - last_motion.y
		user_speed.z = motion.z - last_motion.z
		// console.log(user_speed)
	}

	last_motion = motion
}

let db = new Localbase('db_N3D')
const user = {
  id: 1,
  name: 'Bill',
  age: 47
}
db.collection('users').add(user,user.name)

console.log('teste ;)')
cursor = new crsr2D()
var files = []

addCanvas2D({
	name:"m_cvs"
}).resize(stg_w,stg_h)

addCanvas2D({
	// indx:10,
	name:"h_cvs"
}).resize(stg_w,stg_h)

m_stg = new stg2D({
	color:colors.stage,
	// src:'./__IMG__/Cidade_BG_1024.jpg',
	// pos:new vec3D(100,0,0),
	w:stg_w,
	h:stg_h
})

var h_stg =	new stg2D({
	color:colors.alpha,
	w:stg_w,
	h:stg_h,
	onLoad:(function(){
		this.onScrll = null
		this.onTch_M = null	
	})
	
})

function getLastValue(set){
	let value;
	for(value of set);
	return value;
}

files = loadVar("saved_files")
if(files){
	files = JSON.parse(files)
}else{
	files = []
}

// console.log(files)

function loadLocalCode(name){
	var AES_TXT = loadVar("terminal_"+name)
		if(AES_TXT){
			var code = Aes.Ctr.decrypt( AES_TXT, keyCode, 256);
			return( code )
		}else{
			console.error("File not found")
			return( "" )
		}
}

// for (var i = 0; i < 1; i++) {
var card = new pln2D({
	// cvs:"h_cvs",
	color:colors.window,
	// pos: new vec3D(0,(100*i)+(i>0?5:0),0),
	w: 60,
	h: 100,
	line:3,
	// pvt:[1,1],
	// blur:2,
	// tab:i%3,

	min_h:333,
	min_w:333,
	strk:colors.stroke,
	rds:5,
	prnt: m_stg
})

// new bttn2D({
// 	prnt:card,
// 	rltv:false
// })
// new bttn2D({
// 	txt:'teste 3',
// 	prnt:h_stg,
// 	pvt:[0,0],
// 	rltv:false,
// 	indx:[0,1,2,3],
// 	color:colors.glass_terminal,
// 	// loop:(function (){
// 	// 	console.log(user_speed,time)
// 	// 	this.txt = user_speed.x+","+user_speed.y+","+user_speed.z
// 	// }),
// 	// onOvr:(function (argument) {
// 	// 	// console.log(this,motion)
// 	// 	this.lbl.txt = 'FOi'
// 	// })
// })
new bttn2D({
	// cvs:"h_cvs",
	// indx:0,
	// pos: new vec3D(0,0,0),
	indx:[0,1,2,3,4],
	pvt:[0.5,0],
	color: new color(0,0,0,1),
	src:'./__IMG__/Temet_Nosce_Nyco3D.jpeg',
	// w: 90,
	// h: 60,
	rds:5,
	prnt: card,
	onOvr:(()=>{})
})

var script_list = new listview({
	prnt:card,
	pos: new vec3D(0,10,0),
	// pvt:[0.5,1],
	blur:0,
	item_h:7,
	w:60,
	h:60,
	rds:5,
	items:files,
	onTch_U:(function(){
		const code = loadLocalCode(this.lbl.txt)
		try{
			eval(`(()=>{'use strict';${ code }})`)()
		}catch(e){
			preview(this.lbl.txt, code,this.prnt.prnt.prnt)
			return
		}
	})
})

new matrixview({
	h:8,
	w:60,
	prnt:card,
	pvt:[0.5,0],
	pos:new vec3D(0,12,0),
	rds:50,
	init: ((prnt)=>[
			[
				new bttn2D({
					prnt,
					pvt:[0.5,0],
					w:70,
					size:18,
					txt:'TESTE',//.split(' ')[0],
					color:colors.window,
					onTch_U:(()=>{
						// alert('Make APP Public', "Are you sure?")
					})
				}),
				new bttn2D({
					color:colors.window,
					// name:"edit",
					img_color:colors.font_light,
					txt:"",
					src:'./__SVG__/lock.svg',
					img_scale:1,
					pvt:[0.5,1],
					w:30,
					// rltv:false,
					prnt,
					onTch_U:(()=>{
						alert('Make APP Public',
							"Are you sure?",
							(()=>{ console.log("Yes")}),
							(()=>{ console.log("No")}))
					})
				}),
			]
		]
	)
})

script_list.chld.forEach( (k) => {
	k.log = (function(...args){
		var txt = ""
		for (var i in args) {
			var obj = args[i]
			obj = JSON.stringify(obj)
			txt += obj +"\n"
		}
		preview(this.lbl.txt,txt,this.prnt.prnt.prnt)
		return
	})
})

var login_bot = new bttn2D({
	prnt: card,
	txt:"Login",
	indx:0,
	color:colors.positive,
	pos: new vec3D(0,2,0),
	pvt:[0.5,0],
	size:18,
	w:30,
	h:6,
	rds:50,
	onTch_U:(function(){
		db_server.login("google",()=>{
			// console.log(db_server.user)
			this.del()
		})
	})
})

// ## TERMINAL ## //

var terminal_box = new inputfield({
	// cvs:"h_cvs",
	// blur:5,
	txt:"// Javascript TERMINAL\n\nalert('ALERT', 'Hello World!' );",
	prnt:card,
	color:colors.glass_terminal,
	pos: new vec3D(0,5,0),
	size:14,
	strk:colors.stroke,
	font_color:colors.font_code,
	// txt_pos: new vec3D(2,3,0),
	txt_ofst:new vec3D(10,10,0),
	indx:[1,3],
	rds:5,
	w:90,
	h:60,
	onOvr:(()=>{})
})

terminal_box.exec = (function(){
	kybrd_rst()
	try{
		eval("(()=>{'use strict';"+ this.lbl.txt +"})")()
	}catch(e){
		this.error(e)
	}
})
terminal_box.clear = (function(){
	textField.value = ""
	this.lbl.txt = ""
})

terminal_box.log = (function(...args){
	this.console_box.lbl.color = colors.font_light
	this.console_box.lbl.txt = ""
	for (var i in args) {
		var obj = args[i]
		obj = JSON.stringify(obj)
		this.console_box.lbl.txt += obj +"\n"
		console.log(obj)
	}
})

terminal_box.error = (function(...args){
	this.console_box.lbl.color = colors.negative
	this.console_box.lbl.txt = ""
	for (var i in args) {
		var obj = args[i]
		// console.log(typeof obj)
		if(toType(obj) == 'error'){
			this.console_box.lbl.txt = "<b>" +obj.name +"</b> : "+ obj.message
		}else{
			obj = JSON.stringify(obj)
			this.console_box.lbl.txt += obj +"\n"
			console.error(obj)
		}
	}
})

var console_box = new bttn2D({
	txt:"...",

	// txt_style:false,
	prnt:terminal_box,
	color:colors.glass_dark,
	font_color:colors.font_medium,
	txt_pvt:[0.5,0.5],
	strk:colors.stroke,
	line:1,
	size:15,
	blur:3,
	pvt:[0.5,1],
	txt_pos: new vec3D(0,2.5,0),
	rds:5,
	// h:50,
	pos: new vec3D(0,88,0),
	onOvr:(()=>{}),
	onLoad:(function(){
		this.state = false
	}),
	// onTch_U:(function(){
	// 	this.state = !this.state
	// 	if(this.state == true){
	// 		this.lerpTo("pos.y",0,5).play()
	// 		this.strk = colors.positive
	// 		this.blur = 5
	// 	}else{
			
	// 		this.strk = colors.stroke
	// 		this.blur = 0
	// 		// console.log(this.getSon("maximize")?.state)
	// 	}
	// 	this.lerpTo("pos.y",(this.getSon("maximize")?.state?91:88),10).play()
	// }),
})

new bttn2D({
	name:"arrow-up",
	txt:"",
	src:'./__SVG__/arrow-up.svg',
	img_scale:2,
	img_color:colors.font_medium,
	prnt:console_box,
	color:colors.glass_dark,
	font_color:colors.font_medium,
	txt_pvt:[0.5,0],
	strk:colors.font_medium,
	line:2,
	size:15,
	// blur:5,
	pvt:[1,0],
	txt_pos: new vec3D(0,2.5,0),
	rds:5,
	// h:50,
	w: 35,
	h: 35,
	rltv:false,
	pos: new vec3D(-10,10,0),
	// onOvr:(()=>{}),
	onLoad:(function(){
		this.state = false
	}),
	onTch_U:(function(){
		// console.log(this.initial_values)
		
		
		if(this.state == false){
			this.img.set('./__SVG__/arrow-down.svg')
			// card.pvt = [0.5,0.5]
			// card.pos.y = 0
			// card._w = 100
			// card._h = 100
			// term.pvt = card.pvt
			// term.pos.y = 0
			// term.pos.x = card.pos.x
			// term._w = 100//card._w
			// term._h = 100//card._h
			// term.set_cvs("h_cvs")
			// cons.set_cvs("h_cvs")
			// term.prnt.tab = 3
			// // cons.pos.y = 90
			// term.set_color(colors.font_dark)
			this.prnt.lerpTo("pos.y",0,10).play()
		}else{
			this.img.set('./__SVG__/arrow-up.svg')
			// console.log(this.initial_values.card.pos)
			// term.prnt.tab = 1
			// card.pvt = this.initial_values.card.pvt
			// card.pos.y = this.initial_values.card.pos.y
			// card._w = this.initial_values.card._w
			// card._h = this.initial_values.card._h
			// term.pvt = this.initial_values.term.pvt
			// term.pos.y = this.initial_values.term.pos.y
			// term.pos.x = this.initial_values.term.pos.x
			// term._w = this.initial_values.term._w
			// term._h = this.initial_values.term._h
			// term.set_cvs("m_cvs")
			// cons.set_cvs("m_cvs")
			// term.set_color(colors.glass_dark)
			this.prnt.lerpTo("pos.y",(this.prnt.getSon("maximize")?.state?91:88),10).play()
		}
		// this.prnt.lerpTo("pos.y",(this.state?88:91),10).play()
		this.state = !this.state
	})
})

new bttn2D({
	name:"maximize",
	txt:"",
	src:'./__SVG__/maximize.svg',
	img_scale:2,
	img_color:colors.font_medium,
	prnt:console_box,
	color:colors.glass_dark,
	font_color:colors.font_medium,
	txt_pvt:[0.5,0],
	strk:colors.font_medium,
	line:2,
	size:15,
	// blur:5,
	pvt:[1,1],
	txt_pos: new vec3D(0,2.5,0),
	rds:5,
	// h:50,
	w: 35,
	h: 35,
	rltv:false,
	pos: new vec3D(-10,-10,0),
	// onOvr:(()=>{}),
	onLoad:(function(){
		this.state = false
	}),
	onTch_U:(function(){
		// console.log(this.initial_values)
		const term = this.prnt.prnt
		const cons = this.prnt
		const card = term.prnt
		
		if(this.initial_values == undefined){
			this.initial_values = {
				card:{...card},
				term:{...term},
				cons:{...cons}
			}
			this.initial_values.card.pos = this.initial_values.card.pos.clone()
			this.initial_values.term.pos = this.initial_values.term.pos.clone()
			// console.log(this.initial_values.card.pos)
		}
		
		if(this.state == false){
			setFullScreen('mainArea')
			this.img.set('./__SVG__/minimize.svg')
			card.pvt = [0.5,0.5]
			card.pos.y = 0
			card._w = 100
			card._h = 100
			term.pvt = card.pvt
			term.pos.y = 0
			term.pos.x = card.pos.x
			term._w = 100//card._w
			term._h = 100//card._h
			term.set_cvs("h_cvs")
			cons.set_cvs("h_cvs")
			term.prnt.tab = 3
			// cons.pos.y = 90
			term.set_color(colors.font_dark)
			if(this.prnt.getSon("arrow-up").state == false) this.prnt.lerpTo("pos.y",(this.state?88:91),10).play()
		}else{
			this.img.set('./__SVG__/maximize.svg')
			// console.log(this.initial_values.card.pos)
			term.prnt.tab = 1
			card.pvt = this.initial_values.card.pvt
			card.pos.y = this.initial_values.card.pos.y
			card._w = this.initial_values.card._w
			card._h = this.initial_values.card._h
			term.pvt = this.initial_values.term.pvt
			term.pos.y = this.initial_values.term.pos.y
			term.pos.x = this.initial_values.term.pos.x
			term._w = this.initial_values.term._w
			term._h = this.initial_values.term._h
			term.set_cvs("m_cvs")
			cons.set_cvs("m_cvs")
			term.set_color(colors.glass_dark)
			if(this.prnt.getSon("arrow-up").state == false) this.prnt.lerpTo("pos.y",(this.state?88:91),10).play()
		}
		this.state = !this.state
	})
})

new bttn2D({
	name:"trash",
	txt:"",
	src:'./__SVG__/trash.svg',
	img_scale:2,
	img_color:colors.negative,
	prnt:console_box,
	color:colors.glass_dark,
	font_color:colors.negative,
	txt_pvt:[0.5,0],
	strk:colors.negative,
	line:2,
	size:15,
	// blur:5,
	pvt:[0,1],
	txt_pos: new vec3D(0,2.5,0),
	rds:5,
	// h:50,
	w: 35,
	h: 35,
	rltv:false,
	pos: new vec3D(10,-10,0),
	// onOvr:(()=>{}),
	onLoad:(function(){
		this.state = false
	}),
	onTch_U:(function(){
		var fileName = file_dropdown.lbl.txt
		if(fileName == "" || fileName == "..."){
			alert('ERROR', 'Enter a file name.',(()=>{
				file_dropdown.lbl.txt = ""
				file_dropdown.onTch_U()
				cursor.hit = file_dropdown
				file_dropdown.lerpTo("scale",1.1,7).lerpTo("scale",1,7).play()
			}),false);
			return
		}
		alert("DELETE","Erase <b>"+fileName+"</b>\nfrom storage?",(()=>{
			deleteVar("terminal_"+fileName);
			file_dropdown.list.sub(fileName)
			files = JSON.stringify(file_dropdown.list.items)
			saveVar("saved_files", files)
			file_dropdown.lbl.color = colors.font_medium
			file_dropdown.x_bot.vis = false
			file_dropdown.lbl.txt = "..."
			this.terminal_box.lbl.txt = ""
			this.terminal_box.console_box.lbl.color = colors.negative
			this.terminal_box.console_box.lbl.txt = "Script deleted!"
		}))
	}),
	onKey:(function(){
		if(getKey(["CONTROL","LEFTCOMMAND"],2) && getKey(["DEL","BACK"],1)) this.onTch_U()
	})
}).terminal_box = terminal_box

new bttn2D({
	name:"console_save",
	txt:"",
	src:'./__SVG__/save.svg',
	img_scale:2,
	img_color:colors.positive,
	prnt:console_box,
	color:colors.glass_dark,
	font_color:colors.positive,
	txt_pvt:[0.5,0],
	strk:colors.positive,
	line:2,
	size:15,
	// blur:5,
	pvt:[0,0],
	txt_pos: new vec3D(0,2.5,0),
	rds:5,
	// h:50,
	w: 35,
	h: 35,
	rltv:false,

	pos: new vec3D(10,10,0),
	// onOvr:(()=>{}),
	onLoad:(function(){
		this.state = false
	}),
	onTch_U:(function(){
		
		var fileName = file_dropdown.lbl.txt
		if(fileName == "" || fileName == "..."){
			// alert('ERROR', 'Enter a file name.',(()=>{
				file_dropdown.lbl.txt = ""
				file_dropdown.onTch_U()
				cursor.hit = file_dropdown
				file_dropdown.lerpTo("scale",1.1,7).lerpTo("scale",1,7).play()
			// }),false);
			return
		}
		// alert("SAVE FILE","Save <b>"+fileName+"</b> in cloud\nand in local storage?",(()=>{
			var code = this.terminal_box.lbl.txt
			
			var AES_TXT = Aes.Ctr.encrypt( code, keyCode, 256);
			saveVar("terminal_"+fileName, AES_TXT)
			
			files = JSON.stringify(file_dropdown.list.items)
			saveVar("saved_files", files)
			
			if(toType(files) == "string") files = JSON.parse(files)
			var g_files = files
			var uid = db_server.user.uid
			// Cloud Save
			var files_json = {}
			for(var f in g_files){
				var f_name = g_files[f]
				files_json[f_name] = loadVar("terminal_"+f_name)
			}
			db_server.save(`CWA/${uid}`,files_json)
		
			this.terminal_box.console_box.lbl.color = colors.positive
			this.terminal_box.console_box.lbl.txt = "Script saved!"
		// }))
	}),
	onKey:(function(){
		if(getKey(["CONTROL","LEFTCOMMAND"],2) && getKey("S",1)) this.onTch_U()
	})
}).terminal_box = terminal_box

new bttn2D({
	name:"console_run",
	txt:"",
	src:'./__SVG__/code.svg',
	img_scale:2,
	img_color:colors.active,
	prnt:console_box,
	color:colors.glass_dark,
	font_color:colors.active,
	txt_pvt:[0.5,0],
	strk:colors.active,
	line:2,
	size:15,
	// blur:5,
	pvt:[0.5,0],
	txt_pos: new vec3D(0,2.5,0),
	rds:5,
	// h:50,
	w: 35,
	h: 35,
	rltv:false,
	pos: new vec3D(0,10,0),
	// onOvr:(()=>{}),
	onLoad:(function(){
		this.state = false
	}),
	onTch_U:(function(){
		// terminal_box.log(getTime())
		// var geval = eval
		this.terminal_box.console_box.lbl.color = colors.font_medium
		// this.terminal_box.console_box.lbl.txt = "# CONSOLE #"
		this.terminal_box.exec()
	}),
	onKey:(function(){
		if(getKey(["CONTROL","LEFTCOMMAND"],2) && getKey("ENTER",1)) this.onTch_U()
	})
}).terminal_box = terminal_box

terminal_box.console_box = console_box

// new bttn2D({
// 	txt:"RUN CODE",
// 	prnt:card,
// 	color:colors.active,
// 	font_color:colors.font_dark,
// 	pos: new vec3D(0,33.5,0),
// 	// style:"bold",
// 	size:15,
// 	indx:1,
// 	rds:5,
// 	w:40,
// 	h:8,
// 	onTch_U:(function(){
// 		// terminal_box.log(getTime())
// 		// var geval = eval
// 		this.terminal_box.console_box.lbl.color = colors.font_medium
// 		// this.terminal_box.console_box.lbl.txt = "# CONSOLE #"
// 		this.terminal_box.exec()
// 	}),
// 	onKey:(function(){
// 		if(getKey(["CONTROL","LEFTCOMMAND"],2) && getKey("ENTER",1)) this.onTch_U()
// 	})
// }).terminal_box = terminal_box

// new bttn2D({
// 	src:'./__SVG__/save.svg',
// 	img_scale:2,
// 	img_color:colors.font_dark,
// 	prnt:card,
// 	color:colors.positive,
// 	font_color:colors.font_dark,
// 	pos: new vec3D(-5,33.5,0),
// 	// style:"bold",
// 	pvt:[1,0.5],
// 	size:15,
// 	indx:1,
// 	rds:5,
// 	w:20,
// 	h:8,
// 	// min_w:50,
// 	// max_w:100,
// 	onTch_U:(function(){
		
// 		var fileName = file_dropdown.lbl.txt
// 		if(fileName == "" || fileName == "..."){
// 			alert('ERROR', 'Enter a file name.',(()=>{
// 				file_dropdown.lbl.txt = ""
// 				file_dropdown.onTch_U()
// 				cursor.hit = file_dropdown
// 				file_dropdown.lerpTo("scale",1.1,7).lerpTo("scale",1,7).play()
// 			}),false);
// 			return
// 		}
// 		// alert("SAVE FILE","Save <b>"+fileName+"</b> in cloud\nand in local storage?",(()=>{
// 			var code = this.terminal_box.lbl.txt
			
// 			var AES_TXT = Aes.Ctr.encrypt( code, keyCode, 256);
// 			saveVar("terminal_"+fileName, AES_TXT)
			
// 			files = JSON.stringify(file_dropdown.list.items)
// 			saveVar("saved_files", files)
			
// 			if(toType(files) == "string") files = JSON.parse(files)
// 			var g_files = files
// 			var uid = db_server.user.uid
// 			// Cloud Save
// 			var files_json = {}
// 			for(var f in g_files){
// 				var f_name = g_files[f]
// 				files_json[f_name] = loadVar("terminal_"+f_name)
// 			}
// 			db_server.save(`CWA/${uid}`,files_json)
		
// 			this.terminal_box.console_box.lbl.color = colors.positive
// 			this.terminal_box.console_box.lbl.txt = "Script saved!"
// 		// }))
// 	}),
// 	onKey:(function(){
// 		if(getKey(["CONTROL","LEFTCOMMAND"],2) && getKey("S",1)) this.onTch_U()
// 	})
// }).terminal_box = terminal_box

// new bttn2D({
// 	src:'./__SVG__/trash.svg',
// 	img_scale:2,
// 	img_color:colors.font_dark,
// 	prnt:card,
// 	color:colors.negative,
// 	font_color:colors.font_dark,
// 	pos: new vec3D(5,33.5,0),
// 	// style:"bold",
// 	pvt:[0,0.5],
// 	size:15,
// 	indx:1,
// 	rds:5,
// 	w:20,
// 	h:8,
// 	onTch_U:(function(){
// 		var fileName = file_dropdown.lbl.txt
// 		if(fileName == "" || fileName == "..."){
// 			alert('ERROR', 'Enter a file name.',(()=>{
// 				file_dropdown.lbl.txt = ""
// 				file_dropdown.onTch_U()
// 				cursor.hit = file_dropdown
// 				file_dropdown.lerpTo("scale",1.1,7).lerpTo("scale",1,7).play()
// 			}),false);
// 			return
// 		}
// 		alert("DELETE","Erase <b>"+fileName+"</b>\nfrom storage?",(()=>{
// 			deleteVar("terminal_"+fileName);
// 			file_dropdown.list.sub(fileName)
// 			files = JSON.stringify(file_dropdown.list.items)
// 			saveVar("saved_files", files)
// 			file_dropdown.lbl.color = colors.font_medium
// 			file_dropdown.x_bot.vis = false
// 			file_dropdown.lbl.txt = "..."
// 			this.terminal_box.lbl.txt = ""
// 			this.terminal_box.console_box.lbl.color = colors.negative
// 			this.terminal_box.console_box.lbl.txt = "Script deleted!"
// 		}))
// 	}),
// 	onKey:(function(){
// 		if(getKey(["CONTROL","LEFTCOMMAND"],2) && getKey(["DEL","BACK"],1)) this.onTch_U()
// 	})
// }).terminal_box = terminal_box

new bttn2D({
	prnt:card,
	txt:"Terminal",
	size:18,
	color:colors.window,
	pos: new vec3D(0,2,0),
	font_color:colors.font_light,
	pvt:[0.5,0],
	size:18,
	rds:50,
	w:30,
	h:6,
	indx:1
})

var file_dropdown = new dropdown({
	prnt:card,
	indx:1,
	pos: new vec3D(0,-33,0),
	// item_h:5,
	// font_size:10,
	items:files,
	w:90,
	// max_h:55,
	onChange:(function(){
		terminal_box.console_box.lbl.color = colors.font_medium
		// terminal_box.console_box.lbl.txt = "# CONSOLE #"
		console.warn("Load file '"+this.lbl.txt+"'")
		terminal_box.lbl.txt = loadLocalCode(this.lbl.txt)
	})
})

new bttn2D({
	// cvs:"h_cvs",
	indx:2,
	size:18,
	color:colors.window,
	pos: new vec3D(0,2,0),
	font_color:colors.font_light,
	pvt:[0.5,0],
	size:18,
	rds:50,
	w:30,
	h:6,
	txt:"Collection",
	prnt: card
})


const random_color = (()=>{
	let r,g,b
	r = (Math.random()*0.333)+0.5
	g = (Math.random()*0.333)+0.5
	b = (Math.random()*0.333)+0.5
	return new color(r,g,b,1)
})
const cell_edit = {color:colors.window,line:1,strk:colors.glass_blue}

// new matrixview({
// 	h:70,
// 	w:90,
// 	prnt:card,
// 	pvt:[0.5,0],
// 	pos:new vec3D(0,15,0),
// 	rds:7,
// 	indx:2,
// 	init: (prnt=>[
// 			[new bttn2D({...cell_edit,
// 					prnt,
// 					onTch_DC:(function(){
// 						var newCell = new matrixview({
// 							prnt,
// 							init: prnt.init
// 						})
// 						let crsr = this.pio(cursor.pos)
// 						if(crsr.x>crsr.y){
// 							prnt.items[0].push(newCell)
// 						}else{
// 							// console.log(arr.join()); // Jani,Hege,Stale,Kai Jim,Borge
// 							prnt.items.splice(1, 0, [newCell]);
// 							// console.log(arr.join());
// 							// prnt.items.push([newCell])
// 						}
// 						prnt.addChild(newCell)
// 						prnt.onDrag_U()
// 					})
// 				}),
// 			]
// 		]
// 	)
// })

onDrop = (files) =>{
	console.log(files)
	user_files = files
	var app_stg = new stg2D({
		color:colors.alpha,
		w:stg_w,
		h:stg_h
	})

	new bttn2D({
		prnt:app_stg,
		blur:5,
		indx:[0,1],
		color:colors.glass_dark,
		onTch_U:(function(){
			//this.prnt.del()
		}),
		onOvr:(()=>{})
	})
	var data = "ID;Name;Size;Date"
	for(let i = 0; i < files.length; i++ ){
		const file = files[i]
		// for(let k in file){
		// 	console.log(k, file[k])
		// }
		var date = new Date(file.lastModified);
		// console.log(date.getTime())
		// console.log(date)
		data +=`\n${i};${file.name};${file.size};${date.toLocaleDateString()}`
	}
	new matrixview({
		prnt:app_stg,
		w:90,
		h:50,
		rds:10,
		indx:0,
		// data:files,
		items:data.split('\n').map(i=>i.split(';'))
	})

	new bttn2D({
		txt:'Upload Files',
		font_color:colors.font_dark,
		size:22,
		prnt:app_stg,
		color:colors.active,
		indx:0,
		pvt:[0.5,1],
		pos:new vec3D(0,-5,0),
		h:10,
		w:50,
		rds:10,
		onTch_U:(function(){
			db_server.upload(`${db_server.user.uid}/files`,user_files,((url)=>{
				console.warn(url)
				this.prnt.del()
			}),((progress, teste)=>{
				console.log(teste)
				console.warn('Upload is ' + progress + '% done')
			}))
			this.prnt.tab = 1
		})
	})

	// new pln2D({prnt:app_stg})
}



// openButton.dataField = new inputfield({
// 	prnt:app_stg,
// 	color:colors.window,
// 	indx:0,
// 	h:50,
// 	w:50,
// 	rds:10
// })






// async function getData() {
//	 const carsDataResponse = await fetch('https://storage.googleapis.com/tfjs-tutorials/carsData.json');
//	 const carsData = await carsDataResponse.json();
//	 const cleaned = carsData.map(car => ({
//		 mpg: car.Miles_per_Gallon,
//		 horsepower: car.Horsepower,
//	 }))
//	 .filter(car => (car.mpg != null && car.horsepower != null));

//	 return cleaned;
// }
// const data = await getData();
// const values = data.map(d => ({
//	 x: d.horsepower,
//	 y: d.mpg,
// }));

// tfvis.render.scatterplot(
//	 {name: 'Horsepower v MPG'},
//	 {values},
//	 {
//		 xLabel: 'Horsepower',
//		 yLabel: 'MPG',
//		 height: 300
//	 }
// );

// new database({key:'_id'}).then((e)=>{
// 	local_db_id = e
	
// 	// local_db_id.tb.get("athena").then((data)=>{
// 	// 	// console.log(data)
// 	// 	var athena_ui = new athena({
// 	// 		h:70,
// 	// 		w:90,
// 	// 		prnt:card,
// 	// 		pvt:[0.5,0.5],
// 	// 		rds:7,
// 	// 		indx:2,
// 	// 		link_cells:false
// 	// 	})
// 	// 	if(data) athena_ui.dictionary = data
// 	// })		
// })



// const dataString_1 = `Cabecalho;;;;;;;Itens;;;;;;;;;;;;
// ID;Empresa;Data Dcto;Referencia;Texto Cabecalho;Moeda;Taxa Cambio;ID Item;Chave Lancto;Conta Contabil;Atribuicao;Texto Item;Montante;Centro Custo;Cento Lucro;Grp. Ledger;Fornecedor;Cliente;Cod Imposto;DomFiscal
// 1;1000;21062021;LME HD 465787;HD 465787;BRL;1;1;50;1010102007;HD 465787;teste;3246;;GNA_PRD;;;;;
// ;;;;;;;2;40;1010101008;HD 465787;teste;3246;;SAO_HQ_ADM;;;;;
// ;;;;;;;3;40;1010101008;HD 465787;teste;3246;;SAO_HQ_ADM;;;;;
// ;;;;;;;4;40;1010101008;HD 465787;teste;3246;;SAO_HQ_ADM;;;;;`

// new matrixview({
// 	h:30,
// 	w:90,
// 	// blur:5,
// 	prnt:card,
// 	pvt:[0.5,0],
// 	pos:new vec3D(0,10,0),
// 	rds:7,
// 	indx:2,
// 	items:dataString_1.split('\n').map(e=>e.split(';')),
// 	// link_cells:false
// })

// const dataString_2 = `Cabecalho;;;;;;;Itens;;;;;;;;;;;;
// ID;Empresa;Data Dcto;Referencia;Texto Cabecalho;Moeda;Taxa Cambio;ID Item;Chave Lancto;Conta Contabil;Atribuicao;Texto Item;Montante;Centro Custo;Cento Lucro;Grp. Ledger;Fornecedor;Cliente;Cod Imposto;DomFiscal
// 1;1000;21062021;PR HD 123456;Rev. Jul/2021;BRL;1;1;40;4020199042;Rev. Jul/2021;Prov. Agua e Esgoto 06/2021 Excel;3000;1400.288;;;;;;
// ;;;;;;;2;50;2010799001;Rev. Jul/2021;Prov. Agua e Esgoto 06/2021 Excel;3000;;CAM_ADM;;;;;
// ;;;;;;;2;50;2010799001;Rev. Jul/2021;Prov. Agua e Esgoto 06/2021 Excel;3000;;CAM_ADM;;;;;`

// new matrixview({
// 	h:30,
// 	w:90,
// 	// blur:5,
// 	prnt:card,
// 	pvt:[0.5,1],
// 	pos:new vec3D(0,-20,0),
// 	rds:7,
// 	indx:2,
// 	items:dataString_2.split('\n').map(e=>e.split(';')),
// 	// link_cells:false
// })

// new inputfield({
// 	prnt:card,
// 	pos: new vec3D(0,0,0),
// 	pvt:[0.5,0],
// 	indx:2,
// 	h:8,
// 	w:90,
// 	rds:5,
// })
// new bttn2D({
// 	txt:"Set item",
// 	font_color:colors.font_dark,
// 	prnt: card,
// 	indx:2,
// 	pos: new vec3D(-30,30,0),
// 	w:29,
// 	h:5,
// 	rds:5,
// 	onTch_U:(function(){
// 		// local_db_id.tb.set("test.child.w",{test:"agora é uma string"}).then((data)=>{console.log(data)})
// 		local_db_id.tb.set("z.data.test.vec.x",100)
// 		// local_db_id = new database({key:'id'})
// 		// local_db_id = new database({
// 		// 	name:"youngSheldon",
// 		// 	tables:[{
// 		// 		key:'id',
// 		// 		name:"characters",
// 		// 		index:['name','age']
// 		// 	}]
// 		// })
// 	})
// })

// new bttn2D({
// 	txt:"Add Data",
// 	font_color:colors.font_light,
// 	color:colors.window,
// 	prnt: card,
// 	indx:2,
// 	pvt:[0.5,1],
// 	pos: new vec3D(0,-12,0),
// 	w:29,	
// 	h:5,
// 	rds:5,
// 	onTch_U:(function(){
// 		local_db_id.tb.add([
// 			{id:1,name:'Sheldon',age:11,vec:{x:0,y:1,z:2}},
// 			{id:2,name:'Missy',age:11,vec:{x:0,y:1,z:2}},
// 			{id:3,name:'Marge',age:34,vec:{x:0,y:1,z:2}},
// 			{id:4,name:'George',age:'47',vec:{x:0,y:1,z:2}}])
// 		.then((data)=>{
// 			console.log(data)
// 		})
// 	})
// })

// new bttn2D({
// 	txt:"Get Data",
// 	font_color:colors.font_dark,
// 	prnt: card,
// 	indx:2,
// 	pos: new vec3D(30,30,0),
// 	w:29,
// 	h:5,
// 	rds:5,
// 	onTch_U:(function(){
// 		local_db.tb.all().then((data)=>{console.log(data)})
// 	})
// })

// new bttn2D({
// 	txt:"Delete Data",
// 	font_color:colors.font_dark,
// 	prnt: card,
// 	indx:2,
// 	pos: new vec3D(0,37,0),
// 	w:29,
// 	h:5,
// 	rds:5,
// 	onTch_U:(function(){
// 		local_db.tb.del(14)
// 		.then((data)=>{
// 			console.log(data)
// 		})
// 	})
// })


var barMenu = new pln2D({
	// cvs:"h_cvs",
	// pos: new vec3D(0,1,0),
	color:colors.alpha,
	// blur:5,
	// line:10,
	indx:[0,1,2],
	w: 90,
	h: 8,
	pvt:[0.5,1],
	rds:[5,5,0,0],
	// strk:color("red"),
	prnt: card
})

new bttn2D({
	// cvs:"h_cvs",
	prnt: barMenu,
	// txt:"Layer <b>1</b>",
	src:'./__SVG__/home.svg',
	img_scale:0.5,
	img_color:colors.font_light,
	// size:20,
	// font_color:colors.font_light,
	color:colors.window,
	rds:[5,0,0,0],
	pvt:[0,0],
	w:33.333,
	h:100,
	onTch_U:(function(){
		if(this.prnt.prnt.tab == 0) return;
		getLastValue(this.prnt.chld).lerpTo("pvt.0",0,6).play()
		this.prnt.prnt.tab = 0
	})
})
new bttn2D({
	// cvs:"h_cvs",
	prnt: barMenu,
	src:'./__SVG__/terminal.svg',
	img_scale:0.5,
	img_color:colors.font_light,
	// txt:"Layer <b>2</b>",
	// size:20,
	// font_color:colors.font_light,
	color:colors.window,
	pvt:[0.5,0],
	w:33.333,
	h:100,
	onTch_U:(function(){
		if(this.prnt.prnt.tab == 1) return;
		getLastValue(this.prnt.chld).lerpTo("pvt.0",0.5,6).play()
		this.prnt.prnt.tab = 1
	})
})

new bttn2D({
	// cvs:"h_cvs",
	prnt: barMenu,
	src:'./__SVG__/image.svg',
	img_scale:0.5,
	img_color:colors.font_light,
	// txt:"Layer <b>3</b>",
	// size:20,
	// font_color:colors.font_light,
	color:colors.window,
	rds:[0,5,0,0],
	pvt:[1,0],
	w:33.333,
	h:100,
	onTch_U:(function(){
		if(this.prnt.prnt.tab == 2) return;
		getLastValue(this.prnt.chld).lerpTo("pvt.0",1,6).play()
		this.prnt.prnt.tab = 2
	})
})

new pln2D({
	name:"actv_bar",
	// cvs:"h_cvs",
	prnt: barMenu,
	color:colors.active,
	pvt:[0,1],
	// pvt:[(i%3)/2,1],
	w:33.333,
	h:10
})

new main_menu({
	prnt:h_stg
})
var user_stg = null

db_server = new server({
	config:server_info,
	onUser:(function(user){
		user_stg = new pln2D({
			prnt:login_bot.prnt,
			color:colors.alpha
		})
		login_bot.del()
		login_bot = null
		new matrixview({
			h:8,
			w:60,
			prnt:card,
			pvt:[0.5,0],
			pos:new vec3D(0,1,0),
			rds:50,
			init: ((prnt)=>[
					[
						new bttn2D({
							prnt,
							w:70,
							size:18,
							txt:user.displayName,//.split(' ')[0],
							color:colors.window,
							onOvr:(()=>{})
						}),
						new img2D({
							// ...cell_edit,
							src:user.photoURL,
							pvt:[0.5,1],
							w:30,
							// rltv:false,
							prnt}),
					]
				]
			)
		})
		
		if(db_server){
			// new img2D({
			// 	pos: new vec3D(0,80,0),
			// 	pvt:[0.5,0],
			// 	src:user.photoURL,
			// 	w: 200,
			// 	h: 200,
			// 	rds:100,
			// 	rltv:false,
			// 	prnt: user_stg
			// })
			if(get_geo){
				///* Client Geo API *///
				fetch('http://www.geoplugin.net/json.gp') // free: http://ip.jsontest.com/
				.then(response => response.json())
				.then(data => {
					user_geo = {}
					// console.log(user_geo)
					console.log(Object.keys(data).map((k)=>{
						return(["geoplugin_request","geoplugin_countryName","geoplugin_regionName","geoplugin_city","geoplugin_latitude","geoplugin_longitude"].includes(k)?data[k]:false)
					}).filter((val)=>{return(val!=false)}))
					db_server.save(`CWA/user/${user.uid}`,user_geo)
				});
			}

			var data_str = "ID;Name;Action"
			

			db_server.download(`${user.uid}/files`)
			.then((data)=>{
				// var items = Object.keys(data.items)
				for (var i = 0; i < data.items.length; i++) {
					console.log(data.items[i].name)
					data_str +=`\n${i};${data.items[i].name};${data.items[i]}`
				}
				// data.items.forEach((itemRef) => {
				// 	console.log(itemRef)
				// 	data +=`\n${itemRef};${itemRef.name}`
				// });
				new matrixview({
					prnt:card,
					w:90,
					h:50,
					rds:10,
					indx:2,
					// data:files,
					items:data_str.split('\n').map(i=>i.split(';')),
					onTch_U:(function(){
						db_server.store.refFromURL(this.lbl.txt).getDownloadURL().then((url)=>{
							console.log(url)
							var xhr = new XMLHttpRequest();
					    xhr.responseType = 'blob';
					    xhr.onload = (event) => {
					      var blob = xhr.response;
					    };
					    xhr.open('GET', url);
					    xhr.send();

					    // Or inserted into an <img> element
					    // var img = document.getElementById('myimg');
					    // img.setAttribute('src', url);
						})
						console.log(this.lbl.txt)
					})
				})
			})
			db_server.load(`CWA/${user.uid}`)
			.then((data)=>{
				if(!data) return false
				var files_array = []
				for(var k in data){
					saveVar("terminal_"+k, data[k])
					files_array.push(k)
					if(!file_dropdown.list.items.includes(k)){
						file_dropdown.list.add(k)
					}
					// if(!script_list.items.includes(k)){
					// 	script_list.add(k)
					// }
				}
				files = JSON.stringify(files_array)
				saveVar("saved_files", files)
			})
		}
	})
})

window.addEventListener( 'resize', onWindowResize, false );
window.addEventListener('orientationchange', onWindowResize, false);

onWindowResize()

if(render) render()