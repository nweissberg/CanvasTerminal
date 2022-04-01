! function(a, n) {
	"function" == typeof define && define.amd ? define([], n(window, null)) : "object" == typeof exports ? module.exports = n(null, require("fs")) : a.codegrid = n(a, null)
}(this, function(a, n) {
	var e, i, o, t = "./__JS__/tiles/",
		r = "worldgrid.json",
		l = 5,
		s = [9, 13],
		d = {},
		u = {};

	function c(a, n) {
		return Math.floor(((a + 180) / 360 % 1 + 1) % 1 * Math.pow(2, n))
	}
	i = function(a, n, i, o) {
		var t, r, l, s, d, u, M = {},
			g = 0;
		if (M.x = a, M.y = n, M.zoom = i, !o.hasOwnProperty("grid") || !o.hasOwnProperty("keys")) return console.warn("Error in creating grid - no grid/keys attribute"), null;

		function h(a) {
			return a >= 93 && a--, a >= 35 && a--, a - 32
		}

		function p(a) {
			return a % 1 == 0
		}
		return t = o.grid, r = o.keys, o.hasOwnProperty("data") && (l = o.data), g = o.grid.length, s = Math.round(Math.log(g) / Math.log(2)) + i, d = a * Math.pow(2, s - i), u = n * Math.pow(2, s - i), M.getCode = function(a, n, i) {
			var o = c(n, s) - d,
				M = S(a, s) - u;
			if (!p(o) || !p(M) || o < 0 || M < 0 || o >= g || M >= g) return console.warn("Error in arguments to retrieve grid"), void i("Error in input coordinates: out of range");
			var m = function(a, n) {
				var i = t[n],
					o = i.length;
				if (o > 1 && o < 4) {
					var s = parseInt(i);
					if (s.isNaN || s < 0 || s >= g) return console.warn("Error in decoding compressed grid"), null;
					o = (i = t[s]).length
				}
				var d = 0;
				if (o === g) d = i.charCodeAt(a);
				else if (1 === o) d = i.charCodeAt(0);
				else
					for (var u = 0, c = a; u < o - 1; u += 2)
						if ((c -= h(i.charCodeAt(u + 1))) < 0) {
							d = i.charCodeAt(u);
							break
						} var M = h(d);
				if (!M.isNaN && r.length > M) {
					var S = r[M];
					if ("" === S) return {};
					if (void 0 === l) {
						if (e.hasOwnProperty(S)) return e[S]
					} else if (l.hasOwnProperty(S)) return l[S]
				}
				return console.warn("Error in decoding grid data."), null
			}(o, M);
			if (null !== m) {
				var C = "None";
				return m.hasOwnProperty("code") && (C = m.code, m.hasOwnProperty("subcode") && (C = C + ":" + m.subcode)), void i(null, C)
			}
			i("Error reading geocode data")
		}, M
	}, o = function(a) {
		var n, e = {},
			r = [],
			s = a[0];

		function u(a, n, e) {
			for (var i = 0; i < r.length; i++)
				if (r[i].x === a && r[i].y === n) return void e(null, r[i]);
			! function(a, n, e) {
				var i = Math.floor(a / Math.pow(2, s - l)),
					o = Math.floor(n / Math.pow(2, s - l));
				if (void 0 !== d[i] && void 0 !== d[i][o] && void 0 !== d[i][o][s]) return void M(a, n, d[i][o][s], e);
				g(t + i.toString() + "/" + o.toString() + ".json", function(t, r) {
					return t ? (e("Grid data loading error."), console.warn("Error loading grid tile data: " + t)) : void 0 === r[s] ? (e("Zoom level " + s.toString() + " not in loaded data."), console.warn("Zoom level " + s.toString() + " not in loaded data.")) : (M(a, n, r[s], e), void 0 === d[i] && (d[i] = {}), void(d[i][o] = r))
				})
			}(a, n, function(a, n) {
				if (!a) return r.push(n), void e(null, n);
				e(a)
			})
		}

		function M(a, n, e, o) {
			return void 0 === e[a] || void 0 === e[a][n] ? (o("Grid tile not found in loaded data."), console.warn("Grid tile " + s.toString() + "/" + a.toString() + "/" + n.toString() + " not found in loaded data.")) : (o(null, i(a, n, s, e[a][n])), null)
		}
		return a.length > 1 && (n = o(a.slice(1))), e.getCode = function(a, e, i) {
			u(c(e, s), S(a, s), function(o, t) {
				o ? i("Error getting grid data: " + o) : t.getCode(a, e, function(o, t) {
					o ? i(o, t) : "*" === t ? n.getCode(a, e, i) : i(o, t)
				})
			})
		}, e
	}, u.CodeGrid = function(l, d) {
		var u, c, M = {},
			S = !1,
			h = !0,
			p = [];

		function m(a) {
			e = a.data, null !== (c = i(0, 0, 0, a)) && (S = !0), h = !1
		}
		return l ? t = l : "undefined" != typeof __dirname && n.readFile && (t = __dirname + "/" + t), a || n.readFile || !window || (a = window), d ? m(d) : g(t + r, function(a, n) {
			if (a) return console.warn("Error loading geocoding data: " + a);
			var e;
			for (m(n); e = p.shift();) M.getCode(e[0], e[1], e[2]);
			return null
		}), u = o(s), M.getCode = function(a, n, e) {
			if (!S) return h ? void p.push([a, n, e]) : (console.warn("Error : grid not initialized."), void e("Error: grid not initialized."));
			c.getCode(a, n, function(i, o) {
				i ? e(i, o) : "*" === o ? u.getCode(a, n, e) : e(i, o)
			})
		}, M
	};
	var M = Math.atan((Math.exp(Math.PI) - Math.exp(-Math.PI)) / 2) / Math.PI * 180;

	function S(a, n) {
		return Math.abs(a) >= M ? -1 : Math.floor((1 - Math.log(Math.tan(a * Math.PI / 180) + 1 / Math.cos(a * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, n))
	}

	function g(e, i) {
		if (a)
			if (a.XMLHttpRequest && "undefined" != typeof JSON) {
				var o = new XMLHttpRequest;
				o && (o.open("GET", e, !0), o.setRequestHeader("X-Requested-With", "XMLHttpRequest"), o.setRequestHeader("Content-type", "application/json"), o.onreadystatechange = function() {
					if (4 === o.readyState && 200 === o.status) {
						var a = JSON.parse(o.responseText);
						i(null, a)
					} else 4 === o.readyState && i("HTTP request returned " + o.status.toString())
				}, o.send())
			} else i("JSON request not supported.");
		else n && n.readFile(e, function(a, n) {
			if (a) "ENOENT" === a.code ? (console.warn("File " + e + " not found."), i("File " + e + " not found.")) : (console.warn(a.message), i(a.message));
			else {
				var o = JSON.parse(n);
				i(null, o)
			}
		})
	}
	return u
});
var getJSON = function(a, n) {
		var e = new XMLHttpRequest;
		e.open("get", a, !0), e.responseType = "json", e.onload = function() {
			var a = e.status;
			200 == a ? n(null, e.response) : n(a)
		}, e.send()
	},
	userip = null,
	grid = codegrid.CodeGrid(),
	geoOptions = {
		enableHighAccuracy: !0,
		maximumAge: 5e4,
		timeout: 5e4
	},
	showMap = !0,
	map, hash, grid;

function openGPS(getUser){
	for (key in server.users) {
		if(server.users[key].name.split(' ')[0] == getUser || server.users[key].email == getUser || key == getUser){
			window.open('https://maps.google.com/maps?layer=c&cbll=' + server.users[key].gps.lat+","+server.users[key].gps.lng);
		}
	}
}
function getGeoLocation() {
	navigator.geolocation ? navigator.geolocation.getCurrentPosition(showPosition, showError, geoOptions) : showError("try_ip")
}

function showPosition(a) {
	grid.getCode(a.coords.latitude, a.coords.longitude, function(n, e) {
		var i;
		i = n || {
			country: e.toUpperCase(),
			lat: a.coords.latitude,
			lng: a.coords.longitude
		}, locationDic = i, "object" == toType(locationDic) && ($.getJSON("https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=" + locationDic.lat + "&lon=" + locationDic.lng, function(a) {
			var n = JSON.parse(JSON.stringify(a, null, 2));
			locationDic.city = n.address.city, locationDic.state = n.address.state, 1 == showMap && (map = addGlobe2D({
				r_position: Vector2D(0, .2),
				r_width: .2,
				r_height: .2,
				maxWidth: 150,
				maxHeight: 150,
				minWidth: 150,
				minHeight: 150,
				radius: 75,
				locationDic: locationDic,
				zoom: 0
			}), myObjectDictionary.stage_frame_Profile.objects.push(map))
		}), updateUserGPS(locationDic))
	})
}

function addGlobe2D(a) {
	return new globe2D(a)
}

function globe2D(a) {
	// this.plane = addPlane2D(a)
	// this.plane.locationDic = a.locationDic
	// console.log(a.locationDic)
	updateUserGPS(a.locationDic)
	
	// var map = new ol.Map({
	// 	target: 'map',
	// 	layers: [
	// 	new TileLayer({
	// 		source: new XYZ({
	// 		attributions: attributions,
	// 		url:
	// 			'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
	// 		}),
	// 	}) ],
	// 	view: new ol.View({
	// 		center: ol.proj.fromLonLat([a.locationDic.lng,a.locationDic.lat]),
	// 		zoom: 10,
	// 		minZoom: 1,
	// 		maxZoom: 15
	// 	})
	// });

	// this.plane.zoom = a.zoom
	// this.plane.map = null
	// this.plane.mapDiv = document.getElementById("map")
	// this.plane.update = function() {
	//	 1 == this.inView ? (null == this.map && (this.map = initmap(this.locationDic.lat, this.locationDic.lng, this.zoom)), this.mapDiv.style.top = this._y - this._h * this.pivot[1] + "px", this.mapDiv.style.left = this._x - this._w * this.pivot[0] + "px", this.mapDiv.style.width = this._w + "px", this.mapDiv.style.height = this._h + "px", this.mapDiv.style.radius = this._r + "px", this.mapDiv.style.display = "block", 1 == getKey("+", 2) && this.map.zoomIn(), 1 == getKey("-", 2) && this.map.zoomOut()) : this.mapDiv.style.display = "none"
	// }, this.plane
}

function initmap(a, n, e) {
	map = new L.Map("map", {
		keyboard: !1,
		zoomControl: !1
	});
	var i = new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
		minZoom: 0,
		maxZoom: 17,
		attribution: ""
	});
	return map.setView(new L.LatLng(a, n), e), map.addLayer(i), hash = L.hash(map), L.control.scale().addTo(map), L.marker([a, n]).addTo(map), grid = codegrid.CodeGrid(), map
}

function onMapClick(a) {
	grid.getCode(a.latlng.lat, a.latlng.lng, function(n, e) {
		var i;
		i = n || "You clicked on: " + e, popup.setLatLng(a.latlng).setContent(i).openOn(map)
	})
}

function onMapMove(a) {
	grid.getCode(a.latlng.lat, a.latlng.lng, function(a, n) {
		var e;
		e = a || "You are on: " + n, console.log(e)
	})
}

function showError(error) {
	var errorMessage;
	switch (error.code) {
		case error.PERMISSION_DENIED:
			errorMessage = "User denied the request for GeolocationDic.";
			break;
		case error.POSITION_UNAVAILABLE:
			errorMessage = "Location information is unavailable.";
			break;
		case error.TIMEOUT:
			errorMessage = "The request to get user locationDic timed out.";
			break;
		case error.UNKNOWN_ERROR:
			errorMessage = "An unknown error occurred."
	}
	// console.warn("GPS IP - Warn: " + errorMessage),
	$.getJSON("https://api.ipify.org?format=jsonp&callback=?", function(data) {
		userip = JSON.parse(JSON.stringify(data, null, 2)).ip, $.getJSON("http://www.geoplugin.net/json.gp?jsoncallback=?", function(data) {
			var info = JSON.parse(JSON.stringify(data, null, 2));
			locationDic = {
				country: info.geoplugin_countryCode,
				lat: eval(info.geoplugin_latitude),
				lng: eval(info.geoplugin_longitude)
			}, "object" == toType(locationDic) && (updateUserGPS(locationDic), 1 == showMap && (map = addGlobe2D({
				r_position: Vector2D(0, .2),
				r_width: .2,
				r_height: .2,
				maxWidth: 150,
				maxHeight: 150,
				minWidth: 150,
				minHeight: 150,
				radius: 75,
				locationDic: locationDic,
				zoom: 0
			})))
		})
	})
}

function httpGetAsync(a, n) {
	var e = new XMLHttpRequest;
	e.onreadystatechange = function() {
		4 == e.readyState && 200 == e.status && n(e.responseText)
	}, e.open("GET", a, !0), e.send(null)
}

var allCountryArray = [
		["Afghanistan", "AF", "AFG", "4", "93"],
		["Albania", "AL", "ALB", "8", "355"],
		["Algeria", "DZ", "DZA", "12", "213"],
		["American Samoa", "AS", "ASM", "16", "1-684"],
		["Andorra", "AD", "AND", "20", "376"],
		["Angola", "AO", "AGO", "24", "244"],
		["Anguilla", "AI", "AIA", "660", "1-264"],
		["Antarctica", "AQ", "ATA", "10", "672"],
		["Antigua and Barbuda", "AG", "ATG", "28", "1-268"],
		["Argentina", "AR", "ARG", "32", "54"],
		["Armenia", "AM", "ARM", "51", "374"],
		["Aruba", "AW", "ABW", "533", "297"],
		["Australia", "AU", "AUS", "36", "61"],
		["Austria", "AT", "AUT", "40", "43"],
		["Azerbaijan", "AZ", "AZE", "31", "994"],
		["Bahamas", "BS", "BHS", "44", "1-242"],
		["Bahrain", "BH", "BHR", "48", "973"],
		["Bangladesh", "BD", "BGD", "50", "880"],
		["Barbados", "BB", "BRB", "52", "1-246"],
		["Belarus", "BY", "BLR", "112", "375"],
		["Belgium", "BE", "BEL", "56", "32"],
		["Belize", "BZ", "BLZ", "84", "501"],
		["Benin", "BJ", "BEN", "204", "229"],
		["Bermuda", "BM", "BMU", "60", "1-441"],
		["Bhutan", "BT", "BTN", "64", "975"],
		["Bolivia", "BO", "BOL", "68", "591"],
		["Bonaire", "BQ", "BES", "535", "599"],
		["Bosnia and Herzegovina", "BA", "BIH", "70", "387"],
		["Botswana", "BW", "BWA", "72", "267"],
		["Bouvet Island", "BV", "BVT", "74", "47"],
		["Brazil", "BR", "BRA", "76", "55"],
		["British Indian Ocean Territory", "IO", "IOT", "86", "246"],
		["Brunei Darussalam", "BN", "BRN", "96", "673"],
		["Bulgaria", "BG", "BGR", "100", "359"],
		["Burkina Faso", "BF", "BFA", "854", "226"],
		["Burundi", "BI", "BDI", "108", "257"],
		["Cambodia", "KH", "KHM", "116", "855"],
		["Cameroon", "CM", "CMR", "120", "237"],
		["Canada", "CA", "CAN", "124", "1"],
		["Cape Verde", "CV", "CPV", "132", "238"],
		["Cayman Islands", "KY", "CYM", "136", "1-345"],
		["Central African Republic", "CF", "CAF", "140", "236"],
		["Chad", "TD", "TCD", "148", "235"],
		["Chile", "CL", "CHL", "152", "56"],
		["China", "CN", "CHN", "156", "86"],
		["Christmas Island", "CX", "CXR", "162", "61"],
		["Cocos (Keeling) Islands", "CC", "CCK", "166", "61"],
		["Colombia", "CO", "COL", "170", "57"],
		["Comoros", "KM", "COM", "174", "269"],
		["Congo", "CG", "COG", "178", "242"],
		["Democratic Republic of the Congo", "CD", "COD", "180", "243"],
		["Cook Islands", "CK", "COK", "184", "682"],
		["Costa Rica", "CR", "CRI", "188", "506"],
		["Croatia", "HR", "HRV", "191", "385"],
		["Cuba", "CU", "CUB", "192", "53"],
		["CuraÃ§ao", "CW", "CUW", "531", "599"],
		["Cyprus", "CY", "CYP", "196", "357"],
		["Czech Republic", "CZ", "CZE", "203", "420"],
		["CÃ´te d'Ivoire", "CI", "CIV", "384", "225"],
		["Denmark", "DK", "DNK", "208", "45"],
		["Djibouti", "DJ", "DJI", "262", "253"],
		["Dominica", "DM", "DMA", "212", "1-767"],
		["Dominican Republic", "DO", "DOM", "214", "1-809,1-829,1-849"],
		["Ecuador", "EC", "ECU", "218", "593"],
		["Egypt", "EG", "EGY", "818", "20"],
		["El Salvador", "SV", "SLV", "222", "503"],
		["Equatorial Guinea", "GQ", "GNQ", "226", "240"],
		["Eritrea", "ER", "ERI", "232", "291"],
		["Estonia", "EE", "EST", "233", "372"],
		["Ethiopia", "ET", "ETH", "231", "251"],
		["Falkland Islands (Malvinas)", "FK", "FLK", "238", "500"],
		["Faroe Islands", "FO", "FRO", "234", "298"],
		["Fiji", "FJ", "FJI", "242", "679"],
		["Finland", "FI", "FIN", "246", "358"],
		["France", "FR", "FRA", "250", "33"],
		["French Guiana", "GF", "GUF", "254", "594"],
		["French Polynesia", "PF", "PYF", "258", "689"],
		["French Southern Territories", "TF", "ATF", "260", "262"],
		["Gabon", "GA", "GAB", "266", "241"],
		["Gambia", "GM", "GMB", "270", "220"],
		["Georgia", "GE", "GEO", "268", "995"],
		["Germany", "DE", "DEU", "276", "49"],
		["Ghana", "GH", "GHA", "288", "233"],
		["Gibraltar", "GI", "GIB", "292", "350"],
		["Greece", "GR", "GRC", "300", "30"],
		["Greenland", "GL", "GRL", "304", "299"],
		["Grenada", "GD", "GRD", "308", "1-473"],
		["Guadeloupe", "GP", "GLP", "312", "590"],
		["Guam", "GU", "GUM", "316", "1-671"],
		["Guatemala", "GT", "GTM", "320", "502"],
		["Guernsey", "GG", "GGY", "831", "44"],
		["Guinea", "GN", "GIN", "324", "224"],
		["Guinea-Bissau", "GW", "GNB", "624", "245"],
		["Guyana", "GY", "GUY", "328", "592"],
		["Haiti", "HT", "HTI", "332", "509"],
		["Heard Island and McDonald Mcdonald Islands", "HM", "HMD", "334", "672"],
		["Holy See (Vatican City State)", "VA", "VAT", "336", "379"],
		["Honduras", "HN", "HND", "340", "504"],
		["Hong Kong", "HK", "HKG", "344", "852"],
		["Hungary", "HU", "HUN", "348", "36"],
		["Iceland", "IS", "ISL", "352", "354"],
		["India", "IN", "IND", "356", "91"],
		["Indonesia", "ID", "IDN", "360", "62"],
		["Iran, Islamic Republic of", "IR", "IRN", "364", "98"],
		["Iraq", "IQ", "IRQ", "368", "964"],
		["Ireland", "IE", "IRL", "372", "353"],
		["Isle of Man", "IM", "IMN", "833", "44"],
		["Israel", "IL", "ISR", "376", "972"],
		["Italy", "IT", "ITA", "380", "39"],
		["Jamaica", "JM", "JAM", "388", "1-876"],
		["Japan", "JP", "JPN", "392", "81"],
		["Jersey", "JE", "JEY", "832", "44"],
		["Jordan", "JO", "JOR", "400", "962"],
		["Kazakhstan", "KZ", "KAZ", "398", "7"],
		["Kenya", "KE", "KEN", "404", "254"],
		["Kiribati", "KI", "KIR", "296", "686"],
		["Korea, Democratic People's Republic of", "KP", "PRK", "408", "850"],
		["Korea, Republic of", "KR", "KOR", "410", "82"],
		["Kuwait", "KW", "KWT", "414", "965"],
		["Kyrgyzstan", "KG", "KGZ", "417", "996"],
		["Lao People's Democratic Republic", "LA", "LAO", "418", "856"],
		["Latvia", "LV", "LVA", "428", "371"],
		["Lebanon", "LB", "LBN", "422", "961"],
		["Lesotho", "LS", "LSO", "426", "266"],
		["Liberia", "LR", "LBR", "430", "231"],
		["Libya", "LY", "LBY", "434", "218"],
		["Liechtenstein", "LI", "LIE", "438", "423"],
		["Lithuania", "LT", "LTU", "440", "370"],
		["Luxembourg", "LU", "LUX", "442", "352"],
		["Macao", "MO", "MAC", "446", "853"],
		["Macedonia, the Former Yugoslav Republic of", "MK", "MKD", "807", "389"],
		["Madagascar", "MG", "MDG", "450", "261"],
		["Malawi", "MW", "MWI", "454", "265"],
		["Malaysia", "MY", "MYS", "458", "60"],
		["Maldives", "MV", "MDV", "462", "960"],
		["Mali", "ML", "MLI", "466", "223"],
		["Malta", "MT", "MLT", "470", "356"],
		["Marshall Islands", "MH", "MHL", "584", "692"],
		["Martinique", "MQ", "MTQ", "474", "596"],
		["Mauritania", "MR", "MRT", "478", "222"],
		["Mauritius", "MU", "MUS", "480", "230"],
		["Mayotte", "YT", "MYT", "175", "262"],
		["Mexico", "MX", "MEX", "484", "52"],
		["Micronesia, Federated States of", "FM", "FSM", "583", "691"],
		["Moldova, Republic of", "MD", "MDA", "498", "373"],
		["Monaco", "MC", "MCO", "492", "377"],
		["Mongolia", "MN", "MNG", "496", "976"],
		["Montenegro", "ME", "MNE", "499", "382"],
		["Montserrat", "MS", "MSR", "500", "1-664"],
		["Morocco", "MA", "MAR", "504", "212"],
		["Mozambique", "MZ", "MOZ", "508", "258"],
		["Myanmar", "MM", "MMR", "104", "95"],
		["Namibia", "NA", "NAM", "516", "264"],
		["Nauru", "NR", "NRU", "520", "674"],
		["Nepal", "NP", "NPL", "524", "977"],
		["Netherlands", "NL", "NLD", "528", "31"],
		["New Caledonia", "NC", "NCL", "540", "687"],
		["New Zealand", "NZ", "NZL", "554", "64"],
		["Nicaragua", "NI", "NIC", "558", "505"],
		["Niger", "NE", "NER", "562", "227"],
		["Nigeria", "NG", "NGA", "566", "234"],
		["Niue", "NU", "NIU", "570", "683"],
		["Norfolk Island", "NF", "NFK", "574", "672"],
		["Northern Mariana Islands", "MP", "MNP", "580", "1-670"],
		["Norway", "NO", "NOR", "578", "47"],
		["Oman", "OM", "OMN", "512", "968"],
		["Pakistan", "PK", "PAK", "586", "92"],
		["Palau", "PW", "PLW", "585", "680"],
		["Palestine, State of", "PS", "PSE", "275", "970"],
		["Panama", "PA", "PAN", "591", "507"],
		["Papua New Guinea", "PG", "PNG", "598", "675"],
		["Paraguay", "PY", "PRY", "600", "595"],
		["Peru", "PE", "PER", "604", "51"],
		["Philippines", "PH", "PHL", "608", "63"],
		["Pitcairn", "PN", "PCN", "612", "870"],
		["Poland", "PL", "POL", "616", "48"],
		["Portugal", "PT", "PRT", "620", "351"],
		["Puerto Rico", "PR", "PRI", "630", "1"],
		["Qatar", "QA", "QAT", "634", "974"],
		["Romania", "RO", "ROU", "642", "40"],
		["Russian Federation", "RU", "RUS", "643", "7"],
		["Rwanda", "RW", "RWA", "646", "250"],
		["Reunion", "RE", "REU", "638", "262"],
		["Saint Barthelemy", "BL", "BLM", "652", "590"],
		["Saint Helena", "SH", "SHN", "654", "290"],
		["Saint Kitts and Nevis", "KN", "KNA", "659", "1-869"],
		["Saint Lucia", "LC", "LCA", "662", "1-758"],
		["Saint Martin (French part)", "MF", "MAF", "663", "590"],
		["Saint Pierre and Miquelon", "PM", "SPM", "666", "508"],
		["Saint Vincent and the Grenadines", "VC", "VCT", "670", "1-784"],
		["Samoa", "WS", "WSM", "882", "685"],
		["San Marino", "SM", "SMR", "674", "378"],
		["Sao Tome and Principe", "ST", "STP", "678", "239"],
		["Saudi Arabia", "SA", "SAU", "682", "966"],
		["Senegal", "SN", "SEN", "686", "221"],
		["Serbia", "RS", "SRB", "688", "381"],
		["Seychelles", "SC", "SYC", "690", "248"],
		["Sierra Leone", "SL", "SLE", "694", "232"],
		["Singapore", "SG", "SGP", "702", "65"],
		["Sint Maarten (Dutch part)", "SX", "SXM", "534", "1-721"],
		["Slovakia", "SK", "SVK", "703", "421"],
		["Slovenia", "SI", "SVN", "705", "386"],
		["Solomon Islands", "SB", "SLB", "90", "677"],
		["Somalia", "SO", "SOM", "706", "252"],
		["South Africa", "ZA", "ZAF", "710", "27"],
		["South Georgia and the South Sandwich Islands", "GS", "SGS", "239", "500"],
		["South Sudan", "SS", "SSD", "728", "211"],
		["Spain", "ES", "ESP", "724", "34"],
		["Sri Lanka", "LK", "LKA", "144", "94"],
		["Sudan", "SD", "SDN", "729", "249"],
		["Suriname", "SR", "SUR", "740", "597"],
		["Svalbard and Jan Mayen", "SJ", "SJM", "744", "47"],
		["Swaziland", "SZ", "SWZ", "748", "268"],
		["Sweden", "SE", "SWE", "752", "46"],
		["Switzerland", "CH", "CHE", "756", "41"],
		["Syrian Arab Republic", "SY", "SYR", "760", "963"],
		["Taiwan, Province of China", "TW", "TWN", "158", "886"],
		["Tajikistan", "TJ", "TJK", "762", "992"],
		["United Republic of Tanzania", "TZ", "TZA", "834", "255"],
		["Thailand", "TH", "THA", "764", "66"],
		["Timor-Leste", "TL", "TLS", "626", "670"],
		["Togo", "TG", "TGO", "768", "228"],
		["Tokelau", "TK", "TKL", "772", "690"],
		["Tonga", "TO", "TON", "776", "676"],
		["Trinidad and Tobago", "TT", "TTO", "780", "1-868"],
		["Tunisia", "TN", "TUN", "788", "216"],
		["Turkey", "TR", "TUR", "792", "90"],
		["Turkmenistan", "TM", "TKM", "795", "993"],
		["Turks and Caicos Islands", "TC", "TCA", "796", "1-649"],
		["Tuvalu", "TV", "TUV", "798", "688"],
		["Uganda", "UG", "UGA", "800", "256"],
		["Ukraine", "UA", "UKR", "804", "380"],
		["United Arab Emirates", "AE", "ARE", "784", "971"],
		["United Kingdom", "GB", "GBR", "826", "44"],
		["United States", "US", "USA", "840", "1"],
		["United States Minor Outlying Islands", "UM", "UMI", "581", "1"],
		["Uruguay", "UY", "URY", "858", "598"],
		["Uzbekistan", "UZ", "UZB", "860", "998"],
		["Vanuatu", "VU", "VUT", "548", "678"],
		["Venezuela", "VE", "VEN", "862", "58"],
		["Viet Nam", "VN", "VNM", "704", "84"],
		["British Virgin Islands", "VG", "VGB", "92", "1-284"],
		["US Virgin Islands", "VI", "VIR", "850", "1-340"],
		["Wallis and Futuna", "WF", "WLF", "876", "681"],
		["Western Sahara", "EH", "ESH", "732", "212"],
		["Yemen", "YE", "YEM", "887", "967"],
		["Zambia", "ZM", "ZMB", "894", "260"],
		["Zimbabwe", "ZW", "ZWE", "716", "263"],
		["Aland Islands", "AX", "ALA", "248", "358"]
	],
	allCountriesDictionary = {
		AF: ["Afghanistan", "93"],
		AL: ["Albania", "355"],
		DZ: ["Algeria", "213"],
		AS: ["American Samoa", "1-684"],
		AD: ["Andorra", "376"],
		AO: ["Angola", "244"],
		AI: ["Anguilla", "1-264"],
		AQ: ["Antarctica", "672"],
		AG: ["Antigua and Barbuda", "1-268"],
		AR: ["Argentina", "54"],
		AM: ["Armenia", "374"],
		AW: ["Aruba", "297"],
		AU: ["Australia", "61"],
		AT: ["Austria", "43"],
		AZ: ["Azerbaijan", "994"],
		BS: ["Bahamas", "1-242"],
		BH: ["Bahrain", "973"],
		BD: ["Bangladesh", "880"],
		BB: ["Barbados", "1-246"],
		BY: ["Belarus", "375"],
		BE: ["Belgium", "32"],
		BZ: ["Belize", "501"],
		BJ: ["Benin", "229"],
		BM: ["Bermuda", "1-441"],
		BT: ["Bhutan", "975"],
		BO: ["Bolivia", "591"],
		BQ: ["Bonaire", "599"],
		BA: ["Bosnia and Herzegovina", "387"],
		BW: ["Botswana", "267"],
		BV: ["Bouvet Island", "47"],
		BR: ["Brazil", "55"],
		IO: ["British Indian Ocean Territory", "246"],
		BN: ["Brunei Darussalam", "673"],
		BG: ["Bulgaria", "359"],
		BF: ["Burkina Faso", "226"],
		BI: ["Burundi", "257"],
		KH: ["Cambodia", "855"],
		CM: ["Cameroon", "237"],
		CA: ["Canada", "1"],
		CV: ["Cape Verde", "238"],
		KY: ["Cayman Islands", "1-345"],
		CF: ["Central African Republic", "236"],
		TD: ["Chad", "235"],
		CL: ["Chile", "56"],
		CN: ["China", "86"],
		CX: ["Christmas Island", "61"],
		CC: ["Cocos (Keeling) Islands", "61"],
		CO: ["Colombia", "57"],
		KM: ["Comoros", "269"],
		CG: ["Congo", "242"],
		CD: ["Democratic Republic of the Congo", "243"],
		CK: ["Cook Islands", "682"],
		CR: ["Costa Rica", "506"],
		HR: ["Croatia", "385"],
		CU: ["Cuba", "53"],
		CW: ["CuraÃ§ao", "599"],
		CY: ["Cyprus", "357"],
		CZ: ["Czech Republic", "420"],
		CI: ["CÃ´te d'Ivoire", "225"],
		DK: ["Denmark", "45"],
		DJ: ["Djibouti", "253"],
		DM: ["Dominica", "1-767"],
		DO: ["Dominican Republic", "1-809,1-829,1-849"],
		EC: ["Ecuador", "593"],
		EG: ["Egypt", "20"],
		SV: ["El Salvador", "503"],
		GQ: ["Equatorial Guinea", "240"],
		ER: ["Eritrea", "291"],
		EE: ["Estonia", "372"],
		ET: ["Ethiopia", "251"],
		FK: ["Falkland Islands (Malvinas)", "500"],
		FO: ["Faroe Islands", "298"],
		FJ: ["Fiji", "679"],
		FI: ["Finland", "358"],
		FR: ["France", "33"],
		GF: ["French Guiana", "594"],
		PF: ["French Polynesia", "689"],
		TF: ["French Southern Territories", "262"],
		GA: ["Gabon", "241"],
		GM: ["Gambia", "220"],
		GE: ["Georgia", "995"],
		DE: ["Germany", "49"],
		GH: ["Ghana", "233"],
		GI: ["Gibraltar", "350"],
		GR: ["Greece", "30"],
		GL: ["Greenland", "299"],
		GD: ["Grenada", "1-473"],
		GP: ["Guadeloupe", "590"],
		GU: ["Guam", "1-671"],
		GT: ["Guatemala", "502"],
		GG: ["Guernsey", "44"],
		GN: ["Guinea", "224"],
		GW: ["Guinea-Bissau", "245"],
		GY: ["Guyana", "592"],
		HT: ["Haiti", "509"],
		HM: ["Heard Island and McDonald Mcdonald Islands", "672"],
		VA: ["Holy See (Vatican City State)", "379"],
		HN: ["Honduras", "504"],
		HK: ["Hong Kong", "852"],
		HU: ["Hungary", "36"],
		IS: ["Iceland", "354"],
		IN: ["India", "91"],
		ID: ["Indonesia", "62"],
		IR: ["Iran, Islamic Republic of", "98"],
		IQ: ["Iraq", "964"],
		IE: ["Ireland", "353"],
		IM: ["Isle of Man", "44"],
		IL: ["Israel", "972"],
		IT: ["Italy", "39"],
		JM: ["Jamaica", "1-876"],
		JP: ["Japan", "81"],
		JE: ["Jersey", "44"],
		JO: ["Jordan", "962"],
		KZ: ["Kazakhstan", "7"],
		KE: ["Kenya", "254"],
		KI: ["Kiribati", "686"],
		KP: ["Korea, Democratic People's Republic of", "850"],
		KR: ["Korea, Republic of", "82"],
		KW: ["Kuwait", "965"],
		KG: ["Kyrgyzstan", "996"],
		LA: ["Lao People's Democratic Republic", "856"],
		LV: ["Latvia", "371"],
		LB: ["Lebanon", "961"],
		LS: ["Lesotho", "266"],
		LR: ["Liberia", "231"],
		LY: ["Libya", "218"],
		LI: ["Liechtenstein", "423"],
		LT: ["Lithuania", "370"],
		LU: ["Luxembourg", "352"],
		MO: ["Macao", "853"],
		MK: ["Macedonia, the Former Yugoslav Republic of", "389"],
		MG: ["Madagascar", "261"],
		MW: ["Malawi", "265"],
		MY: ["Malaysia", "60"],
		MV: ["Maldives", "960"],
		ML: ["Mali", "223"],
		MT: ["Malta", "356"],
		MH: ["Marshall Islands", "692"],
		MQ: ["Martinique", "596"],
		MR: ["Mauritania", "222"],
		MU: ["Mauritius", "230"],
		YT: ["Mayotte", "262"],
		MX: ["Mexico", "52"],
		FM: ["Micronesia, Federated States of", "691"],
		MD: ["Moldova, Republic of", "373"],
		MC: ["Monaco", "377"],
		MN: ["Mongolia", "976"],
		ME: ["Montenegro", "382"],
		MS: ["Montserrat", "1-664"],
		MA: ["Morocco", "212"],
		MZ: ["Mozambique", "258"],
		MM: ["Myanmar", "95"],
		NA: ["Namibia", "264"],
		NR: ["Nauru", "674"],
		NP: ["Nepal", "977"],
		NL: ["Netherlands", "31"],
		NC: ["New Caledonia", "687"],
		NZ: ["New Zealand", "64"],
		NI: ["Nicaragua", "505"],
		NE: ["Niger", "227"],
		NG: ["Nigeria", "234"],
		NU: ["Niue", "683"],
		NF: ["Norfolk Island", "672"],
		MP: ["Northern Mariana Islands", "1-670"],
		NO: ["Norway", "47"],
		OM: ["Oman", "968"],
		PK: ["Pakistan", "92"],
		PW: ["Palau", "680"],
		PS: ["Palestine, State of", "970"],
		PA: ["Panama", "507"],
		PG: ["Papua New Guinea", "675"],
		PY: ["Paraguay", "595"],
		PE: ["Peru", "51"],
		PH: ["Philippines", "63"],
		PN: ["Pitcairn", "870"],
		PL: ["Poland", "48"],
		PT: ["Portugal", "351"],
		PR: ["Puerto Rico", "1"],
		QA: ["Qatar", "974"],
		RO: ["Romania", "40"],
		RU: ["Russian Federation", "7"],
		RW: ["Rwanda", "250"],
		RE: ["Reunion", "262"],
		BL: ["Saint Barthelemy", "590"],
		SH: ["Saint Helena", "290"],
		KN: ["Saint Kitts and Nevis", "1-869"],
		LC: ["Saint Lucia", "1-758"],
		MF: ["Saint Martin (French part)", "590"],
		PM: ["Saint Pierre and Miquelon", "508"],
		VC: ["Saint Vincent and the Grenadines", "1-784"],
		WS: ["Samoa", "685"],
		SM: ["San Marino", "378"],
		ST: ["Sao Tome and Principe", "239"],
		SA: ["Saudi Arabia", "966"],
		SN: ["Senegal", "221"],
		RS: ["Serbia", "381"],
		SC: ["Seychelles", "248"],
		SL: ["Sierra Leone", "232"],
		SG: ["Singapore", "65"],
		SX: ["Sint Maarten (Dutch part)", "1-721"],
		SK: ["Slovakia", "421"],
		SI: ["Slovenia", "386"],
		SB: ["Solomon Islands", "677"],
		SO: ["Somalia", "252"],
		ZA: ["South Africa", "27"],
		GS: ["South Georgia and the South Sandwich Islands", "500"],
		SS: ["South Sudan", "211"],
		ES: ["Spain", "34"],
		LK: ["Sri Lanka", "94"],
		SD: ["Sudan", "249"],
		SR: ["Suriname", "597"],
		SJ: ["Svalbard and Jan Mayen", "47"],
		SZ: ["Swaziland", "268"],
		SE: ["Sweden", "46"],
		CH: ["Switzerland", "41"],
		SY: ["Syrian Arab Republic", "963"],
		TW: ["Taiwan, Province of China", "886"],
		TJ: ["Tajikistan", "992"],
		TZ: ["United Republic of Tanzania", "255"],
		TH: ["Thailand", "66"],
		TL: ["Timor-Leste", "670"],
		TG: ["Togo", "228"],
		TK: ["Tokelau", "690"],
		TO: ["Tonga", "676"],
		TT: ["Trinidad and Tobago", "1-868"],
		TN: ["Tunisia", "216"],
		TR: ["Turkey", "90"],
		TM: ["Turkmenistan", "993"],
		TC: ["Turks and Caicos Islands", "1-649"],
		TV: ["Tuvalu", "688"],
		UG: ["Uganda", "256"],
		UA: ["Ukraine", "380"],
		AE: ["United Arab Emirates", "971"],
		GB: ["United Kingdom", "44"],
		US: ["United States", "1"],
		UM: ["United States Minor Outlying Islands", "1"],
		UY: ["Uruguay", "598"],
		UZ: ["Uzbekistan", "998"],
		VU: ["Vanuatu", "678"],
		VE: ["Venezuela", "58"],
		VN: ["Viet Nam", "84"],
		VG: ["British Virgin Islands", "1-284"],
		VI: ["US Virgin Islands", "1-340"],
		WF: ["Wallis and Futuna", "681"],
		EH: ["Western Sahara", "212"],
		YE: ["Yemen", "967"],
		ZM: ["Zambia", "260"],
		ZW: ["Zimbabwe", "263"],
		AX: ["Aland Islands", "358"]
	};