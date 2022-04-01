import { render } from '../../__ENGINE__.js';
import { colors } from '../../__PALETTE__.js';
import { stg2D } from '../__STAGE__.js';
import { pln2D } from '../__PLANE__.js';
import { bttn2D } from '../__BUTTON__.js';
import { vec3D } from '../../__MATH__.js';
import { matrixview } from './matrixview.js'
import { inputfield } from './inputfield.js';
import { database } from '../../__DATABASE__.js';

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
var voiceSynth = window.speechSynthesis;
var voices = [];

var first_char = /\S/;
function capitalize(s) {
	return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

export class athena extends matrixview {
	constructor( attr = {} ) {
		attr.init = (prnt=>[
			[new pln2D({
				prnt,
				h:90,
				// blur:5,
				color:colors.glass_dark
			})],
			[new inputfield({
				prnt,
				w:90,
				h:10,
				color:colors.window
			}),
			new bttn2D({
				src: './__SVG__/mic-off.svg',
				prnt,
				// rds:10,
				h:10,
				w:10,
				img_scale:5,
				color:colors.window,
				onLoad:(function(){
					this.state = false
				}),
				onTch_U:(function(){
					this.state = !this.state
					if(this.state){
						this.img.set('./__SVG__/mic.svg')
						this.set_color(colors.positive)
						this.prnt.recognition.start();
						// this.prnt.speak('Pode falar, estou te ouvindo.');
					}else{
						this.img.set('./__SVG__/mic-off.svg')
						this.set_color(colors.negative)
						this.prnt.recognition.stop();
					}
				})
			})]
		])
		super(attr)
		this.transcript = ""
		this.pitch = 1
		this.pitchValue = 1
		this.rate = 1
		this.rateValue = 1
		this.dictionary = { _id:"athena", _words:[], _phrases:[] }
		this.command = null
		
		this.reply = 0//this.dictionary._pinp[this.dictionary._pinp.length-1]

		if (voiceSynth.onvoiceschanged !== undefined) {
			voiceSynth.onvoiceschanged = this.populateVoiceList;
		}
		this.recognition = new SpeechRecognition();
		this.speechRecognitionList = new SpeechGrammarList();
		// speechRecognitionList.addFromString(grammar, 1);
		this.recognition.grammars = this.speechRecognitionList;
		this.recognition.continuous = true;
		this.recognition.lang = 'pt-BR';
		this.recognition.interimResults = true;
		this.recognition.maxAlternatives = 1;

		this.recognition.onresult = function(event) {
			var interim_transcript = '';
			for (var i = event.resultIndex; i < event.results.length; ++i) {
				if (event.results[i].isFinal) {
					this.prnt.transcript = event.results[i][0].transcript;
				} else {
					interim_transcript += event.results[i][0].transcript;
					render()
				}
			}

			this.prnt.transcript = interim_transcript==""?this.prnt.transcript:interim_transcript;
			this.prnt.transcript = this.prnt.transcript.toLowerCase()
			this.prnt.items[1][0].lbl.txt = this.prnt.transcript

			clearTimeout(this.prnt.timeout);
			if(this.prnt.transcript == "") return
			this.prnt.timeout = setTimeout(() => {
				this.onspeechend()
			}, 2000);
		}

		this.recognition.onspeechend = function() {
			// this.prnt.items[1][1].onTch_U()
			if(this.prnt.transcript[0] == " ") this.prnt.transcript = this.prnt.transcript.substring(1)

			if(this.prnt.command && this.prnt.transcript!=""){
				this.prnt.command(this.prnt.transcript,((data)=>{
					for(var k in data){
						this.prnt.process(data[k])
					}
				}))
				this.prnt.command = null
				return
			}

			if(similarText(this.prnt.transcript, "Wikipedia") >= 0.5){
				this.prnt.command = wikiSearch
				this.prnt.transcript = ""
				this.prnt.speak("O que pesquisar?")
				return
			}
			
			this.prnt.process(this.prnt.transcript)
			
			// this.stop();
			render()
		}

		this.recognition.onnomatch = function(event) {
			// diagnostic.textContent = "I didn't recognise that color.";
		}

		this.recognition.onerror = function(event) {
			this.prnt.items[1][1].onTch_U()
			switch (event.error){
				case 'no-speech':
					this.prnt.speak("Perdão... não consegui te ouvir.")
					break;
				case 'network':
					this.prnt.speak("Erro de rede.")
					break;
				default:
					this.prnt.speak("Houve um erro, verificar o console.")
					console.error('Error: ' + event.error)
			}
			render()
		}

		this.populateVoiceList();
		this.recognition.prnt = this
		return(this)
	}
	populateVoiceList() {
		voices = voiceSynth.getVoices().sort(function (a, b) {
				const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
				if ( aname < bname ) return -1;
				else if ( aname == bname ) return 0;
				else return +1;
		});

		for(let i = 0; i < voices.length ; i++) {
			var voice = voices[i].name + ' (' + voices[i].lang + ')';
			if(voices[i].default) {
				voice += ' -- DEFAULT';
			}
			// console.log(i,voice)
		}
		// console.log(voices)
	}
	query(o,k){
		return( Object.values(o).sort((a,b)=>(a[k] < b[k] ? 1 : -1)) )
	}
	process(transcript){
		var phrase = transcript.toLowerCase()
		var words = phrase.split(" ")
		var indexed = ""
		var last_w = null

		indexed = words.map(word=>{
			if(word.length){
				var i = this.dictionary._words.map(e=>e.w).indexOf(word)
				if( i == -1 ){
					i = Object.keys(this.dictionary._words).length
					this.dictionary._words.push({w:word,c:0,n:[],l:[]})
				}
				this.dictionary._words[i].c += 1
				if(last_w){
					if(this.dictionary._words[i].l.indexOf(last_w) == -1) {
						this.dictionary._words[i].l.push(last_w)
					}
					if(this.dictionary._words[last_w].n.indexOf(i) == -1){
						this.dictionary._words[last_w].n.push(i)
					}
				}
				last_w = i
				return i
			}
		}).join(" ")
		
		var pi = this.dictionary._phrases.indexOf(indexed)
		if(pi == -1){
			pi = this.dictionary._phrases.length
			this.dictionary._phrases.push(indexed)
		}
		

		var reply_buff = indexed.split(" ").map(s=>{
			// console.log(this.dictionary._words[s].w)
			// if(this.dictionary._words[s].p.indexOf(pi) == -1){
			// 	this.dictionary._words[s].p.push(pi)
			// }
			return {i:s, c:this.dictionary._words[s]?.c}
		})
		// console.log(reply_buff)
		var answer = ""
		if(reply_buff){
			var reply = this.query(reply_buff,"c").map(e=>e.i)
			var next_w = null
			for(var ri in reply){
				if(!next_w) next_w = this.dictionary._words[ri]
				if(!next_w || next_w.n.length == 0) {
					next_w = null
					continue
				}
				while(next_w.n.length > 0){
					var i = Math.floor(Math.random()*next_w.n.length)
					answer += next_w.n[i] + " "
					next_w = this.dictionary._words[next_w.n[i]]
				}
			}
		}
		var similarity = this.recall(this.idx_txt(answer))
		console.log(similarity)

		if(similarity.id) this.speak(this.idx_txt(this.dictionary._phrases[similarity.id]))

		local_db.tb.update("athena",this.dictionary)
		this.transcript = ""
	}
	
	idx_txt(indexed){
		if(!indexed)return("")
		return indexed.split(" ").map(i=>{
			if(i.length==0)return("")
			return this.dictionary._words[i].w
		}).join(" ")
	}

	recall(transcript){
		console.log(transcript)
		let maxsim = {max:0.11,id:null}
		for(let p in this.dictionary._phrases){
			let testsim = {max:similarText(transcript, this.idx_txt(this.dictionary._phrases[p])), id:p}
			if(testsim.max > maxsim.max && testsim.max < 1 ) maxsim = testsim
		}
		return(maxsim)
	}

	speak(inputTxt){
		if (voiceSynth.speaking || inputTxt == "") {
			// console.error('speechSynthesis.speaking');
			return;
		}
		console.warn(inputTxt)
		if (inputTxt !== '') {
		var utterThis = new SpeechSynthesisUtterance(inputTxt);
		utterThis.onend = (event)=>{
			// console.log('SpeechSynthesisUtterance.onend');
			// this.recognition.start()
		}
		utterThis.onerror = function (event) {
			console.error('SpeechSynthesisUtterance.onerror');
		}
		// console.log(voices)
		for(let i = 0; i < voices.length ; i++) {
			if(voices[i].lang === this.recognition.lang) {
				// console.log(voices[i].lang)
				utterThis.voice = voices[i];
				break;
			}
		}
		utterThis.pitch = this.pitch;
		utterThis.rate = this.rate;
		voiceSynth.speak(utterThis);
		}
	}
}

var similarText = function(s1, s2){

	function intersect(arr1, arr2) {
			var r = [], o = {}, l = arr2.length, i, v;
			for (i = 0; i < l; i++) {
					o[arr2[i]] = true;
			}
			l = arr1.length;
			for (i = 0; i < l; i++) {
					v = arr1[i];
					if (v in o) {
							r.push(v);
					}
			}
			return r;
	}

	var pairs = function(s){
			// Get an array of all pairs of adjacent letters in a string
			var pairs = [];
			for(var i = 0; i < s.length - 1; i++){
					pairs[i] = s.slice(i, i+2);
			}
			return pairs;
	}

	var similarity_num = 2 * intersect(pairs(s1), pairs(s2)).length;
	var similarity_den = pairs(s1).length + pairs(s2).length;
	var similarity = similarity_num / similarity_den;
	return similarity;
};

function stripHtml(html)
{
   let tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

function normalize(obj){
	const len = Object.values(obj).length
	for(let k in obj){
		obj[k] = obj[k]/len
	}
}

function wikiSearch(transcript,callback){
	var xhrObject = new XMLHttpRequest();
	xhrObject.onreadystatechange = function() {
	  if (xhrObject.readyState === 4 && xhrObject.status === 200) {
	  	const results	= Object.values(JSON.parse(xhrObject.responseText).query.pages)[0]
	  	callback(stripHtml(results.extract).split("\n")[0].split(";").join('.').split('.').filter(String).map(line=>line.replaceAll(/[^a-z A-Z à-ú]/g,"")))
    }
    // else{
    // 	console.error(xhrObject.status)
    // }
	};

	xhrObject.open(
	  "GET", `https://pt.wikipedia.org/w/api.php?action=query&prop=extracts&origin=*&titles=${transcript}&format=json&redirects=true`, true
	);
	xhrObject.setRequestHeader('Content-Type', 'application/json');
	xhrObject.send();
	
}
// worker.postMessage({command:"trainTF", number:5})
// function lernLinear(){
// 	const model = tf.sequential();
// 	model.add(tf.layers.dense({units: 1, inputShape: [1]}));

// 	// Prepare the model for training: Specify the loss and the optimizer.
// 	model.compile({
// 		loss: 'meanSquaredError',
// 		optimizer: 'sgd'
// 	});

// 	// Generate some synthetic data for training.
// 	const xs = tf.tensor2d([0, 1, 2, 3, 4], [5, 1]);
// 	const ys = tf.tensor2d([-1, 1, 3, 5, 7], [5, 1]);

// 	// Train the model using the data.
// 	model.fit(xs, ys,{ epochs:500 }).then(() => {
// 		// Use the model to do inference on a data point the model hasn't seen before:
// 		// Open the browser devtools to see the output
// 		const output = model.predict(tf.tensor2d([6], [1, 1]));
// 		console.log(Array.from(output.dataSync())[0])
// 	});
// }

// lernLinear()

// var colors = [ 'aqua' , 'azure' , 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral', 'crimson', 'cyan', 'fuchsia', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'indigo', 'ivory', 'khaki', 'lavender', 'lime', 'linen', 'magenta', 'maroon', 'moccasin', 'navy', 'olive', 'orange', 'orchid', 'peru', 'pink', 'plum', 'purple', 'red', 'salmon', 'sienna', 'silver', 'snow', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'white', 'yellow'];
// var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'


