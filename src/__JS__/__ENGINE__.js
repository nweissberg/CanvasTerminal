import { lerp } from './__MATH__.js';
import {crsr2D} from './__CURSOR__.js';
cursor = new crsr2D()


// (async () => {
var updt_times = 3
var last_count = 0
var buff_up = true

async function animate() {
	
	time = Date.now();

	cursor.updt()
	var flag_auto = false
	if(update > 0 || cursor.scrllDlt > 1){
		// console.log(time)ss
		if(render_count!=last_count){
			last_count = render_count
			buffer_map = new Map()
			buff_up = true
			// console.log(`${last_count}/${MOM.size}`)
		}
		render_count = 0
		cursor.scrllDlt = lerp(cursor.scrllDlt, 0, 0.33)
		MCM.forEach( (c) => {c.clear()} )
		MOM.forEach( (o) => {
			if(o.drew && (o.buffer || isMobile) ){
				render_count++
				if(buff_up){
					buffer_map.set(o.name, o)	
				}else{
					if(buffer_map.get(o.name)==undefined) buffer_map.set(o.name, o)
				}
			}
			try{
				if(o.vis == true){
					o.updt?.()
					o.drw?.();
					o.drw3D?.();
					if(o.prnt && o.indx == o.prnt.tab){
						if(o.auto == true) flag_auto = true
						o.loop?.()
					}
					if(!o.prnt) o.anim?.()
				}	
			}catch(e){console.error(e)}

		} )
		buff_up = false
	}
	if(flag_auto) update = updt_times
	update -= 1
	lstT = time

	requestAnimationFrame( animate );
}

export function render(){
	
	update = updt_times
	// animate()
	// requestAnimationFrame( animate );
	// console.time("render")
	// console.log("render " + time)
	// time = Date.now();
	// if(time - lstT > rIntvl){
	// 	// console.log(time)
	// 	// cursor.updt()
	// 	MCM.forEach( (c) => {c.clear()} )
	// 	MOM.forEach( (o) => {
	// 		if(!o.auto){
	// 			if(o.updt) o.updt()
	// 			if(o.drw) o.drw();	
	// 		} 
	// 	} )
	// 	lstT = time
	// }
	// console.timeEnd("render")
}
worker = new Worker("./__JS__/__2D__/__WORKER__.js");

worker.postMessage = worker.webkitPostMessage || worker.postMessage;

worker.onmessage = function(e) {
	// console.log(e.data.img)
	switch(e.data.command){
		case 'reply':
			console.log(e.data.reply)
			break;
		default:
			console.log(e.data)
			break;
	}
	// var obj = MOM.get(e.data.obj)
	// if(obj) obj.bg = e.data.img
}

animate()

document.getElementById("progressBar").style.display = "none"
var logo = document.getElementById('EngineLogo')
logo.style.opacity = "0"

// render = render()
// MOM.forEach( (o) => {
// 	if(o.updt)o.updt()
// 		o.drw()
// } )

// animate()

// console.log(MCM.get("m_cvs"))
// console.log(MCM.values().next().value)