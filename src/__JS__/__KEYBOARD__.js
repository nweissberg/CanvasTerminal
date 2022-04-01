import { render } from './__ENGINE__.js';
// console.log("__Load__keyboard.js__");

var passText = ""
var passCode = ""
var userText = ""
var chatValue = ""
var charStr = ""
var inputText = undefined;
var isCaps              = false;
var isUppercase         = false;
var str                 = -1;
var asd;

export class kybrd{
	constructor( attr = {} ) {
	}
}
textField.oninput=(function(e){
	if(showTouchKeyboard) showTouchKeyboard.lbl.txt = textField.value
	if(render) render()
})
textField.onkeypress = textField.oninput
textField.onpaste = textField.oninput
// textField.oninput = textField.oninput

window.addEventListener('keydown',getKeyDown,false);
window.addEventListener('keyup',getKeyUp,false);

var keyArray = []
var keyDictionary = {
	"27":"ESC",
	"7":"ESC",

	"192":"~",
	"49":"1",
	"50":"2",
	"51":"3",
	"52":"4",
	"53":"5",
	"54":"6",
	"55":"7",
	"56":"8",
	"57":"9",
	"48":"0",
	"189":"-",
	"187":"=",
	"8":"BACK",
	"46":"DEL",
	"109":"-",
	"107":"+",

	"9":"TAB",
	"81":"Q",
	"87":"W",
	"69":"E",
	"82":"R",
	"84":"T",
	"89":"Y",
	"85":"U",
	"73":"I",
	"79":"O",
	"80":"P",
	"219":"[",
	"221":"]",
	"220":"|",

	"20":"CAPS",
	"65":"A",
	"83":"S",
	"68":"D",
	"70":"F",
	"71":"G",
	"72":"H",
	"74":"J",
	"75":"K",
	"76":"L",
	"186":";",
	"222":"'",
	"13":"RETURN",
	"13":"ENTER",

	"16":"SHIFT",
	"90":"Z",
	"88":"X",
	"67":"C",
	"86":"V",
	"66":"B",
	"78":"N",
	"77":"M",
	"188":"<",
	"190":">",
	"191":"?",

	"17":"CONTROL",
	"18":"ALT",
	"91":"LEFTCOMMAND",
	"32":"SPACE",
	"93":"RIGHTCOMMAND",
	"37":"LEFT",
	"38":"UP",
	"40":"DOWN",
	"39":"RIGHT"
}
var objectDict = {}
var lastMOM = 0//MOM.size
export function getKeyListen(){
	if(MOM.size == lastMOM){
		// console.log(objectDict)
		return
	}
	objectDict = {}
	MOM.forEach( (o) => {
		try{
			// if(o.vis == true && o.hide == false){
			if(o.onKey != null) objectDict[o.name] = o
			// }	
		}catch(e){console.error(e)}
	} )
	lastMOM = MOM.size
}

export function kybrd_rst(){
	keyArray = []
}

export function getKey(code,state){
	if(typeof(code)!="object") code = [code]
	var ret = false
	for(var key in code){
		if(keyArray[code[key]] ==  state){
			ret = true
		}
		if(keyArray[code[key]] == 1){
			keyArray[code[key]] = 2
		}
	}
	if(render) render()
	return(ret)
}
var lst_key = Date.now()
function getKeyDown(e) {
	// updateRender = true
	if(Date.now() - lst_key < 22) return
	// console.log(e)
	getKeyListen()
	if(e.which == 9) {
		e.preventDefault();
		showTouchKeyboard = null
		textField.blur()
	}
	// console.log(e)
	var code = e.keyCode.toString();
	var state = 0

	if(keyDictionary[code] in keyArray == false){
		state = 1
	}
	if (keyDictionary[code] in keyArray){
		state = 2
	}
	// if(showTouchKeyboard != null && showTouchKeyboard.multiLine == false && code == 13){
	// 	e.preventDefault();
	// 	showTouchKeyboard = null
	// 	textField.blur()
	// }
	for(var k in objectDict){
		var o = objectDict[k]
		try{
			if(o.vis == true && o.hide == false){
				if(o.onKey != null) o.onKey()
			}	
		}catch(e){console.error(e)}
	}
	keyArray[keyDictionary[code]] = state
	// console.log(keyDictionary[code])
	if ( e.ctrlKey || e.metaKey ) {
		var blockedKeys = ["s", "g", "f"]
		if(blockedKeys.includes(String.fromCharCode(e.which).toLowerCase()) ){
			e.preventDefault();
		}
	}
	
	if(render) render()
	lst_key = Date.now()
}

function getKeyUp(e) {
	// updateRender = true
	for(var k in objectDict){
		var o = objectDict[k]
		try{
			if(o.vis == true && o.hide == false){
				if(o.onKey != null) o.onKey()
			}	
		}catch(e){console.error(e)}
	}
	
	var code = e.keyCode.toString();
	delete keyArray[keyDictionary[code]];

	if(render) render()
	//}
}
