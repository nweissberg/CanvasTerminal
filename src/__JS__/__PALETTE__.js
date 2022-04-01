import { color } from './__COLOR__.js';

var colors_light = {
	active: 	color(0.2,0.5,0.7,1.0),
	alpha: 		color(0.0,0.0,0.0,0.001),
	window: 	color(0.9,0.9,0.9,0.8),
	bg: 		color(0.7,0.7,0.7,0.6),
	stroke: 	color(0.8,0.85,0.9,1.0),
	stroke_light:color(0.3,0.35,0.4,1.0),
	positive: 	color(0.1,0.7,0.4,1.0),
	negative: 	color(0.8,0.3,0.2,1.0),
	sun: 		color(0.8,0.6,0.1,1.0),
	moon: 		color(0.6,0.3,0.8,1.0),
	glass_dark: color(0.8,0.8,0.8,0.333),
	glass_terminal: color(1,1,1,0.888),
	glass_light:color(0.0,0.0,0.0,0.333),
	glass_blue: color(0.0,0.3,0.5,0.333),
	font_light: color("black"),
	font_medium:color("gray"),
	font_dark: 	color("white"),
	font_code: 	color("darkgreen"),
	stage: color(1.0,1.0,1.0,1)
}
var colors_dark = {
	active: 	color(0.4,0.7,1.0,1.0),
	alpha: 		color(0.0,0.0,0.0,0.001),
	window: 	color(0.2,0.2,0.2,0.8),
	bg: 		color(0.3,0.3,0.3,0.6),
	positive: 	color(0.2,0.8,0.5,1.0),
	stroke: 	color(0.3,0.35,0.4,1.0),
	stroke_light:color(0.8,0.85,0.9,1.0),
	negative: 	color(0.8,0.4,0.3,1.0),
	sun: 		color(1.0,0.8,0.3,1.0),
	moon: 		color(0.8,0.5,1.0,1.0),
	glass_dark: color(0.1,0.1,0.1,0.333),
	glass_terminal: color(0.1,0.1,0.1,0.888),
	glass_light:color(1.0,1.0,1.0,0.333),
	glass_blue: color(0.4,0.7,1.0,0.333),
	font_light: color("white"),
	font_medium:color("gray"),
	font_dark: 	color("black"),
	font_code: 	color("lightgreen"),
	stage: color(0.25,0.25,0.3,1)
}

export var colors = {}

colors.colors_light = colors_light

colors.colors_dark = colors_dark

dark_theme = eval(loadVar("dark_theme"))
if(dark_theme == undefined) dark_theme = true

if ( dark_theme ) {
	for(var c in colors_dark){
		colors[c] = colors_dark[c].clone()
	}
}else{
	for(var c in colors_dark){
		colors[c] = colors_light[c].clone()
	}
}
