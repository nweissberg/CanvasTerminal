import { vec3D, lerp } from '../__MATH__.js';
import { render } from '../__ENGINE__.js';

export var tTyp = function(obj) {
	return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
var rcrsv_cont = 0
export function rRcrsv(o, f, d) {
	rcrsv_cont++
	if(o.chld.size > 0){
		o.chld.forEach( (c) => {
			rRcrsv(c, f, d)
		} )
	}
	if( tTyp(f) == "function" ) f( o, d )
}

function Action(type,msDuration){
	var type=type;
	var duration=msDuration;
	var incrementalX;
	var incrementalY;
}

export class obj2D {
	constructor( attr = {} ) {
		this.attr 	= attr
		this.name 	= ( this.attr["name"] ) ? this.attr["name"] : "obj2D_" + uid();
		this.pos 	= ( this.attr["pos"] ) 	? (( this.attr["pos"].clone ) ? this.attr["pos"].clone() : new vec3D(this.attr["pos"].x,this.attr["pos"].y,this.attr["pos"].z) ) : new vec3D(0,0,0);
		this._x 	= ( this.attr["x"] ) ? this.attr["x"] : this.pos.x;
		this._y 	= ( this.attr["y"] ) ? this.attr["y"] : this.pos.y;
		this._z 	= ( this.attr["z"] ) ? this.attr["z"] : this.pos.z;
		this.chld 	= ( this.attr["chld"] ) ? new Set().add(this.attr["chld"]) : new Set();
		this.prnt 	= ( this.attr["prnt"] ) ? this.attr["prnt"] : null;
		this.ofst 	= ( this.attr["ofst"] != undefined) ? this.attr["ofst"] : new vec3D(0,0,0);
		this.min_ofst 	= ( this.attr["min_ofst"] != undefined) ? this.attr["min_ofst"] : new vec3D(0,0,0);
		this.max_ofst 	= ( this.attr["max_ofst"] != undefined) ? this.attr["max_ofst"] : new vec3D(0,0,0);
		this.scrll_ofst 	= ( this.attr["scrll_ofst"] != undefined) ? this.attr["scrll_ofst"] : new vec3D(0,0,0);
		this.scrll_lock 	= ( this.attr["scrll_lock"] ) ? this.attr["scrll_lock"] : false;
		this.vis 	= ( this.attr["vis"] != undefined ) 	? this.attr["vis"] 	: true;
		this.hide 	= ( this.attr["hide"] ) ? this.attr["hide"] : false;
		this.msk 	= ( this.attr["msk"] != undefined) ? this.attr["msk"] 	: null;
		this.clp 	= ( this.attr["clp"] != undefined) ? this.attr["clp"] 	: true;
		this.auto 	= ( this.attr["auto"] ) ? this.attr["auto"] : false;
		this.indx	= ( this.attr["indx"] ) ? this.attr["indx"] : 0;
		
		this.cvs	= ( this.attr["cvs"] ) 	? MCM.get(this.attr["cvs"]) : MCM.values().next().value;
		this.ctx 	= this.cvs.ctx;
		this.drew 	= false
		this.acts 	= [];
		this.stacks 	= [];
		this.act 	= null;
		this.clock 	= new Clock();

		if(this.prnt){
			this.prnt.addChild?.(this)
		}
		MOM.set(this.name, this)

		this.onLoad = ( this.attr["onLoad"] ) ? this.attr["onLoad"] : null;

		if(this.onLoad){
			this.onLoad()
			this.onLoad = null
			this.attr["onLoad"] = null
			attr["onLoad"] = null
		}
		this.loop = ( this.attr["loop"] ) ? this.attr["loop"] : null;

		// this.onKey = ( this.attr["onKey"] ) ? this.attr["onKey"] : null;
		// render()
		// console.log(this)
	}
	// addListener(node,key,call){
	// 	this.observer = new MutationObserver((changes) => {
	// 		changes.forEach(change => {
	// 			if(change.attributeName.includes(key)){
	// 				call()
	// 			}
	// 		});
	// 	});

	// 	this.observer.observe(node, {attributes : true});
	// }
	pio(point){
		return new vec3D((point.x - this.area[0])/this.area[2],(point.y - this.area[1])/this.area[3],point.z)
	}
	getSon(name){
		let son = null
		this.chld.forEach( (s) => {
			if(s.name == name) son = s
		})
		return son
	}
	set_cvs(c){
		this.cvs = MCM.get(c)
		this.ctx = this.cvs.ctx
		if(this.chld.size > 0) this.chld.forEach( (k) => {k.set_cvs(c)} )
	}
	areaInPrnt(){
		if(this.rltv && this.prnt){
			var w = (this.prnt.area[2])*((this._w)/100)
			var h = (this.prnt.area[3])*((this._h)/100)	
			if(w < this.min_w) w = this.prnt.area[2]
			if(h < this.min_h) h = this.prnt.area[3]
			if(this.max_w && w > this.max_w) w = this.max_w
			if(this.max_h && h > this.max_h) h = this.max_h
			// if(this.ofst == false) this.ofst = {x:0,y:0}
			this._x = ((this.prnt.area[2]*(this.pos.x/100)) + this.prnt._x + this.prnt.area[2]*this.pvt[0] - (w*this.pvt[0])*this.scale)
			this._y = ((this.prnt.area[3]*(this.pos.y/100)) + this.prnt._y + this.prnt.area[3]*this.pvt[1] - (h*this.pvt[1])*this.scale)
		}else{
			var w = this._w
			var h = this._h
			if(w < this.min_w) w = this.prnt.area[2]
			if(h < this.min_h) h = this.prnt.area[3]

			if(this.max_w && w > this.max_w) w = this.max_w
			if(this.max_h && h > this.max_h) h = this.max_h
			
			this._x = (this.pos.x + this.prnt._x + this.prnt.area[2]*this.pvt[0] - (w*this.pvt[0])*this.scale)
			this._y = (this.pos.y + this.prnt._y + this.prnt.area[3]*this.pvt[1] - (h*this.pvt[1])*this.scale)
		}
		
		return [this._x+this.ofst.x + this.scrll_ofst.x, this._y+this.ofst.y + this.scrll_ofst.y, w*this.scale, h*this.scale]
	}
	inPrnt(){
		return this.inObj(this.prnt)
	}
	inObj(obj){
		// if(this.clp == false)return true
		if((this.area[0]) + this.area[2] < obj.area[0] ||
			this.area[0] > obj.area[0] + obj.area[2] ||
			(this.area[1]) + this.area[3] < obj.area[1] ||
			this.area[1] > obj.area[1] + obj.area[3]){
			return false
		}
		return true
	}
	addChild(obj){
		obj.prnt = this
		this.chld.add(obj)
		return this
	}
	setParent(obj){
		this.prnt = obj
		obj.addChild(this)
		return this
	}
	delParent(){
		this.prnt.chld.delete(this)
		this.prnt = null
		return this
	}
	del(){
		this.auto = false
		if(this.prnt) this.prnt.auto = false
		MOM.delete(this.name)
		if(this.chld.size > 0) this.chld.forEach( (k) => {k.del()} )
		if(this.prnt && this.prnt.chld.has(this)) this.prnt.chld.delete(this)
		if(render) render()
		// console.warn(this.name + " deleted")
		// return this.name + " deleted"
	}
	pause(duration){
		if(this.auto) return this
		var action = new Action();
		action.type = "pause";
		action.duration = duration;
		this.acts.push(action)
		this.IsActive = true;
		return(this);
	}
	exec(func){
		if(this.auto) return this
		var action = new Action();
		action.type = "exec";
		action.duration = 0;
		action.func = func;
		this.acts.push(action)
		this.IsActive = true;
		return(this);
	}
	lerpTo(key, value, duration){
		if(this.auto) return this
		var action = new Action();
		action.type = "lerpTo";
		action.duration = duration;
		// console.log(key)
		action.key = key
		action.valTo = value
		this.acts.push(action)
		this.IsActive = true;
		return(this);
	}
	anim(){

		if(this.auto != true) return;

		// console.log(this.name, this.auto)

		for (var i = 0; i < this.stacks.length; i++) {
			var act = this.stacks[i][0];
			if(act == undefined){
				this.stacks.splice(i, 1);
				if(this.stacks.length == 0 && this.auto == true){
					// var autoTo = false
					// if(this.chld.size > 0) this.chld.forEach( (k) => {
					// 	if(!autoTo) autoTo = k.auto
					// })
					this.auto = false
					if(this.prnt) this.prnt.auto = this.auto
				}
				return
			}
			switch(act.type){
				case "pause":
					break;
				case "exec":
					act.func()
					break;
				case "lerpTo":
					const path = act.key
					const keys = path.split('.');
					const lastKey = keys.pop();
					const obj = this
					const lastObj = keys.reduce((obj, key) => obj[key] = obj[key] || {}, obj); 
					if(parseInt(lastKey)) lastKey = parseInt(lastKey)
					// console.log(lastKey)
					lastObj[lastKey] = lerp(lastObj[lastKey],act.valTo,1/act.duration)
					break;
				default:
					break;
			}
			act.duration -= 1;

			if(act.duration <= 0){
				if(this.stacks[i].length > 0){
					act = this.stacks[i].shift();
				}else{
					act = null;
					this.IsActive = false;
				}
			}
		}
	}
	stack(){
		if(this.auto) return this
		// this.stacks += 1
		this.stacks.push(this.acts)
		this.acts = []
		return(this)
	}
	play(){
		if(this.auto) return this
		this.stacks.push(this.acts)
		this.acts = []
		this.auto = true
		if(this.prnt)this.prnt.auto = true
		// console.log(this.auto)
		// this.prnt
		// this.prnt.prnt.auto = true
		
	}
	
}