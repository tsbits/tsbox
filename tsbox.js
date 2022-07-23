class tsbox{	

	// Maths
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

	// Converts
	static degToRad(deg){
		return deg * Math.PI / 180;
	}

	static radToDeg(rad){
		return rad * 180 / Math.PI;
	}

	// Colors
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