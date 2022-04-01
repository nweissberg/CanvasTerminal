import { bttn2D } from '../__BUTTON__.js';
import { colors } from '../../__PALETTE__.js';
import { pln2D } from '../__PLANE__.js';
import { txt2D } from '../__TEXT__.js';
// ## ALERT ## //

var config_obj = null
export function config(stage,onConfirm=(()=>{}),onCancel=(()=>{})){

	if(config_obj){
		config_obj.del()
		config_obj = null
	}
	config_obj = new bttn2D({
		prnt:stage,
		blur:11,
		color:colors.glass_dark,
		onOvr:(()=>{}),
		onTch_U:(()=>{}),
		onTch_D:(()=>{}),
		onDrag:(()=>{cursor.rst()}),
		onScrll:(()=>{cursor.rst()}),
		onLoad:(()=>{cursor.rst()})
	})

	var alert_box = new pln2D({
		prnt:config_obj,
		// pos: new vec3D(0,-100,0),
		color:colors.window,
		rds:20,
		rltv:false,
		w:333,
		h:200,
		onLoad:(function(){
			if(!isMobile) this.lerpTo("scale",1.1,7).lerpTo("scale",1,7).play()
		})
	})

	new txt2D({
		prnt:alert_box,
		txt:title,
		style:"bold",
		color:colors.font_light,
		pvt:[0.5,0.15],
		size:24
	})

	new txt2D({
		prnt:alert_box,
		txt:message,
		color:colors.font_light,
		size:18
	})

	new bttn2D({
		prnt:alert_box,
		src:'./__SVG__/x.svg',
		img_scale:0.8,
		img_color:colors.font_dark,
		// size:18,
		color:colors.negative,
		w:50,
		h:20,
		pvt:[0,1],
		onTch_U:(function(){
			// this.prnt.lerpTo("pos.x",-100,12).exec(()=>{this.prnt.prnt.del()}).play()
			this.onCancel()
			this.prnt.prnt.del()
			// this.prnt.del()
			config_obj = null
		})
	}).onCancel = onCancel

	new bttn2D({
		prnt:alert_box,
		src:'./__SVG__/check.svg',
		img_scale:0.8,
		color:colors.positive,
		img_color:colors.font_dark,
		w:50,
		h:20,
		pvt:[1,1],
		onTch_U:(function(){
			this.onConfirm()
			// this.prnt.lerpTo("pos.x",100,12).exec(()=>{this.prnt.prnt.del()}).play()
			this.prnt.prnt.del()
			config_obj = null
		})
	}).onConfirm = onConfirm
}