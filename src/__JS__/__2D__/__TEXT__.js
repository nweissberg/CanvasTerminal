import { obj2D, tTyp } from './__OBJECTS__.js';
import { color } from '../__COLOR__.js';

function getFormating(str_txt) {
	var txt_array = []
	var last_index = 0
	var index = 0
	while(index != -1){
		index = str_txt.indexOf("<")
		var next_index = str_txt.indexOf(">")+1

		var tmp_str = str_txt.substring(last_index,index)
		var next_str = str_txt.substring(index,next_index)

		var str_txt = str_txt.substring(next_index,str_txt.lenght)
		if(tmp_str != "") txt_array.push(tmp_str)
		if(next_str != "") txt_array.push(next_str)
	}
	if(str_txt != "") txt_array.push(str_txt)

	return(txt_array)
}

export class txt2D extends obj2D {
	constructor( attr = {} ) {
		super(attr)
		this.txt 	= ( this.attr["txt"] ) ? this.attr["txt"] : this.name;
		if(toType(this.txt)!="string") this.txt = JSON.stringify(this.txt)
		this.plain_txt = this.txt
		this.txt_style 	= ( this.attr["txt_style"] != undefined) ? this.attr["txt_style"] : true;
		this.color 	= ( this.attr["color"] ) ? this.attr["color"] 	: color("lightgray");
		this.strk 	= ( this.attr["strk"] ) ? this.attr["strk"] : color("black");
		this.line 	= ( this.attr["line"] ) ? this.attr["line"] : 0;
		this.pvt 	= ( this.attr["pvt"] ) ? this.attr["pvt"] : [0.5,0.5];
		this.style 	= ( this.attr["style"] ) ? this.attr["style"] : "normal";//italic, bold, small-caps, 600
		this.baseLine 	= ( this.attr["baseLine"] ) ? this.attr["baseLine"] : "top";//"top","hanging","alphabetic","bottom"
		this.textAlign 	= ( this.attr["textAlign"] ) ? this.attr["textAlign"] : "left";//"center","right"
		this.family 	= ( this.attr["family"] ) ? this.attr["family"] : "Verdana";//"Arial", "Verdana","Times New Roman","Courier New", "serif", "sans-serif"
		this.size 	= ( this.attr["size"] ) ? this.attr["size"] : 12;
		this.clp 	= ( this.attr["clp"] != undefined) ? this.attr["clp"] 	: true;
		this.edit 	= ( this.attr["edit"] != undefined) ? this.attr["edit"] 	: false;
		this.txt_height = 0
		this.txt_width = 0

		this.txt_cursor = {
			dir:"none",
			first:-1,
			last_cursor: 0,
			first_pos:{x:0,y:0},
			touch_pos:{x:0,y:0},
			select_last:0,
			select:0,
			start:0,
			end:0,
			x:0,
			y:0,
			line:0
		}		
		this.vars = new Proxy(this, {
			set: function (target, key, value) {
				target[key] = value;
				// if(render) render()
			}
		});
	}
	rst(){
		this.txt_cursor = {
			dir:"none",
			first:-1,
			last_cursor: 0,
			select_last:0,
			first_pos:{x:0,y:0},
			touch_pos:{x:0,y:0},
			select:0,
			start:0,
			end:0,
			x:0,
			y:0,
			line:0
		}
	}
	updt(){
		this.drew = false
		if(!this.prnt){
			this.area = [this._x, this._y, this._w,this._h];
			return
		}
		
		this.area = this.areaInPrnt()
		
		if(this.clp && this.inPrnt() == false){
			this.hide = true
		}
		if(this.min_ofst){
			if(this.ofst.x>this.min_ofst.x) this.ofst.x = this.min_ofst.x
			if(this.ofst.y>this.min_ofst.y) this.ofst.y = this.min_ofst.y
		}
		if(this.max_ofst){
			if(this.ofst.x<this.max_ofst.x) this.ofst.x = this.max_ofst.x
			if(this.ofst.y<this.max_ofst.y) this.ofst.y = this.max_ofst.y
		}

		if(!this.edit) return

		if(showTouchKeyboard == this.prnt){
			this.prnt.pin.indx = 0
			this.prnt.pin.ofst.x = (this.txt_cursor.x+this.ofst.x)-(this.txt_cursor.total_w*this.pvt[0])+(this.pos.x*(this.prnt.area[2]/100))
			this.prnt.pin.ofst.y = (this.txt_cursor.y+this.ofst.y)+(-3*(1-this.pvt[1]))//(3*(1-this.pvt[1])*(-1))//-(this.txt_cursor.total_h*this.pvt[1])+(this.pos.y*(this.prnt.area[3]/100))
		}else{
			// this.prnt.pin.vis = false
			this.prnt.pin.indx = 1
		}
	}
	select(start=0,end=textField.value.length){
		textField.setSelectionRange(start,end)
	}
	drw(s = false){// s = super
		if(this.hide || (this.prnt && !s)) return this
		if(!this.vis){
			// if(this.chld.size > 0) this.chld.forEach( (k) => {
			// 	k.updt()
			// 	k.drw(true)
			// } )
			return
		}

		this.ctx.save();

		this.ctx.fillStyle = this.color.getStyle();
		this.ctx.font = this.style +" "+ (this.size) +"px "+this.family;

		this.ctx.textBaseline = this.baseLine;
		// this.ctx.textAlign = this.textAlign;
		
		var txt_lines = this.txt.split("\n")
		var line_index = 0
		
		if(this.edit == true){
			this.txt_cursor.x = 0
			this.txt_cursor.select = 0
			this.txt_cursor.y = 0
			// this.txt_cursor.first = 0

			if(textField.selectionStart == textField.selectionEnd || textField.selectionDirection == "none"){
				this.txt_cursor.first = -1
			}
		}

		var abs_x = 0
		var abs_y = 0
		
		this.txt_height = 0
		this.txt_width = 0

		for (var h = 0; h < txt_lines.length; h++) {
			this.txt_height+=this.size*1.5
		}

		for (var j = 0; j < txt_lines.length; j++) {
			
			var txt_raw = txt_lines[j]
			if(this.txt_style == false){
				var formating_array = [txt_raw]
			}else{
				var formating_array = getFormating(txt_raw)	
			}

			var last_x = 0
			var txt_array = formating_array

			if(this.txt_style == true){
				txt_array = txt_array.filter(function (item) {
				   return item.indexOf("<") !== 0;
				});
			}
			

			this.plain_txt = txt_array.join("")
			var total_w = this.ctx.measureText(this.plain_txt).width
			var total_h = this.ctx.measureText(this.plain_txt).actualBoundingBoxDescent

			if(this.txt_style == null){
				txt = txt_raw
				if(this.prnt){
					abs_x = this.prnt.area[0]+(this.ofst.x+this.scrll_ofst.x)-(this.prnt.ofst.x+this.prnt.scrll_ofst.x)+(this.prnt.area[2]*this.pvt[0])-(total_w*this.pvt[0])+(this.prnt.area[2]*(this.pos.x/100))+(last_x)
					abs_y = this.prnt.area[1]+(this.ofst.y+this.scrll_ofst.y)-(this.prnt.ofst.y+this.prnt.scrll_ofst.y)+(this.prnt.area[3]*this.pvt[1])-(total_h*this.pvt[1])+(this.prnt.area[3]*(this.pos.y/100))+(last_y)
					this.ctx.fillText(txt, abs_x,  abs_y);
				}else{
					this.ctx.fillText(txt, this.area[0]+(last_x)-(total_w*this.pvt[0]), this.area[1]+(last_y)-(total_h*this.pvt[1]));	
				}
				
				last_x += this.ctx.measureText(txt).width
				continue
			}

			var spacing = this.size*1.5

			var last_y = (spacing*j)
			var _diff = (this.txt_height)-(this.prnt.area[3])

			// last_y-=((txt_lines.length-1)*(spacing/txt_lines.length))//*this.pvt[1]
			last_y-= (_diff>0?(this.txt_height - _diff-15)*this.pvt[1]:(txt_lines.length>1?this.txt_height*this.pvt[1]:0))
			// last_y-=((this.prnt.area[3]*this.prnt.pvt[1])*(this.pvt[1]))
			// last_y-=(_diff-5)*this.pvt[1]
			// last_y+=((_diff>0?(_diff*this.pvt[1])-(this.prnt.area[3]*this.prnt.pvt[1]):0))
			// last_y-=((_diff>0?(_diff):(this.txt_height)*this.pvt[1]))

			if(this.edit == true && this.prnt && showTouchKeyboard == this.prnt){

			
				this.txt_cursor.dir = textField.selectionDirection
				this.txt_cursor.start = (this.txt_cursor.dir == "forward" || this.txt_cursor.dir == "none") ? textField.selectionStart : textField.selectionEnd;
				this.txt_cursor.end = (this.txt_cursor.dir == "backward") ? textField.selectionStart : textField.selectionEnd;
				
				if(this.txt_cursor.end-line_index < txt_raw.length+1 && this.txt_cursor.end-line_index >= 0){
					this.txt_cursor.x = (this.ctx.measureText(txt_raw.substring(0,this.txt_cursor.end-line_index)).width)
					this.txt_cursor.select = (this.ctx.measureText(txt_raw.substring(0,this.txt_cursor.start-line_index)).width)
					this.txt_cursor.line = j
					this.txt_cursor.total_w = total_w
					this.txt_cursor.total_h = total_h
					this.txt_cursor.y = last_y
					if(textField.selectionStart != textField.selectionEnd){
						if(this.txt_cursor.first == -1){
							var sub = (textField.selectionEnd-textField.selectionStart > 1) ? 1:0;
							if(this.txt_cursor.dir == "forward") sub *= -1
							this.txt_cursor.first = j + sub
							this.txt_cursor.first_pos.x = this.txt_cursor.select_last
						}
					}
				}

				if(this.txt_cursor.select !== 0 || Math.abs(this.txt_cursor.last_cursor-this.txt_cursor.start) >= 1) this.txt_cursor.select_last = this.txt_cursor.select

				this.txt_cursor.last_cursor = this.txt_cursor.start
				line_index += txt_raw.length+1
			}

			for (var i = 0; i < formating_array.length; i++) {
				var txt = formating_array[i]
				if(txt[0] == "<"){
					if(txt == "<b>") this.style += " bold"
					if(txt == "<i>") this.style += " italic"

					if(txt == "</b>") this.style = this.style.replace("bold","")
					if(txt == "</i>") this.style = this.style.replace("italic","")
					
					if(txt[1] == "c"){
						this.ctx.fillStyle = new color(txt.substring(3,txt.length-1)).getStyle();
					}
					if(txt == "</c>") this.ctx.fillStyle = this.color.getStyle();
					this.ctx.font = this.style+" "+ (this.size) +"px "+this.family;
					continue
				}
				if(!this.prnt){
					this.ctx.fillText(txt,
						this.area[0]+(last_x)-(total_w*this.pvt[0]),
						this.area[1]+(last_y)-(total_h*this.pvt[1]));
					continue
				}

				abs_x = this.prnt.area[0]+(this.ofst.x+this.scrll_ofst.x)-(this.prnt.ofst.x+this.prnt.scrll_ofst.x)+(this.prnt.area[2]*this.pvt[0])-(total_w*this.pvt[0])+(this.pos.x*(this.prnt.area[2]/100))+(last_x)
				abs_y = this.prnt.area[1]+(this.ofst.y+this.scrll_ofst.y)-(this.prnt.ofst.y+this.prnt.scrll_ofst.y)+(this.prnt.area[3]*this.pvt[1])-(total_h*this.pvt[1])+(this.pos.y*(this.prnt.area[3]/100))+(last_y)
				
				if(this.prnt.area[1]>abs_y + total_h || abs_y-total_h > this.prnt.area[1]+this.prnt.area[3]-10){
					continue
				}

				this.ctx.fillText(txt, abs_x,  abs_y);

				if(this.txt_cursor.start != this.txt_cursor.end && showTouchKeyboard == this.prnt){
					this.ctx.save()
					this.ctx.globalCompositeOperation = "lighter";
					this.ctx.fillStyle = "rgba(100,100,100,0.5)"
					var dir_forward = (this.txt_cursor.dir == "forward")
					var dir_backward = (this.txt_cursor.dir == "backward")
					var dir_none = (this.txt_cursor.dir == "none")
					// console.log(this.txt_cursor.first)
					if(dir_none) this.txt_cursor.first = 0
					if(	((dir_forward || dir_none) && j < this.txt_cursor.line && (j > this.txt_cursor.first||dir_none) )
					|| 	(dir_backward && j > this.txt_cursor.line && (j < this.txt_cursor.first||dir_none)) ) {
						if(this.txt_cursor.first != -1){
							this.ctx.fillRect(
								abs_x,
								abs_y-3,
								total_w,
								spacing
							)	
						}
					}
					if(this.txt_cursor.line == j){
						this.ctx.fillRect(
							abs_x+this.txt_cursor.select,
							abs_y-3,
							this.txt_cursor.x-this.txt_cursor.select,
							spacing
						)
					}else if(this.txt_cursor.first == j && !dir_none){
						if(dir_forward){
							this.ctx.fillRect(
								abs_x+this.txt_cursor.first_pos.x,
								abs_y-3,
								total_w-this.txt_cursor.first_pos.x,
								spacing
							)
						}else{
							this.ctx.fillRect(
								abs_x,
								abs_y-3,
								this.txt_cursor.first_pos.x,
								spacing
							)
						}
					}
					this.ctx.restore()
				}
				last_x += this.ctx.measureText(txt).width
			}
			
			if(total_w > this.txt_width) this.txt_width = total_w
			if(showTouchKeyboard == this.prnt && this.txt_cursor.touch_pos.y-abs_y > 0 && (this.txt_cursor.touch_pos.y-abs_y < total_h*1.5 || j == txt_lines.length-1) &&  abs_y > this.prnt.area[1] &&  abs_y < this.prnt.area[1] + this.prnt.area[3]){
				var i_x = (this.txt_cursor.touch_pos.x - abs_x)/last_x
				if(i_x > 1) i_x = 1
				if(i_x < 0) i_x = 0
				// console.log(j,line_index)
				var touch_index = Math.round(line_index-1 -(txt_lines[j].length*(1-i_x)))
				this.select(touch_index,touch_index)
				textField.selectionDirection = "none"
				this.txt_cursor.touch_pos = {x:this.ofst.x,y:this.ofst.y}
			}
			
		}
		

		// this.pos.y = -((((this.txt_height*this.pvt[1])*100)/(this.prnt.area[3])))
		
		if(this.txt_height > this.prnt.area[3]){
			this.max_ofst.y = -(this.txt_height - this.prnt.area[3])-10
			this.min_ofst.y = 10
		}else{
			this.max_ofst.y = -10
			this.min_ofst.y = 10
		}
		if(this.txt_width > this.prnt.area[2]){
			this.max_ofst.x = -(this.txt_width*(1-this.pvt[0]))+(this.prnt.area[2]*(1-this.pvt[0]))-10
			this.min_ofst.x = (this.txt_width*(this.pvt[0]))-(this.prnt.area[2]*(this.pvt[0]))+10
		}else{
			this.max_ofst.x = -10
			this.min_ofst.x = 10
		}

		this.ctx.restore();
		// render_count+=1
		this.drew = true
		return this
	}
}
