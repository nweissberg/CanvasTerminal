import { colors } from '../../__PALETTE__.js';
import { stg2D } from '../__STAGE__.js';
import { bttn2D } from '../__BUTTON__.js';
import { pln2D } from '../__PLANE__.js';
import { vec3D } from '../../__MATH__.js';
import { inputfield } from './inputfield.js';
import { rRcrsv } from '../__OBJECTS__.js';

export function addMatrix(argument) {
	return new matrixview(argument)
}

export class matrixview extends stg2D {
	constructor( attr = {} ) {
		attr.size = ( attr["size"] ) ? attr["size"] : 15;
		attr.color = colors.alpha;
		attr.strk = colors.stroke;
		attr.line = ( attr["line"] ) ? attr["line"] : 2;
		attr.rltv = ( attr["rltv"] != undefined ) ? attr["rltv"] : true;
		
		attr.scrll_lock = true
		super(attr)
		this.attr = attr
		this.data = attr.data
		this.items = attr.items?attr.items:[]
		this.link_cells = attr.link_cells!=undefined?attr.link_cells:true
		this.attr.init = attr.init!=undefined?attr.init:(prnt=>{
			if(!prnt.data && !prnt.items)return([[]])

			if(prnt.items.length == 0){
				prnt.items.push(Object.keys(prnt.data[0]))
				for(var i in prnt.data){
					var item = Object.values(prnt.data[i])
					prnt.items.push(item)
				}
			}
			prnt.col_w = {}
			for(var row in prnt.items){
				for(var col in prnt.items[row]){
					const str_len = (prnt.items[row][col].length *1.6)
					if(!prnt.col_w[col]) prnt.col_w[col] = 0
					if(prnt.col_w[col] < str_len) prnt.col_w[col] = str_len
				}
			}
			console.log(prnt.col_w)

			for(var row in prnt.items){
				for(var col in prnt.items[row]){
					const str_len = prnt.items[row][col].length
					prnt.items[row][col] = new bttn2D({
						prnt,
						family:"Courier New",
						font_color:colors.font_light,
						color:row==0?colors.font_dark:[colors.window,colors.glass_terminal][row%2],
						line:1,
						strk:colors.glass_blue,
						txt:prnt.items[row][col],
						h:10,
						w:prnt.col_w[col]+2,
						onTch_U:attr.onTch_U?(attr.onTch_U):(function(){console.log(this)})
					})
				}
			}
			return(prnt.items)
			}
		)
		this.items = this.attr.init?.(this)
		this.init = this.attr?.init


		if(this.items){
			const row = this.items.length
			var last_y = 0
			for(let i in this.items){
				const col = this.items[i].length
				var last_x = 0
				var max_h = 0
				for(let j in this.items[i]){
					var obj = this.items[i][j]
					// console.log(obj.attr.h)
					obj._h = (obj.attr.h?obj.attr.h:100/row)
					obj._w = (obj.attr.w?obj.attr.w:100/col)
					obj.pvt = [0,0]
					obj.pos = new vec3D(last_x,last_y,0)
					last_x += obj._w
					max_h = obj._h>max_h?obj._h:max_h
					obj.cell_id = [eval(i),eval(j)]
					this.addChild(obj)
					// console.log(`i: ${i}, j: ${j}`,obj)
				}
				last_y += max_h
			}
			// var inner_h = this._h/(last_y+obj._h)
			// let t_h = ((stg_h*10)/this._h)
			// let r_h = (last_y+obj._h)
			// console.log((t_h*0.1)/(r_h-t_h))
			// this.scrllMx = -(((t_h*0.1)/(r_h-t_h))/2);
			// if(last_y>this._h)this.scrllMx.y = -((last_y-this._h)/this.prnt.h)
			// if(last_x>this._w)this.scrllMx.x = -((last_x-this._w-obj._w)/this.prnt.h)
		}
		return(this)
	}
	onDrag_U(){
		if(cursor.active){
			var kid = this.items[cursor.active.cell_id[0]][cursor.active.cell_id[1]]
			// console.log(kid._h)
			kid._h = cursor.active._h
			kid.attr.h = cursor.active._h
			kid._w = cursor.active._w
			kid.attr.w = cursor.active._w

			if(!this.link_cells){
				if(this.items){
					const row = this.items.length
					var last_y = 0
					for(let i in this.items){
						const col = this.items[i].length
						var last_x = 0
						var max_h = 0
						for(let j in this.items[i]){
							var obj = this.items[i][j]
							// console.log(obj.attr.h)
							obj._h = (obj.attr.h?obj.attr.h:100/row)
							obj._w = (obj.attr.w?obj.attr.w:100/col)
							obj.pvt = [0,0]
							obj.pos = new vec3D(last_x,last_y,0)
							last_x += obj._w
							max_h = obj._h>max_h?obj._h:max_h
							// this.addChild(obj)
							// console.log(`i: ${i}, j: ${j}`,obj)
						}
						last_y += max_h
					}
					// console.log(obj._h, this._h)
					this.scrllMx.y = -((last_y-this._h)/100)
				}
				return
			}

			for(var i in this.items){
				var row = this.items[i]
				for(var j in this.items[i]){
					let obj = this.items[i][j]
					if(obj.cell_id[0] == kid.cell_id[0] && obj.cell_id[1] == kid.cell_id[1])continue
					if(obj.cell_id[0] == kid.cell_id[0]){
						obj._h = cursor.active._h
						obj.attr.h = cursor.active._h
					}
					if(obj.cell_id[1] == kid.cell_id[1]){
						obj._w = cursor.active._w
						obj.attr.w = cursor.active._w
					}
				}
			}
		}

		if(this.items){
			const row = this.items.length
			var last_y = 0
			for(let i in this.items){
				const col = this.items[i].length
				var last_x = 0
				var max_h = 0
				for(let j in this.items[i]){
					var obj = this.items[i][j]
					// console.log(obj.attr.h)
					obj._h = (obj.attr.h?obj.attr.h:100/row)
					obj._w = (obj.attr.w?obj.attr.w:100/col)
					obj.pvt = [0,0]
					obj.pos = new vec3D(last_x,last_y,0)
					last_x += obj._w
					max_h = obj._h>max_h?obj._h:max_h
					// this.addChild(obj)
					// console.log(`i: ${i}, j: ${j}`,obj)
				}
				last_y += max_h
			}
			// console.log(obj._h, this.prnt.h)
			if(this.prnt){
				if(last_y>this._h)this.scrllMx.y = -((last_y-this._h)/this.prnt.h)
				if(last_x>this._w)this.scrllMx.x = -((last_x-this._w-obj._w)/this.prnt.h)
			}
				
		}
	}
	
}

// export class matrixview extends stg2D {
// 	constructor( attr = {} ) {
// 		// this.attr = attr
// 		attr.size = ( attr["size"] ) ? attr["size"] : 15;
// 		attr.color = colors.alpha;
// 		// attr.strk = colors.active;
// 		// attr.line = ( attr["line"] ) ? attr["line"] : 2;
// 		attr.w = ( attr["w"] ) ? attr["w"] : 100;
// 		attr.h = ( attr["h"] ) ? attr["h"] : 100;
// 		attr.rltv = ( attr["rltv"] != undefined ) ? attr["rltv"] : true;
		
// 		attr.scrll_lock = true
// 		super(attr)
// 		this.cell_obj = attr.cell_obj
// 		this.link_rows = true
// 		this.column = {}
// 		this.rows = {}
// 		let row_col = 1
// 		let col_row = 0
// 		for(let i in attr.items){
// 			const row = Object.keys(attr.items[i]).length
// 			row_col = (row>row_col?row:row_col)
// 		}
// 		for(let c = 0; c < row_col; c++){
// 			let col_items = []
// 			for(let j in attr.items){
// 				let cell = Object.values(attr.items[j])
// 				col_items.push(cell[c])
// 			}
// 			this.rows[c] = col_items
// 		}
// 		col_row = this.rows[0].length

// 		this.scrllMx = -0.6;
// 		// this.scrllMn = 0.6;
// 		this.scrll = 150
// 		const row_w = [50,50,50,40,40,10]
// 		for(let r in this.rows){
// 			attr.w = row_w[r]
// 			attr.indx = 0
// 			attr.h = attr.cell?attr.cell.h*col_row:100;
// 			attr.pvt=[0,0]
// 			attr.pos = new vec3D(r>0?row_w.slice(0,r).reduce((a, b) => a + b, 0):0,0,0)
// 			attr.prnt = this
// 			attr.rds = 0
// 			attr.items = this.rows[r]
// 			if(attr.cell){
// 				attr.cell.font_color = colors.font_code
// 				attr.cell.family = "Courier New"
// 			}
// 			if(this.cell_obj) attr.cell_obj = this.cell_obj[r]
// 			this.column[r] = new listview(attr)
// 			this.chld.add(this.column[r])

// 		}
// 		if(attr.cell){
// 			attr.cell.prnt = this
// 			attr.cell.color = colors.font_dark
// 			attr.cell.w = attr.w
// 			attr.cell.pvt=[0,0]
// 			attr.cell.pos = new vec3D(0,0,0)
// 			attr.cell.size = attr.size
// 			attr.cell.style = 'bold'
// 		}
// 		this.onOvr=(()=>{})
// 		if(!attr["input"]) return(this)
// 		this.input = ( attr["input"] ) ? new inputfield(attr.cell) : false;
// 		this.input.vis = false
// 		this.input.lbl.vis = false
// 		// this.input.onTch_Out = (function(){
// 		// 	if(this.active){
// 		// 		this.hide = true
// 		// 		this.toggle_select()
// 		// 	}
// 		// })
// 		return(this)
// 	}
	
// }