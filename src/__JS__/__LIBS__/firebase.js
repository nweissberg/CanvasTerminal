export class server{
	constructor( attr = {} ){
		if(firebase){
			this.fb = firebase
			this.fb.initializeApp(attr.config);
			//this.analytics = getAnalytics(this.fb);
			// const appCheck = firebase.appCheck();
			// appCheck.activate( '30BB36DF-CAED-4B0E-B6A9-501F69F9B3EA', true);
			this.db = this.fb.database();
			this.store = this.fb.storage();
			this.user = null
			this.onUser = attr.onUser
			this.files = []
			this.f_max = 0
			this.uploaded = []
			this.fb.auth().onAuthStateChanged((user)=>{
				if(!user) return
				this.user = user

				const user_str = JSON.stringify(user)
					const AES_TXT = Aes.Ctr.encrypt( user_str, keyCode, 256);
					saveVar("fb_user",AES_TXT)
					console.warn(user.uid)
					// this.download(`${user.uid}/files/`)
				if(this.onUser)this.onUser(user)
			})
		}else{
			this.fb = 'local'
			this.onUser = attr.onUser
			const user_txt = loadVar("fb_user")
			const decoded = Aes.Ctr.decrypt( user_txt, keyCode, 256);
			const user_obj = JSON.parse(decoded)
			console.log(user_obj)
			this.user = user_obj
			if(this.onUser)this.onUser(user_obj)
		}
		return this
	}
	login(provider,callback=(r)=>{console.log(`Login ${r.user?.displayName}`)}){
		if(provider == "google") var method = new this.fb.auth.GoogleAuthProvider();
		if(provider == "facebook") var method = new this.fb.auth.FacebookAuthProvider();
		this.fb.auth().signInWithPopup(method)
		.then((res)=>{
			this.user = res.user
			callback(res)
		}).catch((e)=>{
			console.error(e)
			this.fb.auth().signInWithRedirect(method)
			.then((res)=>{
				this.user = res.user
				callback(res)
			})
			.catch((e)=>{console.error(e)});
		});
	}
	logout(callback=()=>{console.log(`Logout ${this.user?.displayName}`)}){
		this.fb.auth().signOut()
		.then(callback())
		.catch((e)=>{console.error(e)});
	}
	new(path, data, key) {
		if(!data) return false
		
		if(key == undefined) var key = this.db.ref().child(path).push().key;
		
		var updates = {};
		updates[`/${path}/${key}`] = data;

		this.db.ref().update(updates)

		return({"key":key, "data":data})
	}
	save(path, data) {
		if(!data) return false
		return new Promise((res,rej)=>{
			this.db.ref(path).set(data).then(()=>{
				res(true)
			}).catch((e)=>{
				rej(false)
			})
		})
	}
	load(path){
		return new Promise((res,rej)=>{
			this.db.ref(path).once('value').then((data)=>{
				res(data.val())
			}).catch((e)=>{
				rej(e)
			})
		})
	}

	upload(path, files, callback, onProgress){
		var file = files
		if(files.length > 1 && this.files.length == 0){
			for (var i = 0; i < files.length; i++) {
				this.files.push(files[i])
			}
			this.f_max = files.length
			// console.log(this.files)
		}
		var file = this.files[0]

		if(!file) res(this.uploaded)
		var storageRef = this.store.ref()
		var uploadTask = storageRef.child(`${path}/${file.name}`).put(file);
		
		uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
			(snapshot) => {
				// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
				var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				onProgress?.(progress, (this.uploaded.length*100)/this.f_max)
				// console.log('Upload is ' + progress + '% done');
				// switch (snapshot.state) {
				//	 case firebase.storage.TaskState.PAUSED: // or 'paused'
				//		 console.log('Upload is paused');
				//		 break;
				//	 case firebase.storage.TaskState.RUNNING: // or 'running'
				//		 console.log('Upload is running');
				//		 break;
				// }
			}, 
			(error) => {
				// A full list of error codes is available at
				// https://firebase.google.com/docs/storage/web/handle-errors
				switch (error.code) {
					case 'storage/unauthorized':
						// User doesn't have permission to access the object
						break;
					case 'storage/canceled':
						// User canceled the upload
						break;

					// ...

					case 'storage/unknown':
						// Unknown error occurred, inspect error.serverResponse
						break;
				}
			}, () => {
				// Upload completed successfully, now we can get the download URL
				uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
				this.files.shift()
				this.uploaded.push(downloadURL)
				if(this.files.length > 0){
						// console.log(this.files)
					this.upload(path,files, callback, onProgress)
					return
				}
				// console.log('Files available at', this.uploaded);
				onProgress?.(100, (this.uploaded.length*100)/this.f_max)
				callback?.(this.uploaded)
				});
			}
		);
	}
	download(path){
		// console.log(path)
		// var listRef = this.store.ref(path)
		return this.store.ref(path).listAll()
		// .then((res) => {
		// 	res.prefixes.forEach((folderRef) => {
		// 		// All the prefixes under listRef.
		// 		// You may call listAll() recursively on them.
		// 		console.warn(folderRef)
		// 	});
		// 	res.items.forEach((itemRef) => {
		// 		// All the items under listRef.
		// 		console.log(itemRef.name)
		// 	});
		// }).catch((error) => {
		// 	console.error(error)
		// // Uh-oh, an error occurred!
		// });

	}
}