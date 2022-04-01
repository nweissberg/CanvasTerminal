
// window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

export class database{
	constructor( attr={}, v=1 ){
		this.attr = attr
		this.name = this.attr["name"] ? this.attr["name"] : "LIDB";
		this.version = this.attr["version"] ? this.attr["version"] : v;
		this.db = undefined
		const tables = this.attr["tables"] ? this.attr["tables"] : [{name:"tb",key:this.attr.key?this.attr.key:undefined}];
		return new Promise((res,rej)=>{
			if (!window.indexedDB) {
				console.warn("Browser doesn't support IndexedDB.");
			}else{
				var db_req = window.indexedDB.open(this.name, this.version);
				db_req.onupgradeneeded = (e)=>{
					this.db = e.target.result
					tables.forEach((tb)=>{
						this[tb.name] = new addTb(this.db,tb,true)
						tb.index?.forEach((i)=>{
							this[tb.name].addIndx(i)
						})
					})
				};
				db_req.onsuccess = (e)=>{
					if(this.db) res(this)
					this.db = e.target.result
					tables.forEach((tb)=>{
						this[tb.name] = new addTb(this.db,tb)
					})
					res(this)
				};
				db_req.onerror = (e)=>{
					console.error(e.target.errorCode, e.target.message)
					rej(null)
				};
			}
		})
	}
}
function addTb(db,attr={},update=false){
	this.db = db
	this.name = attr["name"]
	this.key = attr["key"]
	if(update){
		this.str = this.db.createObjectStore( this.name, {keyPath:attr["key"], autoIncrement:true} )
		this.str.transaction.onerror = (e)=>{ console.error(e.target.errorCode, e.target.message) }
		this.addIndx = (k,u=false)=>{this.str.createIndex(k,k,{unique:u}) }
	}
	this.transaction = (mode='readonly')=>{ return this.db.transaction(this.name,mode).objectStore(this.name) }
	//###########//
	//# C.R.U.D #//
	//###########//
	this.add = (data)=>{
		return new Promise((res,rej)=>{
			const trans = this.transaction('readwrite')
			const type = toType(data)
			if(type == 'array'){
				for(var i in data){
					var req = trans.add(data[i])
					if(i != data.length-1) continue
					req.onsuccess = (e)=>{ res(true) }
					req.onerror = (e)=>{ rej(false) }
				}
			}else{
				var req = trans.add(data)
				req.onsuccess = (e)=>{ res(true) }
				req.onerror = (e)=>{ rej(false) }
			}
		})
	}
	this.get = (key)=>{
		return new Promise((res,rej)=>{
			const trans = this.transaction().get(key)
			trans.onsuccess = (e)=>{ res(e.target.result) }
			trans.onerror = (e)=>{ rej(null) }
		})
	}
	this.all = ()=>{
		return new Promise((res,rej)=>{
			const trans = this.transaction().getAll()
			trans.onsuccess = (e)=>{ res(e.target.result) }
			trans.onerror = (e)=>{ rej(e.target) }
		})
	}
	this.set = (path, value)=>{
		return new Promise((res,rej)=>{
			var keys = path.split('.');
			if(keys.length == 1){
				const req = this.transaction('readwrite').put(value)
				req.onsuccess = (e)=>{ res(true) }
				req.onerror = (e)=>{ rej(false) }
				return
			}
			var k = keys.shift();
			if(parseInt(k)) k = parseInt(k)
				this.get(k).then((obj)=>{
				var schema = obj;
				if(obj == undefined) schema = {}
				var p = [...keys]
				var l = p.length;
				for(var i = 0; i < l-1; i++) {
					var e = p[i];
					if( !schema[e] ) schema[e] = {}
					schema = schema[e];
				}
				schema[p[l-1]] = value;
				const req = this.transaction('readwrite').put(obj)
				req.onsuccess = (e)=>{ res(true) }
				req.onerror = (e)=>{ rej(false) }
			})
		})
	}
	this.update = (id_key, value)=>{
		return new Promise((res,rej)=>{
			this.get(id_key).then((obj)=>{
				if(!obj){
					const req = this.transaction('readwrite').put(value)
					req.onsuccess = (e)=>{ res(value) }
					req.onerror = (e)=>{ rej(null) }
				}else{
					for(let v in value){ obj[v] = value[v] }
					const req = this.transaction('readwrite').put(obj)
					req.onsuccess = (e)=>{ res(obj) }
					req.onerror = (e)=>{ rej(null) }
				}
			}).catch((e)=>{
				rej(e)
			})
		})
	}
	this.del = (key)=>{
		return new Promise((res,rej)=>{
			const trans = this.transaction('readwrite').delete(key)
			trans.onsuccess = (e)=>{ res(true) }
			trans.onerror = (e)=>{ rej(false) }
		})
	}
	return this
}

var toType = function(obj) {
	return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}