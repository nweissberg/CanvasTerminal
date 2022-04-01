// Analista de Desenvolvimento de Sistemas
// Analist of system development
// nw00736440@techmahindra.com
// NW#$00736440@
// A908472
// 105387

const m_area = document.getElementById('mainArea')
var stg_w 	= window.innerWidth;
var stg_h = window.innerHeight;
var m_stg

let MCM = new Map();
let MOM = new Map();
let buffer_map = new Map()
var stage3D = null
var time = Date.now();
var lstT = time;
var rIntvl = 9
var rcrsv_cont = 0
var sclRs = 0
var render
var render_count = 0
var cursor
var touchpad
var post_Process = false
// let loop = null
var alert_stage = null
var db_server
var showTouchKeyboard = null
var update = 2
var worker
// console.log(eval(loadVar("dark_theme")))
var dark_theme //= eval(loadVar("dark_theme"))
var local_db
var currentAudio = null
var Howl
var user_files = null
var user_geo = null
var get_geo = false

function getTime(){
	const today = new Date()
	const h = today.getHours()
	const m = today.getMinutes()
	const s = today.getSeconds()
	if(h<10) h = "0"+h
	if(m<10) m = "0"+m
	if(s<10) s = "0"+s
	return(h + ":" + m + ":" + s);
}

var engine_volume
engine_volume = eval(loadVar("engine_volume"))
if(engine_volume == undefined) engine_volume = 1.0;

function $(element) {
  if (arguments.length > 1) {
    for (var i = 0, elements = [], length = arguments.length; i < length; i++)
      elements.push($(arguments[i]));
    return elements;
  }

  if (Object.isString(element))
    element = document.getElementById(element);
  return Element.extend(element);
}

function Sound(audioSrc){
	Howler.volume(engine_volume);
	if(audioSrc != undefined && Howl != undefined){
		var soundFile = new Howl({
			src: [audioSrc+'.mp3', audioSrc+'.ogg'],
			onload: function() {
				this.isPlaying = false;
			},
			onplay: function() {
				//this.fade(0, 1, 100)
				currentAudio = this
				this.isPlaying = true;

			},
			onpause: function(){
				this.isPlaying = false;
			},
			onend: function() {
				this.isPlaying = false;
				currentAudio = null
			}
		})
		this.sound = soundFile;
	}
	return this
	
}

var textField = document.getElementById('textField')

function* idGen(){
	let id = 1
	while(true){
		yield id
		id++
	}
}
const genID = idGen()
// console.log(genID.next().value)
function uid(){
	return genID.next().value//Date.now() + MOM.size
}

var toType = function(obj) {
	return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

function getLastValue(set){
	let value;
	for(value of set);
	return value;
}

function saveVar(n, v, t){
	try {
		if (n != undefined){
			if (typeof(Storage) !== "undefined"){
				if(t == true) {
					sessionStorage[n] = String(v);
				}else{
					localStorage[n] = String(v);
				}
			}
		}
	} catch(e) {
		console.log("Error "+e+".");
	}
}

function deleteVar(n){
	try {
		if (n != undefined){
			if (typeof(Storage) !== "undefined"){
				localStorage.removeItem(n);
			}
		}
	} catch(e) {
		console.log("Error "+e+".");
	}
}

function loadVar(n){
	try{
		if (n != undefined){
			if (typeof(Storage) !== "undefined"){
				return (localStorage[n]?localStorage[n]:sessionStorage[n]);
			}else{
				return null;
			}
		}else{
			return null;
		}
	} catch(e) {
		console.log("Error "+e+".");
		return null;
	}
}

function saveArray(n, v){
	try {
		if (n != undefined){
			if (typeof(Storage) !== "undefined"){
				localStorage[n] = JSON.stringify(v);
			}
		}
	} catch(e) {
		console.log("Error "+e+".");
	}
}

function loadArray(n){
	try{
		if (n != undefined){
			if (typeof(Storage) !== "undefined"){
				return (JSON.parse(localStorage[n]));
			}else{
				return null;
			}
		}
	} catch(e) {
		console.log("Error "+e+".");
		return null;
	}
}
var nAgt = navigator.userAgent;
console.log(nAgt)

var checkMobile = {
	Android: function() {
		return nAgt.match(/Android/i);
	},
	BlackBerry: function() {
		return nAgt.match(/BlackBerry/i);
	},
	iOS: function() {
		return nAgt.match(/iPhone|iPad|iPod/i);
	},
	Opera: function() {
		return nAgt.match(/Opera Mini/i);
	},
	Windows: function() {
		return nAgt.match(/IEMobile/i);
	},
	any: function() {
		return (checkMobile.Android() || checkMobile.BlackBerry() || checkMobile.iOS() || checkMobile.Opera() || checkMobile.Windows());
	}
};
var isMobile = checkMobile.any()

var glass_blur
glass_blur = eval(loadVar("glass_blur"))
if(glass_blur == undefined) glass_blur = !isMobile

var Clock = /*#__PURE__*/function () {
	function Clock(autoStart) {
		this.autoStart = autoStart !== undefined ? autoStart : true;
		this.startTime = 0;
		this.oldTime = 0;
		this.elapsedTime = 0;
		this.running = false;
	}

	var _proto = Clock.prototype;

	_proto.start = function start() {
		this.startTime = time;
		this.oldTime = this.startTime;
		this.elapsedTime = 0;
		this.running = true;
	};

	_proto.stop = function stop() {
		this.getElapsedTime();
		this.running = false;
		this.autoStart = false;
	};

	_proto.getElapsedTime = function getElapsedTime() {
		this.getDelta();
		return this.elapsedTime;
	};

	_proto.getDelta = function getDelta() {
		var diff = 0;

		if (this.autoStart && !this.running) {
			this.start();
			return 0;
		}

		if (this.running) {
			var newTime = time;
			diff = (newTime - this.oldTime) / 1000;
			this.oldTime = newTime;
			this.elapsedTime += diff;
		}

		return diff;
	};

	return Clock;
}();

// let dropArea = document.getElementById('mainArea');
// ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
//   dropArea.addEventListener(eventName, preventDefaults, false)
// })

// function preventDefaults (e) {
//   e.preventDefault()
//   e.stopPropagation()
//   console.log(e)
// }

var onDrop

var dropZone = document.getElementById('mainArea');

// Optional.   Show the copy icon when dragging over.  Seems to only work for chrome.
dropZone.addEventListener('dragenter', function(e) {
	// console.log(e)
	e.stopPropagation();
	e.preventDefault();
e.dataTransfer.dropEffect = 'copy';
}, false);

// Optional.   Show the copy icon when dragging over.  Seems to only work for chrome.
dropZone.addEventListener('dragover', function(e) {
	// console.log(e)
	e.stopPropagation();
	e.preventDefault();
e.dataTransfer.dropEffect = 'copy';
});

// Get file data on drop
dropZone.addEventListener('drop', function(e) {
  e.stopPropagation();
  e.preventDefault();
  var files = e.dataTransfer.files; // Array of all files
  // console.log(files)
  if(onDrop) onDrop(files)

  for (var i=0, file; file=files[i]; i++) {
    if (file.type.match(/image.*/)) {
      var reader = new FileReader();

      reader.onload = function(e2) {
        // finished reading file data.
        var img = document.createElement('img');
        img.src= e2.target.result;
        document.body.appendChild(img);
      }

      reader.readAsDataURL(file); // start reading the file data.
    }
  }
});

function startFileRead(event){
	evect.preventDefault()
	console.log(event)
	if(event != undefined){
		var files = event.dataTransfer.files
	}else{
		var files = document.getElementById('fileUpload').files
	}
	console.log(file)
	// scanFiles(files)
}

var firebase
var keyCode = "Eu4Mo0eS7aR9I"
var captcha = "30BB36DF-CAED-4B0E-B6A9-501F69F9B3EA"
var server_info = {
		apiKey: "AIzaSyCTEkPzZpwlRGenxh-5StLujSruPvfsUQU",
		authDomain: "canvasterminal.firebaseapp.com",
		databaseURL: "https://canvasterminal-default-rtdb.firebaseio.com",
		projectId: "canvasterminal",
		storageBucket: "canvasterminal.appspot.com",
		messagingSenderId: "394450738632",
		appId: "1:394450738632:web:a36f0bc4bdcc6e1e0974fd",
		measurementId: "G-94JCC841ND"
	}