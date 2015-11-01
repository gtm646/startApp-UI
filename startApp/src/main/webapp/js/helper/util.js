var HACK = HACK || {};
HACK.Resizer = {
	doc : (parent || window).document.documentElement,
	getImgWidth : function() {
		var w = this.doc.clientWidth;
		var h = this.doc.clientHeight;
		return (w <= h * 4 / 3) ? w : Math.round(h * 4 / 3);
	},
	getImgHeight : function() {
		var w = this.doc.clientWidth;
		var h = this.doc.clientHeight;
		return (w <= h * 5 / 4) ? Math.round(w * 4 / 5) : h;
	},
	onResize : function() {
		var app = document.body;
		if (app !== undefined && this.doc.clientWidth !== undefined) {
			var w = this.getImgWidth();
			var h = this.getImgHeight();
			var scaleX = w / app.clientWidth;
			var scaleY = h / app.clientHeight;
			var offsetX = Math.round(Math.max(0, (this.doc.clientWidth - w) / 2));
			app.style['transform-origin'] = app.style['-webkit-transform-origin'] = '0 0';
			app.style['transform'] = app.style['-webkit-transform'] = 'scale(' + scaleX + ',' + scaleY + ')';
			app.style['margin-left'] = offsetX + 'px';
		}
	}
}