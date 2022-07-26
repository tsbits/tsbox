class tsbox{	
	/////////////
	// Commons //
	/////////////
	
	static ajax(params){		
		let xhr = new XMLHttpRequest();
	    	xhr.open(params.method, params.url);
	   	xhr.setRequestHeader('Content-Type', 'application/json');
	 	xhr.onload = function(){
			let response;

			if(xhr.status === 200 ){
				response = JSON.parse(xhr.responseText);

		    		if(params.success){
		    			params.success(response);
		    		}
			}
	        	else if(xhr.status !== 200){
				response = {'status': 'error', 'code': xhr.status};

		    		if(params.error){
		    			params.error(response);
		    		}
	        	}
	    	};

		xhr.send(JSON.stringify(params.data));
	}
	
	/*
		// Usage
		ajax({
			method: "POST",
			url: "https://url.ext/path/to/endpoint/to/reach",
			data: {
				username: "username",
				password: "s3cureP4sSW0rD!!!"
			},
			success: function(r){
				console.log(r);
			}
		});
	*/
	
	///////////
	// Maths //
	///////////

	static distanceBetween(p1x, p1y, p2x, p2y){
		return Math.hypot(p1x - p2x, p1y - p2y);
	}

	static dot(v1, v2){
		return (v1[0] * v2[0]) + (v1[1] * v2[1]);
	}

	// Collisions
	static collisionPointCircle(px, py, cx, cy, cr){
		return ( tsbox.distanceBetween(px, py, cx, cy) <= cr );
	}

	static collisionCircleCircle(c1x, c1y, c1r, c2x, c2y, c2r){
		return ( tsbox.distanceBetween(c1x, c1y, c2x, c2y) <= c1r + c2r );
	}

	static collisionLineCircle(cx, cy, cr, p1x, p1y, p2x, p2y){
		let ac = [cx - p1x, cy - p1y];
		let ab = [p2x - p1x, p2y - p1y];
		let ab2 = tsbox.dot(ab, ab);
		let acab = tsbox.dot(ac, ab);
		let t = acab / ab2;
		t = (t < 0) ? 0 : t;
		t = (t > 1) ? 1 : t;
		let h = [(ab[0] * t + p1x) - cx, (ab[1] * t + p1y) - cy];
		let h2 = tsbox.dot(h, h);
		return h2 <= cr * cr;
	}

	static pointInPolygon(poly, pt){
		for(let c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i) ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y)) && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x) && (c = !c);

		return c;
	}

	// K3N cardinal curve - http://stackoverflow.com/questions/7054272/how-to-draw-smooth-curve-through-n-points-using-javascript-html5-canvas
	static smoothPath(ptsa, tension, isClosed, numOfSegments){
		tension = (typeof tension != 'undefined') ? tension : 0.5;
	    isClosed = isClosed ? isClosed : false;
	    numOfSegments = numOfSegments ? numOfSegments : 16;

	    var _pts = [], res = [], x, y, t1x, t2x, t1y, t2y, c1, c2, c3, c4, st, t, i;

	    _pts = ptsa.slice(0);

	    if (isClosed) {
	        _pts.unshift(_pts[_pts.length - 1]);
	        _pts.unshift(_pts[_pts.length - 2]);
	        _pts.unshift(_pts[_pts.length - 1]);
	        _pts.unshift(_pts[_pts.length - 2]);
	        _pts.push(_pts[0]);
	        _pts.push(_pts[1]);
	    }
	    else {
	        _pts.unshift(_pts[1]);
	        _pts.unshift(_pts[0]);
	        _pts.push(_pts[_pts.length - 2]);
	        _pts.push(_pts[_pts.length - 1]);
	    }

	    for (i=2; i < (_pts.length - 4); i+=2) {
	        for (t=0; t <= numOfSegments; t++) {

	            // calc tension vectors
	            t1x = (_pts[i+2] - _pts[i-2]) * tension;
	            t2x = (_pts[i+4] - _pts[i]) * tension;

	            t1y = (_pts[i+3] - _pts[i-1]) * tension;
	            t2y = (_pts[i+5] - _pts[i+1]) * tension;

	            // calc step
	            st = t / numOfSegments;

	            // calc cardinals
	            c1 =   2 * Math.pow(st, 3)  - 3 * Math.pow(st, 2) + 1; 
	            c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2); 
	            c3 =       Math.pow(st, 3)  - 2 * Math.pow(st, 2) + st; 
	            c4 =       Math.pow(st, 3)  -     Math.pow(st, 2);

	            // calc x and y cords with common control vectors
	            x = c1 * _pts[i]    + c2 * _pts[i+2] + c3 * t1x + c4 * t2x;
	            y = c1 * _pts[i+1]  + c2 * _pts[i+3] + c3 * t1y + c4 * t2y;

	            //store points in array
	            res.push(x);
	            res.push(y);

	        }
	    }

	    return res;
	}

	//////////////
	// Converts //
	//////////////

	static degToRad(deg){
		return deg * Math.PI / 180;
	}

	static radToDeg(rad){
		return rad * 180 / Math.PI;
	}

	////////////
	// Colors //
	////////////
	
	static randomColor(){
		let glyph = '0123456789ABCDEF'.split('');
	    let color = '#';
	    for( let i = 0; i < 6; i++ ){
	        color += glyph[ Math.round( Math.random() * 15 ) ];
	    }
	    return color;
	}

	static changeColorLuminance(color, luminance){
		let hexa = String(color).replace(/[^0-9a-f]/gi, '');

		if( hexa.length < 6 ){
			hexa = hexa[0] + hexa[0] + hexa[1] + hexa[1] + hexa[2] + hexa[2];
		}

		luminance = luminance || 0;

		let rgb = "#", c, i;
		for( i = 0; i < 3; i++ ){
			c = parseInt( hexa.substr( i * 2 , 2 ), 16 );
			c = Math.round( Math.min( Math.max( 0, c + ( c * luminance ) ), 255 ) ).toString( 16 );
			rgb += ( "00"+c ).substr( c.length );
		}

		return rgb;
	}

	static hexToRGB(hex){
		let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	    hex = hex.replace( shorthandRegex, function( m, r, g, b ){
	        return r + r + g + g + b + b;
	    } );

	    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( hex );
	    return result ? {
	        r: parseInt( result[1], 16 ),
	        g: parseInt( result[2], 16 ),
	        b: parseInt( result[3], 16 )
	    } : null;
	}

	static rgbToHex(r, g, b){
	    return "#" + tsbox.componentToHex(r) + tsbox.componentToHex(g) + tsbox.componentToHex(b);
	}

	static componentToHex(c){
	    let hex = c.toString( 16 );
	    return hex.length == 1 ? "0" + hex : hex;
	}

	static getPixelColorFromCanvas(canvas, x, y){
	    let imgData = canvas.getContext('2d').getImageData(x, y, 1, 1);
	    let red = imgData.data[0];
	    let green = imgData.data[1];
	    let blue = imgData.data[2];
	    let alpha = imgData.data[3];
	    return tsbox.rgbToHex( red, green, blue );
	}


}
