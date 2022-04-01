import { bttn2D } from '../__BUTTON__.js';
import { colors } from '../../__PALETTE__.js';

export class checkbox extends bttn2D {
	constructor( attr = {} ) {
		attr.font_color = ( attr["font_color"] ) ? attr["font_color"] : colors.font_light;
		attr.color = ( attr["color"] ) ? attr["color"] : colors.bg;
		attr.w = ( attr["w"] ) ? attr["w"] : 33;
		attr.h = ( attr["h"] ) ? attr["h"] : 33;
		attr.min_w = attr.w
		attr.min_h = attr.h
		attr.max_w = attr.w
		attr.max_h = attr.h
		attr.line = ( attr["line"] ) ? attr["line"] : 3;
		attr.strk = ( attr["strk"] ) ? attr["strk"] : colors.active;
		attr.size = ( attr["size"] ) ? attr["size"] : 22;
		// attr.rltv = ( attr["rltv"] != undefined ) ? attr["rltv"] : false;
		attr.rds = ( attr["rds"] ) ? attr["rds"] : 5;
		attr.txt = " ";

		attr.onTch_U = (function(){
			this.state = !this.state
			if(this.state == true){
				this.lbl.txt = "✓"
			}else{
				this.lbl.txt = " "
			}
			if(this.onChange) this.onChange()
		})

		super(attr);
		this.state = ( attr["state"] != undefined ) ? attr["state"] : false;
		this.lbl.txt = (this.state) ? "✓":" ";
		this.lbl.pvt = [0.5,0.5]
		this.onChange = ( attr["onChange"] ) ? attr["onChange"] : null;
		
		return this
	}

}
