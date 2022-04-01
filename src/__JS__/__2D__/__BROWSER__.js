
export function setFullScreen(elm_id){
	const elm_div = document.getElementById(elm_id)
	if((window.fullScreen) || (window.innerWidth == screen.width && window.innerHeight == screen.height)) {

	} else {
		if (elm_div.requestFullscreen) {
			elm_div.requestFullscreen();
		} else if (elm_div.msRequestFullscreen) {
			elm_div.msRequestFullscreen();
		} else if (elm_div.mozRequestFullScreen) {
			elm_div.mozRequestFullScreen();
		} else if (elm_div.webkitRequestFullscreen) {
			elm_div.webkitRequestFullscreen();
		}
	}
}