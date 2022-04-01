import { obj2D, tTyp, rRcrsv } from './__OBJECTS__.js';
import { color } from '../__COLOR__.js';
import { render } from '../__ENGINE__.js';

export class pln2D extends obj2D {
	constructor( attr = {} ) {
		super(attr)
		this._w 	= ( this.attr["w"] ) ? this.attr["w"] : 100;
		this._h 	= ( this.attr["h"] ) ? this.attr["h"] : 100;
		this.rds 	= ( this.attr["rds"] ) ? this.attr["rds"] : 0;
		this.color 	= ( this.attr["color"] ) ? this.attr["color"] 	: color("lightgray");
		this.strk 	= ( this.attr["strk"] ) ? this.attr["strk"] : color("black");
		this.line 	= ( this.attr["line"] ) ? this.attr["line"] : 0;
		this.rltv 	= ( this.attr["rltv"] != undefined) ? this.attr["rltv"] : true;
		this.area 	= ( this.attr["area"] ) ? this.attr["area"] : [this._x, this._y, this._w, this._h];
		this.a_clp 	= ( this.attr["area"] ) ? this.attr["area"] : [this._x, this._y, this._w, this._h];
		this.pvt 	= ( this.attr["pvt"] ) ? this.attr["pvt"] : [0.5,0.5];
		this.min_w 	= ( this.attr["min_w"] ) ? this.attr["min_w"] : 0;
		this.min_h 	= ( this.attr["min_h"] ) ? this.attr["min_h"] : 0;
		this.max_w 	= ( this.attr["max_w"] ) ? this.attr["max_w"] : null;
		this.max_h 	= ( this.attr["max_h"] ) ? this.attr["max_h"] : null;
		this.scale	= ( this.attr["scale"] ) ? this.attr["scale"] : 1.0;
		this.blur 	= ( this.attr["blur"] ) ? this.attr["blur"] : 0;
		this.buffer = true

		this.tab	= ( this.attr["tab"] ) ? this.attr["tab"] : 0;
		// this.onDrag = ( this.attr["onDrag"] ) ? this.attr["onDrag"] : null;
		this.vars = new Proxy(this, {
			get: function (target, key, value) {
				if(render)render()
				return target[key] || target.getItem(key) || undefined;
			}
		});
		this.getPath()
		return this
	}
	getPath(ctx){
		if(ctx == undefined){
			this.path = new Path2D();	
		}else{
			this.path = ctx
		}
		// console.log(this.name)
		if(ctx) this.path.beginPath();

		if(this.rds == 0){
			if(!this.prnt){
				this.path.rect(this._x, this._y, this._w, this._h);
			}else{				
				this.path.rect(this.area[0],this.area[1],this.area[2],this.area[3]);
			}
		}else{
			var x,y,w,h

			if(!this.prnt){
				x = this._x
				y = this._y
				w = this._w
				h = this._h
			}else{				
				x = this.area[0]
				y = this.area[1]
				w = this.area[2]
				h = this.area[3]
			}
			if(tTyp(this.rds) == "array"){
				var r_a = this.rds//*this.scale
			}else{
				var r = this.rds;
				if (w < 2 * r) r = w / 2;
				if (h < 2 * r) r = h / 2;
				if (r < 0) r = 0;
				var r_a = [r,r,r,r];
			}

			
			this.path.moveTo(x+r_a[0], y);
			this.path.arcTo( x+w,	y,	x+w,	y+h, 	r_a[1]);
			this.path.arcTo( x+w,	y+h,	x,		y+h, 	r_a[3]);
			this.path.arcTo( x,		y+h,	x,		y,	r_a[2]);
			this.path.arcTo( x,		y,	x+w,	y,	r_a[0]);
			if(ctx) this.path.closePath();
		}
	}
	updt(){
		this.drew = false

		// if(!this.rltv) return
		if(!this.prnt){
			this.area = [this._x, this._y, this._w,this._h];
			return
		}
		this.area = this.areaInPrnt()
		
		// if(this.ofst != false){
		// 	this.area[0] += this.ofst.x + this.scrll_ofst.x
		// 	this.area[1] += this.ofst.y + this.scrll_ofst.y
		// }
		
		if(this.clp && this.inPrnt() == false){
			this.hide = true
		}
			this.buffer = false
	}
	climb_up(func){
		var obj = this
		var top = this.prnt
		var res = true
		while(res && obj && top){
			res = func(); 
			obj = top
			top = obj.prnt
		}
		return res
	}
	drw(s = false){// s = super
		if(this.hide || (this.prnt && !s)) return this

		var obj = this
		var top = this.prnt
		var res = this.climb_up(()=>{return this.inObj(top) && (cursor.pip(top) || cursor.pip(obj))?true:false})
		var res2 = this.climb_up(()=>{return this.inObj(top)?true:false})
		if(res) this.buffer = true
		if(!res2) this.hide = true
			// return
			// this.chld.forEach( (k) => {
			// 	rRcrsv(k, ((k) => {
			// 		k.hide = this.hide
			// 	}))
			// })
		

		if(this.vis){
			if(!this.rltv && !this.prnt){
				this._w = stg_w
				this._h = stg_h
			}

			this.ctx.save();
			if(!this.msk){
				if(this.clp) this.msk = this.prnt
			}else{
				this.a_clp = this.msk.area
			}

			this.getPath(this.ctx)
			this.getPath()
			

			if(this.blur > 0 && glass_blur){
				// if( this.auto == false && this.bg == undefined){
					// try{
					// 	worker.postMessage({
					// 		imageData:this.ctx.getImageData(this.area[0], this.area[1], this.area[2], this.area[3]),
					// 		radius:this.blur,
					// 		quality:0.1,
					// 		obj:this.name
					// 	});	
					// }catch(e){console.error(e)}
					
					this.cvs.bCtx.save();
					this.cvs.bCtx.filter = 'blur(' + this.blur +'px)';
				
					this.cvs.bCtx.drawImage(this.cvs.cvs,
						this.area[0], this.area[1], this.area[2], this.area[3],
						this.area[0], this.area[1], this.area[2], this.area[3]
					);
					this.bg = this.cvs.bCvs

				// }
				// if(this.bg){
				// 	// this.cvs.bCtx.filter = 'blur(' + this.blur +'px)';
				
				// 	this.cvs.bCtx.putImageData(this.bg,this.area[0], this.area[1]);
				// 	// this.bg = this.cvs.bCvs
				// }
				
				if(this.bg)this.ctx.drawImage(this.bg,0,0);
				this.cvs.bCtx.restore()
			}
			this.ctx.clip(this.path)
			this.ctx.fillStyle = this.color.getStyle();
			this.ctx.fill();

			if(this.line > 0){
				this.getPath()
				this.ctx.clip(this.path)
				this.ctx.lineWidth = this.line*2;
				this.ctx.strokeStyle = this.strk.getStyle();
				this.ctx.stroke();
			}
		}

		

		if(this.chld.size > 0 && this.hide == false) this.chld?.forEach?.( (k) => {
			if(k.indx == this.tab || k.indx?.includes?.(this.tab) ){
				k.hide = this.hide
				k.anim?.()
				k.updt()
				k.drw?.(true)
				// render_count+=1
			}else{
				k.hide = true
			}
		} )

		this.ctx.restore();
		// render_count+=1
		this.drew = true
		return this
	}
}