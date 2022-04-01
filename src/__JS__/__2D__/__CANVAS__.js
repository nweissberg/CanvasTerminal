
// 'use strict';
import { render } from '../__ENGINE__.js';

stg_w 	= window.innerWidth;
stg_h = window.innerHeight;


export function addCanvas2D( attr ){
	return new cvs2D( attr )
}
function cvs2D( attr ){
	this.attr = ( !attr ) ? {} : attr;
	this.name 	= ( this.attr["name"] ) ? this.attr["name"] : "cvs2D_" + uid();
	this.cont = ( this.attr["cont"] ) ? this.attr["cont"] : m_area; // Conteiner
	this.cvs = document.createElement('canvas'); // Canvas
	// this.cvs.cloneNode().transferControlToOffscreen();

	this.bCvs = (window.OffscreenCanvas) ? new OffscreenCanvas(this.cvs.width,this.cvs.height) : this.cvs.cloneNode();//this.cvs.cloneNode().transferControlToOffscreen();//
	// this.bCvs.cloneNode().transferControlToOffscreen();
	this.bCtx = this.bCvs.getContext('2d');
	// this.worker = new Worker("./__JS__/__2D__/canvas_worker.js");
	
	// this.worker.postMessage = this.worker.webkitPostMessage || this.worker.postMessage;

	// this.worker.onmessage = (e)=> {
	// 	// console.log(e.data)
	// 	// this.getPath()
	// 	// this.ctx.clip(this.path)
	// 	this.ctx.drawImage(e.data, 0,0);
	// }

	this.cvs.id = this.name;
	this.cvs.className = 'canvas'
	this.cont.appendChild( this.cvs );
	this.ctx = this.cvs.getContext('2d');
	this.cvs.style.zIndex = ( this.attr["indx"] ) ? this.attr["indx"] : MCM.size;
	this.a_clr = ( this.attr["clr"] ) ? this.attr["clr"] : true; // Auto Clear
	MCM.set(this.name, this)
	return this
}
cvs2D.prototype.clear = function(){
	clearCanvas(this.ctx)
	clearCanvas(this.bCtx)
}
cvs2D.prototype.resize = function(w,h){
	this.cvs.width = w
	this.cvs.height = h
}
function clearCanvas(ctx){
	ctx.clearRect( 0, 0, stg_w, stg_h);
}

export function onWindowResize() {
	// console.log("onWindowResize")
	// windowSizeUpdate = true
	if(document.body.clientHeight > stg_h){
		// textField.blur()
	}
	const width  = document.body.clientWidth || window.innerWidth || document.documentElement.clientWidth ;
	const height = document.body.clientHeight|| window.innerHeight|| document.documentElement.clientHeight;
	
	innerWidth 		= window.innerWidth;//<<===***
	innerHeight 	= window.innerHeight;//<<===***

	stg_w 	= width//window.screen.width//document.body.clientWidth;
	stg_h = height//window.screen.height//document.body.clientHeight;

	var newWidth 	= stg_w
	var newHeight 	= stg_h
	
	
	// wglCanvas.resize(newWidth,newHeight)
	var scaleX = stg_w / newWidth;
	var scaleY = stg_h / newHeight;

	sclRs = Math.max(scaleX, scaleY); // Scale Resolution

	m_area.style.transformOrigin = '0 0'; //scale from top left
	m_area.style.transform = 'scale(' + sclRs + ')';


	MCM.forEach( (c) => {
		// console.log(c.cvs.width,c.cvs.height)
		c.cvs.width = stg_w
		c.cvs.height = stg_h
		c.bCvs.width = stg_w
		c.bCvs.height = stg_h
		c._w = stg_w
		c._h = stg_h
		// console.log(c)
	})

	// updateRender = true
	if(render) render()
}



