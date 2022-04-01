import { vec3D, lerp } from './__MATH__.js';
import { rRcrsv } from './__2D__/__OBJECTS__.js';
import { render } from './__ENGINE__.js';
import { Raycaster, Vector2 } from './__3D__/three.module.js';
import { color } from './__COLOR__.js';
import { getKey, getKeyListen } from './__KEYBOARD__.js';
import { colors } from './__PALETTE__.js';
// import { bttn2D } from './__2D__/__BUTTON__.js';
// import { listview } from './__2D__/__WIDGETS__/listview.js';
var time_interval = 33
var contextmenu = false
export class crsr2D{
	constructor( attr = {} ) {
		this.attr 	= attr
		this.pos 	= ( this.attr["pos"] ) 	? (( this.attr["pos"].clone ) ? this.attr["pos"].clone() : vec3D(this.attr["pos"].x,this.attr["pos"].y,this.attr["pos"].z) ) : new vec3D(0,0,0);
		this.pos3d 	= ( this.attr["pos3d"] ) 	? (( this.attr["pos3d"].clone ) ? this.attr["pos3d"].clone() : vec3D(this.attr["pos3d"].x,this.attr["pos3d"].y,this.attr["pos3d"].z) ) : new vec3D(0,0,0);
		this._x 	= ( this.attr["x"] ) ? this.attr["x"] : this.pos.x;
		this._y 	= ( this.attr["y"] ) ? this.attr["y"] : this.pos.y;
		this.spd_x 	= ( this.attr["spd_x"] ) ? this.attr["spd_x"] : 0.0;
		this.spd_y 	= ( this.attr["spd_y"] ) ? this.attr["spd_y"] : 0.0;
		this.hit 	= ( this.attr["hit"] ) ? this.attr["hit"] : null;
		this.hit 	= ( this.attr["hit"] ) ? this.attr["hit"] : null;
		this.drag 	= ( this.attr["drag"] ) ? this.attr["drag"] : false;
		this.scrll 	= ( this.attr["scrll"] ) ? this.attr["scrll"] : new vec3D();
		this.scrllLck 	= ( this.attr["scrllLck"] ) ? this.attr["scrllLck"] : false;
		this.scrllDlt 	= ( this.attr["scrllDlt"] ) ? this.attr["scrllDlt"] : false;
		this.active = null
		this.start = new vec3D(0,0,0)
		this.state = 0
		this.lst_state = 0
		this.action = ""
		this.d_clck = 0
		this.lst_clck = Date.now()
		this.raycaster = new Raycaster();
		this.alt_hit = null
		this.lst_move = this.lst_clck
		this.lst_clck_up = this.lst_clck
		this.lst_action = this.lst_clck
		this.tool = null
		// this.lst_scrll = this.lst_clck

		this.vars = new Proxy(this, {
			set: function (target, key, value) {
				target[key] = value;
			}
		});
	}
	rst(){
		// this.pos 	= new vec3D(0,0,0);
		// this.pos3d 	= this.pos.clone()
		this._x 	= this.pos.x;
		this._y 	= this.pos.y;
		this.spd_x 	= 0.0;
		this.spd_y 	= 0.0;
		this.hit 	= null;
		this.scrll 	= new vec3D();
		this.state = 0
		// this.d_clck = 0
		this.lst_clck = Date.now()
		this.start = new vec3D(0,0,0)
		this.drag = false
		if(this.last_hit?.onOut) this.last_hit.onOut()
		this.last_hit = null
		// console.log("cursor reset")
	}
	rltv_pos(obj){
		return new vec3D(
			((this._x - obj._x)/obj._w),//-(obj.pvt[0]), 
			((this._y - obj._y)/obj._h),//-(obj.pvt[1]),
			0
		)
	}
	pip( o, p=this){
		if(	o.area &&
		o.area[0] 			< p._x &&
		o.a_clp[0] 			< p._x &&
		o.area[0]+o.area[2] > p._x &&
		o.a_clp[0]+o.a_clp[2] > p._x &&
		o.area[1] 			< p._y &&
		o.a_clp[1] 			< p._y &&
		o.area[1]+o.area[3] > p._y &&
		o.a_clp[1]+o.a_clp[3] > p._y){
			return true;
		}
		return false;
	}
	updt(){
		// if(Math.abs(this.scrllDlt) < 2 && this.state == 0){
		// 	this.scrllDlt = 0
		// 	this.hit = null
		// }

		if(cursor.d_clck > 1){
			// console.log(cursor.hit?.name)
			// if(cursor.hit?.onTch_DC){
			cursor.hit?.onTch_DC?.()
			// }
			cursor.d_clck = 0
		}
		if(time - cursor.lst_clck > 120) cursor.d_clck = 0
		// if(this.state == 3) this.state = 0
		// console.log(cursor.scrllDlt)
		if(cursor.scrllDlt<2) cursor.scrllDlt = 0 
		if(Date.now() - this.lst_action < time_interval ) return

		if(this.lst_state == 2 && this.state == 0){
			this.action = "UP"
		}
		if(this.state == 2 && this.lst_state == 2){
			this.action = "HOLD"
		}
		if(this.state == 2 && this.lst_state == 0){
			this.action = "DOWN"
					}
		if(this.state == 0 && this.lst_state == 0){
			this.action = ""
		}
		this.lst_state = this.state

		this.lst_action = Date.now()
		// console.log(this.action)
	}
	getOver(attr){
		// console.log(attr)
		buffer_map.forEach( (o) => {
			if(o.hide == true || o.prnt?.hide == true || o.vis == false) {
				// cursor.hit = cursor.last_hit
				cursor.over = cursor.last_hit
				return;
			}

			if(	o[attr] && cursor.pip( o )){
				if(o.prnt?.[attr] && o.prnt.scrll_lock)return
				cursor.over = o
			}

			if(	o[attr] && cursor.pip( o )){
				if(o.prnt?.[attr] && o.prnt.scrll_lock)return
				cursor.hit = o
			}
		} )
	}
}

//o.onTch_C || o.onTch_M || o.onTch_D || o.onTch_U || o.onTch_DC || o.onScrll

function onContextMenu( event ) {
	// updateRender = true
	// cursor.contextMenu = true
	// console.log(event)
	event.preventDefault();
	event.stopPropagation();
	if(!cursor.hit) return
	contextmenu = true
	// console.log(`contextmenu = ${contextmenu}`)
	// if(isMobile){
	// 	alert(cursor.hit?.name)
	// 	if(event.button == 0){
	// 		event.stopPropagation();
	// 		mseDwn(event)	
	// 	}
		
	// 	return
	// }
	// cursor.rst()
	// render?.()
	// cursor.hit.stroke
	if(cursor.alt_hit == null){
		// var o = cursor.hit
		cursor.alt_hit = cursor.hit
		if(cursor.tool!=null){
			cursor.tool.del()
			cursor.tool = null
		}
		// console.log(MCM.get("h_cvs"))
		// o.cvs = MCM.get("h_cvs")
		// o.ctx = cursor.hit.cvs.ctx

		// if(o.chld.size > 0){
		// 	o.chld.forEach( (c) => {
		// 		rRcrsv(c, (()=>{
		// 			c.ctx = o.ctx
		// 		}))
		// 	} )
		// }

		import('./__2D__/__BUTTON__.js').then(__BUTTON__ =>{
			var alt_bg = new __BUTTON__.bttn2D({
				// blur:11,
				w:stg_w,
				h:stg_h,
				color:color(0.2,0.2,0.2,0.5),
				onOvr:(()=>{}),
				onTch_D:(()=>{}),
				onTch_U:(function(){
					this.del()
					cursor.alt_hit = null
				}),
				onDrag:(()=>{cursor.rst()}),
				onScrll:(()=>{cursor.rst()}),
				onLoad:(()=>{cursor.rst()}),
				onKey:(function(){
					if(getKey("ESC",1)){
						this.del()
						cursor.alt_hit = null
					}
				})
			})
			import('./__2D__/__WIDGETS__/listview.js').then(module =>{
				var x = (cursor._x/stg_w)*100
				var y = (cursor._y/stg_h)*100

				if(x+(200/stg_w)*100 > 100) x = ((cursor._x-200)/stg_w)*100
				if(y+(300/stg_h)*100 > 100) y = ((cursor._y-300)/stg_h)*100

				new module.listview({
					prnt:alt_bg,
					// indx:1,
					pos: new vec3D(x,y,0),
					pvt:[0,0],
					w:200,
					h:300,
					rds:5,
					blur:5,
					rltv:false,
					items:["Name","Parent","Copy", "Edit", "Delete"],
					onLoad:(function(){
						getKeyListen()
					}),
					actions:[
						(function(){
							this.lbl.txt = cursor.alt_hit?.name
							
						}),
						(function(){
							let obj = cursor.alt_hit
							

							cursor.tool = new __BUTTON__.bttn2D({
								indx:[0,1,2,3,4],
								color:colors.active.clone(),
								strk:colors.active,
								line:2,
								prnt:obj.prnt,
								onLoad:(function(){
									cursor.alt_hit = null
									this.lerpTo('color.a',0.2,10).play()
								}),
								onTch_U:(function(){
									this.del()
								})
							})
							obj.prnt.addChild(cursor.tool)
							// cursor.alt_hit = null
							this.prnt.prnt.del()
						}),
						(function(){
							var text = "MOM.get('"+cursor.alt_hit?.name+"')"
							if(!isMobile){
								navigator.clipboard.writeText(text).then(function() {
									// console.log("Copied = "+text);
								}, function(err) {
									// console.error('Could not copy text: ', err);
								});
							}
							
							cursor.alt_hit = null
							this.prnt.prnt.del()
						}),
						(function(){
							let obj = cursor.alt_hit
							if(!obj) return
							obj.addChild(
								new __BUTTON__.bttn2D({
									indx:[0,1,2,3,4],
									color:colors.active.clone(),
									strk:colors.active,
									line:2,
									prnt:obj,
									onLoad:(function(){
										this.obj = cursor.alt_hit
										cursor.active = cursor.alt_hit
										cursor.alt_hit = null
										this.lerpTo('color.a',0.2,10).play()
									}),
									onTch_U:(function(){
										cursor.active = null
										this.del()
									}),
									onDrag:(function(){
										if(!cursor.active){
											this.del()
											return
										}
										this.obj._h += cursor.spd_y/4
										this.obj._w += cursor.spd_x/4
										this.obj.prnt.onDrag_U?.()
									}),
									onDrag_U:(function(){
										// this.del()
									})
								})
								)

							cursor.alt_hit = null
							this.prnt.prnt.del()
						}),
						(function(){
							// console.log(cursor.alt_hit)
							cursor.alt_hit?.del()
							cursor.alt_hit = null
							this.prnt.prnt.del()
						})
					]
				})

			})
		})
	}
	
	// console.log(cursor.hit?.name)

}

function mseMve( event ) {
	event.preventDefault();
	event.stopPropagation();

	if(Date.now() - cursor.lst_move < time_interval ) return
	if(cursor.state == 1){
		cursor.state = 2
	}
	if(event.touches){
		cursor._x = event.touches[0].pageX
		cursor._y = event.touches[0].pageY
	}else{
		cursor._x = event.pageX
		cursor._y = event.pageY
	}
	
	if(!cursor.hit) cursor.getOver("onOvr")

	if(cursor.state == 2){
		cursor.spd_x = (cursor._x - cursor.pos.x)
		cursor.spd_y = (cursor._y - cursor.pos.y)

		if(cursor.start.distanceTo(cursor.pos) >= 10 || cursor.hit?.drag == true){
			cursor.drag = true
			cursor.hit?.onDrag?.()
		}
	}

	if(cursor.last_hit && cursor.last_hit != cursor.hit){
		// cursor.scrllDlt = 0
		// document.body.style.cursor = "default"
		cursor.last_hit.onOut?.()
		cursor.last_hit = null
		// render?.()
	}
	if(cursor.hit?.onOvr){
		// document.body.style.cursor = "pointer"
		cursor.hit.onOvr()
		cursor.last_hit = cursor.hit
		// render?.()
	}
	// console.log(cursor.raycaster)
	
	// if(cursor.hit && cursor.drg && cursor.state == 2){
	// 	cursor.hit.pos.x += cursor.spd_x
	// 	cursor.hit.pos.y += cursor.spd_y
	// 	// render?.()
	// }

	// if(cursor.hit?.onTch_M){
	if(!cursor.hit) cursor.getOver("onTch_M")
	cursor.hit?.onTch_M?.(cursor.spd_x,cursor.spd_y)
		// render?.()
	// }
	// cursor.touches[0].relative.x = ( event.pageX / window.innerWidth ) * 2 - 1;
	// cursor.touches[0].relative.y = - ( event.pageY / window.innerHeight ) * 2 + 1;
	// cursor.touches[0].position.x = event.pageX;
	// cursor.touches[0].position.y = event.pageY;
	// log("Mouse Move")
	cursor.pos.x = cursor._x
	cursor.pos.y = cursor._y
	render?.()
	if(cursor.state != 2) cursor.hit = null
	cursor.lst_move = Date.now()
	// cursor.updt()
}

function mseDwn( event ) {
	// setFullScreen = true
	// cursor.hit = null

	event.preventDefault();
	event.stopPropagation();
	// if(event.button != 0) return
	// console.log(`contextmenu = ${contextmenu}`)
	
	// contextmenu = false	
	if(Date.now() - cursor.lst_clck < time_interval ) return
	cursor.scrllDlt = 0
	cursor.state = 1
	if(event.touches){
		cursor.pos.x = event.touches[0].pageX
		cursor.pos.y = event.touches[0].pageY
	}else{
		cursor.pos.x = event.pageX
		cursor.pos.y = event.pageY	
	}
	cursor._x = cursor.pos.x
	cursor._y = cursor.pos.y

	cursor.start.x = cursor._x
	cursor.start.y = cursor._y

	// cursor.touchCount = 1
	// if(cursor.touches[0].state == 0 && cursor.touches[0].start != null){
	// 	cursor.touches[0].state = 1;
	// 	cursor.touches[0].start.x = event.pageX
	// 	cursor.touches[0].start.y = event.pageY
	// }
	// console.log("Mouse Down", cursor.pos)
	if(cursor.hit && cursor.active && cursor.hit != cursor.active && cursor.hit.active == true){
		cursor.active.onTch_Out()
		// cursor.active = null
	}

	if(!cursor.hit) cursor.getOver("onTch_U")
	
	// console.log(cursor.hit)
	cursor.d_clck += 1

	if(!event.button || event.button == 0) cursor.hit?.onTch_D?.()


	cursor.lst_clck = Date.now()
	// if(cursor.hit) cursor.hit.vars.color = "grey"

	cursor.onTch_D?.()
	mseMve(event)
}

function mseUp( event ) {
	event.preventDefault();
	event.stopPropagation();
	if(Date.now() - cursor.lst_clck_up < time_interval ) return
	rcrsv_cont = 0 
	cursor.state = 3
	if(event.changedTouches){
		
		cursor.pos.x = event.changedTouches[0].pageX
		cursor.pos.y = event.changedTouches[0].pageY
	}else{
		cursor.pos.x = event.pageX
		cursor.pos.y = event.pageY	
	}
	cursor._x = cursor.pos.x
	cursor._y = cursor.pos.y

	if(cursor.drag){
		cursor.hit?.onDrag_U?.()
	}

	if((cursor.start.distanceTo(cursor.pos) <= 50 && cursor.drag == false) || cursor.hit?.drag == true ){
		if((!event.button || event.button == 0) && contextmenu == false) cursor.hit?.onTch_U?.()
		if(cursor.active != cursor.hit) cursor.active?.onTch_Out?.()
	}

	

	if(contextmenu == true){
		// alert("Função Alternativa Botão "+ cursor.hit.lbl.plain_txt)
		contextmenu = false
	}
	// cursor.hit = null
	// if(cursor.touches[0].state == 2){
	// 	cursor.touches[0].state = 3
	// }
	// log("Mouse Up")
	cursor.onTch_U?.()
	cursor.rst()
	cursor.lst_clck_up = Date.now()
	render?.()
}

export function mseWhl( event ) {
	// console.log(event)
	event.preventDefault()
	event.stopPropagation()
	event.stopImmediatePropagation();
	if(Date.now() - cursor.lst_scrll < time_interval ) return

	cursor.getOver("onScrll")
	// console.log(cursor.hit)

	if (event.ctrlKey) {
		event.preventDefault()
		// log("zoom")
		// cursor.scrllDlt = 0
		if(cursor.scrllLck == false){
			cursor.scrll.z = event.wheelDelta
		}
	}else{
		if(cursor.scrllLck == false){
			cursor.scrllDlt = lerp(cursor.scrllDlt,event.wheelDelta,0.3)
			// cursor.scrllDlt = event.wheelDelta;
			cursor.scrll.x  = event.wheelDeltaX
			cursor.scrll.y = event.wheelDeltaY
		}
	}
	
	// if(event.touches){
	// 	cursor.pos.x = event.touches[0].pageX
	// 	cursor.pos.y = event.touches[0].pageY
	// }else{
	// 	cursor.pos.x = event.pageX
	// 	cursor.pos.y = event.pageY	
	// }
	// if(cursor.hit && stage3D && cursor.raycaster){
	// 	var pointer = new Vector2(cursor._x,cursor._y,0)
	// 	pointer.x = ( cursor._x / window.innerWidth ) * 2 - 1;
	// 	pointer.y = - ( cursor._y / window.innerHeight ) * 2 + 1;
	// 	cursor.raycaster.setFromCamera( pointer, stage3D.camera );
	// 	if(cursor.hit.scene){
	// 		const intersects = cursor.raycaster.intersectObjects( cursor.hit.scene.children, true );
	// 		if ( intersects.length > 0 ) {
	// 			// console.log(intersects[0].point)
	// 			cursor.pos3d = intersects[0].point
	// 			// helper.position.set( 0, 0, 0 );
	// 			// helper.lookAt( intersects[ 0 ].face.normal );

	// 			// helper.position.copy( intersects[ 0 ].point );
	// 			cursor.hit.scene.children[0].position.copy( intersects[ 0 ].point );
	// 		}
	// 	}
	// }
	// console.log(cursor.scrllDlt)
	cursor.hit?.onScrll?.(cursor.scrllDlt)

	render?.()
	cursor.lst_scrll = Date.now()
	// cursor.scrllDlt = 0
	// cursor.scrll.x  = cursor.scrllDlt
	// cursor.scrll.y = cursor.scrllDlt
	// console.log(cursor.scrllDlt)
	// console.log(event)
	// return false;
	mseMve(event)
}
if(isMobile){
	document.addEventListener("touchstart", mseDwn, false);
	document.addEventListener("touchmove", mseMve, false);
	window.addEventListener("touchend", mseUp, false);	
}else{
	document.addEventListener("mousedown", mseDwn, false);
	document.addEventListener("mousemove", mseMve, false );
	document.addEventListener("mouseup", mseUp, false);
	window.addEventListener("wheel", mseWhl, 		{passive: false});
	document.addEventListener("mousewheel", mseWhl,  	{passive: false});
	document.addEventListener("DOMMouseScroll", mseWhl, {passive: false});
	document.addEventListener("scroll",		mseWhl,	 	{passive: false});
	document.addEventListener("MozMousePixelScroll", mseWhl, {passive: false});
}
window.addEventListener( 'contextmenu', onContextMenu, false );




// document.addEventListener("touchstart", onTouchStart, false);