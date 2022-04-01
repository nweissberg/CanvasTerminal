import { tTyp } from './__OBJECTS__.js';
import { pln2D } from './__PLANE__.js';
import { render } from '../__ENGINE__.js';

// var img = document.querySelector("#img_div img"),
// var observer = new MutationObserver((changes) => {
//	 changes.forEach(change => {
//			 if(change.attributeName.includes('src')){
//				 console.dir(img.src);
//			 }
//	 });
// });
var img_lib = {}
var blend_options = [
	"source-over",
	"source-in",
	"source-out",
	"source-atop",
	"destination-over",
	"destination-in",
	"destination-out",
	"destination-atop",
	"lighter",
	"copy",
	"xor",
	"multiply",
	"screen",
	"overlay",
	"darken",
	"lighten",
	"color-dodge",
	"color-burn",
	"hard-light",
	"soft-light",
	"difference",
	"exclusion",
	"hue",
	"saturation",
	"color",
	"luminosity"
]
function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    // img.crossOrigin="anonymous"
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function load_img(src){

	var name = src.substring(src.lastIndexOf("/")+1)
	// console.log(loadVar(name))
	const cached = loadVar(name)

	if(img_lib[name]){
		return img_lib[name]
	}
	var format = name.substring(name.lastIndexOf(".")+1)
	var img = new Image();
	

	if(cached != undefined){
		if(format!="svg"){
			img.src = "data:image/png;base64," + cached
			return img
		}
		img.src = "data:image/svg+xml;charset=utf-8,"+cached;	
		const parser = new DOMParser();
		const doc = parser.parseFromString(cached, "application/xml");
		img.xml = doc.getElementsByTagName("svg")[0]
		return img
	}

	img.onload = (function(){
		img_lib[name] = this
		if(!this.xml){
			// console.log(getBase64Image(this))
			// saveVar(name, getBase64Image(this), true)
		}
		if(render) render()
		this.onload = null
	});

	if(format == "svg"){
		var client = new XMLHttpRequest();
		client.onload = (function(){
			if(this.status == 200 &&
				this.responseXML != null) {
				var svg_xml = this.responseXML.getElementsByTagName("svg")[0]
				svg_xml.setAttribute("stroke-width","1.5")
				img.xml = svg_xml
				var xml = (new XMLSerializer).serializeToString(svg_xml);
				img.src = "data:image/svg+xml;charset=utf-8,"+xml;
				saveVar(name, xml, true)
			}
		});
		client.open("GET", src);
		client.send();
	}else{
		img.src = src

	}

	img_lib[name] = "load"
	return img
}

export class img2D extends pln2D{
	constructor( attr = {} ) {
		super(attr)
		this.src = ( this.attr["src"] ) ? this.attr["src"] : undefined;
		this.mode = ( this.attr["mode"] ) ? this.attr["mode"] : 2;
		this.color = ( this.attr["color"] ) ? this.attr["color"] : null;
		// this.scale = 1.0
		this.img = new Image()

		if(this.src != undefined){
			this.set(this.src)
			// this.img.src = this.src;
		}

	}
	set(src){
		this.img = load_img(src)
	}
	drw(s = false){// s = super
		
		if(this.hide || (this.prnt && !s) || this.img == null || this.prnt?.vis == false) return this
		if(this.vis){
			if(!this.img || this.img == "load"){
				this.img = load_img(this.src)
				return this
			}
			this.ctx.save();

			this.imageWidth 	= this.img.width;
			this.imageHeight 	= this.img.height;

			var ratioW = (this.area[2]) / this.imageWidth;
			var ratioH = (this.area[3]) / this.imageHeight;

			if (this.mode == 1){
				var ratio = ratioW < ratioH ? ratioW : ratioH;
			}
			if (this.mode == 2){
				var ratio = ratioW > ratioH ? ratioW : ratioH;
			}
			var newImageWidth = this.imageWidth * ratio;
			var newImageHeight = this.imageHeight * ratio;
			
			if (this.mode == 3){
				newImageWidth = (this.area[2]);
				newImageHeight = (this.area[3]);
			}

			
			this.drawWidth = newImageWidth
			this.drawHeight = newImageHeight

			var screenCenterX = ((this.area[2])/2 - this.drawWidth/2);
			var screenCenterY = ((this.area[3])/2 - this.drawHeight/2);

			var imagePosX = screenCenterX + this._x;
			var imagePosY = screenCenterY + this._y;

			var centerX = -(this.drawWidth/2)
			var centerY = -(this.drawHeight/2)

			
			// if(!this.msk){
			// 	if(this.clp) this.msk = this.prnt
			// }else{
			// 	this.a_clp = [	this.msk.area[0]-(this.msk.line*0.5),
			// 					this.msk.area[1]-(this.msk.line*0.5),
			// 					this.msk.area[2]+(this.msk.line),
			// 					this.msk.area[3]+(this.msk.line)]
			// 	this.ctx.beginPath();
			// 	this.ctx.rect(this.a_clp[0],this.a_clp[1],this.a_clp[2],this.a_clp[3]);
			// 	this.ctx.clip()
			// }
	
			let c_path = new Path2D();
			if(this.rds == 0){
				c_path.rect(this.area[0],this.area[1],this.area[2],this.area[3]);
			}else{
				var x,y,w,h
		
				x = this.area[0]
				y = this.area[1]
				w = this.area[2]
				h = this.area[3]
			
				if(tTyp(this.rds) == "array"){
					var r_a = this.rds
				}else{
					var r = this.rds;
					if (w < 2 * r) r = w / 2;
					if (h < 2 * r) r = h / 2;
					if (r < 0) r = 0;
					var r_a = [r,r,r,r];
				}
				
				c_path.moveTo(x+r_a[0], y);
				c_path.arcTo( x+w,	y,	x+w,	y+h, 	r_a[1]);
				c_path.arcTo( x+w,	y+h,	x,		y+h, 	r_a[3]);
				c_path.arcTo( x,		y+h,	x,		y,	r_a[2]);
				c_path.arcTo( x,		y,	x+w,	y,	r_a[0]);
			}
			

			this.ctx.clip(c_path)

			// console.log(this.img.src)
			this.ctx.beginPath();
			if(!this.prnt){
				this.ctx.drawImage(this.img, this._x, this._y);
				// this.ctx.rect(this._x, this._y, this._w, this._h);
			}else{
				var d_w = this.area[0] + (this.area[2]*this.pvt[0]) - (this.drawWidth*this.pvt[0])
				var d_h = this.area[1] + (this.area[3]*this.pvt[1]) - (this.drawHeight*this.pvt[1])
				
				if(this.color && this.img.xml){
					// console.log(this.img.xml)
					this.img.xml.setAttribute("stroke",this.color.getStyle())
					var xml = (new XMLSerializer).serializeToString(this.img.xml);
					this.img.src = "data:image/svg+xml;charset=utf-8,"+xml;
				}
				// 	// this.cvs.bCtx.save();
				// 	// if(this.icon == undefined) this.icon = 10

				// 	// if(this.icon > 0 && toType(this.icon) != "imagedata"){
				// 		this.cvs.bCtx.filter = "none"
				// 		this.cvs.bCtx.fillStyle = this.color.getStyle();
				// 		this.cvs.bCtx.fillRect(this.area[0],this.area[1],this.area[2],this.area[3]);
				// 		this.cvs.bCtx.globalCompositeOperation = "destination-in";
				// 		this.cvs.bCtx.drawImage(this.img,d_w,d_h,this.drawWidth,this.drawHeight);
				// 		this.cvs.bCtx.globalCompositeOperation = "source-over";
				// 		// this.icon --
				// 		// if(this.icon == 0) this.icon = this.cvs.bCtx.getImageData(this.area[0],this.area[1],this.area[2],this.area[3])
				// 	// }
				// 	// console.log(toType(this.icon))
				// 	// if(toType(this.icon) == "imagedata"){
				// 		// console.log(this.icon)
				// 		// this.cvs.bCtx.putImageData(this.icon,this.area[0],this.area[1]);
				// 		this.ctx.drawImage(this.cvs.bCvs,0,0);
				// 	// }
				// 	// this.ctx.drawImage(this.icon,0,0);
				// 	// this.cvs.bCtx.restore()
				// }else{
					var o_x = 0
					var o_y = 0

					// if(this.imageWidth > this.imageHeight) o_x = (this.imageWidth*0.5)-(this.area[2]+(d_w*2))
					if(this.imageWidth < this.imageHeight) o_y = (this.imageHeight*0.5)-(this.area[3]+(d_h*2))

					try{
							this.ctx.drawImage(this.img,
							(o_x),
							(o_y),
							(this.imageWidth),
							(this.imageHeight),
							(d_w),
							(d_h),
							(this.drawWidth),
							(this.drawHeight)
						);
					}catch(error){
						// console.log(error)
					}
				// }
			}
			this.ctx.restore();
		}
		
		if(this.chld.size > 0) this.chld.forEach( (k) => {
			k.updt()
			k.drw(true)
			// render_count+=1
		} )
		
		// render_count+=1
		this.drew = true
		return this
	}
}