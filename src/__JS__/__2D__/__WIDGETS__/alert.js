import { bttn2D } from '../__BUTTON__.js';
import { colors } from '../../__PALETTE__.js';
import { pln2D } from '../__PLANE__.js';
import { txt2D } from '../__TEXT__.js';
import { getKey } from '../../__KEYBOARD__.js';
import { stg2D } from './../__STAGE__.js';
import { modal2D } from '../__WIDGETS__/modal.js';
// ## ALERT ## //

export function alert(title,message,onConfirm,onCancel){
	if(!alert_stage){
		alert_stage = new stg2D({
			color:colors.alpha,
			w:stg_w,
			h:stg_h,
			onLoad:(function(){
				this.onScrll = null
				this.onTch_M = null	
			})
		})
	}
	const modal = new modal2D({prnt:alert_stage})
	modal.onTch_U=(()=>{})
	modal.body = new pln2D({
		cvs:"h_cvs",
		prnt:modal,
		rds:20,
		color:colors.glass_dark,
		min_w:400,
		max_w:400,
		min_h:200,
		max_h:200,
		scale:0.8,
		h:30,
		w:80,
		vis:false,
		onLoad:(function(){
			this.prnt
			.lerpTo("blur",10,10)
			.stack()
			.lerpTo("color.a",0.7,5)
			.exec(()=>{
				this.vis = true
				this.lerpTo("scale",1.1,7)
				.lerpTo("scale",1,7)
				.play()
			})
			.play()
		}),
		onOvr:(()=>{}),
		onTch_U:(function(){
			this.prnt.onTch_U()
		}),
	})
	new txt2D({
		cvs:"h_cvs",
		prnt:modal.body,
		txt:title,
		style:"bold",
		color:colors.font_light,
		pvt:[0.5,0.15],
		size:24
	})
	new txt2D({
		cvs:"h_cvs",
		prnt:modal.body,
		txt:message,
		color:colors.font_light,
		size:18
	})

	var actions = (onCancel || onConfirm) && onCancel != false
	if(actions){
		new bttn2D({
			cvs:"h_cvs",
			prnt:modal.body,
			src:'./__SVG__/x.svg',
			img_scale:4,
			img_color:colors.font_dark,
			// size:18,
			color:colors.negative,
			w:50,
			h:20,
			pvt:[0,1],
			onTch_U:(function(){
				// this.prnt.lerpTo("pos.x",-100,12).exec(()=>{this.prnt.prnt.del()}).play()
				if(this.onCancel) this.onCancel()
				this.prnt.prnt.onClose()
				// this.prnt.del()
				// alert_stage = null
			}),
			onKey:(function(){
				if(getKey("ESC",1))this.onTch_U()
			})
		}).onCancel = onCancel
	}
	
	new bttn2D({
		cvs:"h_cvs",
		prnt:modal.body,
		src:'./__SVG__/check.svg',
		img_scale:4,
		color:colors.positive,
		img_color:colors.font_dark,
		w:(actions)?50:100,
		h:20,
		pvt:[1,1],
		onTch_U:(function(){
			if(this.onConfirm) this.onConfirm()
			// this.prnt.lerpTo("pos.x",100,12).exec(()=>{this.prnt.prnt.del()}).play()
			this.prnt.prnt.onClose()
			// alert_bg = null
		}),
		onKey:(function(){
			if(getKey("ENTER",1)) this.onTch_U()
		})
	}).onConfirm = onConfirm
}