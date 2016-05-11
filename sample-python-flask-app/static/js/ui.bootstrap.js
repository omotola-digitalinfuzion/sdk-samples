/**
 * @author jcarson
 * @requires module:jQuery 2.1.4
 * @requires module:jquery-ui
 * @requires module:bootstrap 2.1.13
 * @requires module:bootstrap-select (https://silviomoreto.github.io/bootstrap-select/)
 */

 /* TODO(s)
 	* Move Number and String formatting to a more approp. file.
	* Module system to support plugging in functions like grids,
		webgl, checkboxtrees, etc.
	* Make clearer use of jquery
	* Replace all positional arguments with a more HTML-consistent
		'options' so that all values are default.  Like HTML, users
		will have to rely on firebug to debug.
	* Add common helpers:  Initialize outer container, build complex
		widgets (tree, menu, etc) using JSON...
	* Standardize style
	* Fix enumerators so they are actually enumerators and not poorly named dictionaries.
		Enumerator should relate KEY to INT.  Relating KEYs to Bootstrap class names
		is the responsbility of a behind-the-scenes map/lookup!
    * Fix Grid layout items Row and Column.  They might be working but the Grid
        this code creates has some formatting issues: inconsistent spacing between cells,
        unclear resize semantics.
 */

 // Formatted Number: http://stackoverflow.com/questions/2254185/regular-expression-for-formatting-numbers-in-javascript
 Number.prototype.format = function (){
	 return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
 };

 // String format: http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
 if (!String.prototype.format) {
   String.prototype.format = function() {
 	var args = arguments;
 	return this.replace(/{(\d+)}/g, function(match, number) {
 	  return typeof args[number] != 'undefined'
 		? args[number]
 		: match
 	  ;
 	});
   };
 }

var UI = UI || {};

UI.Element = function ( dom ) {

	this.dom = dom;

};

UI.Element.prototype = {

	setId: function ( id ) {

		this.dom.id = id;

		return this;

	},

	setClass: function ( name ) {

		this.dom.className = name;

		return this;

	},

	setStyle: function ( style, array ) {

		for ( var i = 0; i < array.length; i ++ ) {

			this.dom.style[ style ] = array[ i ];

		}

	},

	setDisabled: function ( value ) {

		this.dom.disabled = value;

		return this;

	},

	setTextContent: function ( value ) {

		this.dom.textContent = value;

		return this;

	}

}

// properties

var properties = [ 'position', 'left', 'top', 'right', 'bottom', 'width', 'height', 'border', 'borderLeft',
'borderTop', 'borderRight', 'borderBottom', 'borderColor', 'display', 'overflow', 'margin', 'marginLeft', 'marginTop', 'marginRight', 'marginBottom', 'padding', 'paddingLeft', 'paddingTop', 'paddingRight', 'paddingBottom', 'color',
'backgroundColor', 'opacity', 'fontSize', 'fontWeight', 'textAlign', 'textDecoration', 'textTransform', 'cursor', 'zIndex' ];

properties.forEach( function ( property ) {

	var method = 'set' + property.substr( 0, 1 ).toUpperCase() + property.substr( 1, property.length );

	UI.Element.prototype[ method ] = function () {

		this.setStyle( property, arguments );
		return this;

	};

} );

// events
var jqEvents = [ 'KeyUp', 'KeyDown', 'MouseOver', 'MouseOut','MouseEnter', 'Click', 'DblClick', 'Change' ];
jqEvents.forEach( function ( event ) {

	var method = 'on' + event;

	UI.Element.prototype[ method ] = function ( callback ) {
		$(this.dom)[event.toLowerCase()](callback.bind(this));

		// Store event handler for later rebind (if cb is unbound like when buttons are disabled).
		this['_$callback_' + method] = callback;
		return this;
	};

} );

// TODO:  Remove old-style events when it's clear JQuery events are wrapped properly.
// var events = [ 'KeyUp', 'KeyDown', 'MouseOver', 'MouseOut', 'Click', 'DblClick', 'Change' ];
//
// events.forEach( function ( event ) {
//
// 	var method = 'on' + event;
//
// 	UI.Element.prototype[ method ] = function ( callback ) {
//
// 		this.dom.addEventListener( event.toLowerCase(), callback.bind( this ), false );
//
// 		return this;
//
// 	};
//
// } );

/**  Generate a unique identifier for widgets
 */
UI.UUID = function(){
    var d = new Date().getTime();
	// HTML4 ID and NAME tokens *must* begin w/ a letter: [A-Za-z]
    var uuid = 'id-xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });

	return uuid;
}
UI.Container = function(fluid){
	UI.Element.call( this );

	fluid = typeof fluid !== 'undefined' ? fluid : true;

	var div = document.createElement('div');
	div.className = 'container' + ((fluid)?'-fluid':'');

	this.dom = div;
	return this;
}
UI.Container.prototype.constructor = UI.Container;
UI.Container.prototype = Object.create( UI.Element.prototype );
UI.Container.prototype.add = function () {
	for ( var i = 0; i < arguments.length; i ++ ) {
		var argument = arguments[ i ];
		if ( argument instanceof UI.Element ) {
      		this.dom.appendChild( argument.dom );
		} else {
			console.error( 'UI.Container:', argument, 'is not an instance of UI.Element.' )
		}
	}
	return this;
};

// Bootstrap 3.3.5 glyph list (extracted from CSS)
// TODO:  'value' should store bootstrap notation like glyphicon-asterisk,
//		   redo extraction.
UI.GlyphIcons = {
	"ASTERISK":{'value':'asterisk', 'index':1},
	"PLUS":{'value':'plus', 'index':2},
	"EURO":{'value':'euro', 'index':3},
	"EUR":{'value':'eur', 'index':4},
	"MINUS":{'value':'minus', 'index':5},
	"CLOUD":{'value':'cloud', 'index':6},
	"ENVELOPE":{'value':'envelope', 'index':7},
	"PENCIL":{'value':'pencil', 'index':8},
	"GLASS":{'value':'glass', 'index':9},
	"MUSIC":{'value':'music', 'index':10},
	"SEARCH":{'value':'search', 'index':11},
	"HEART":{'value':'heart', 'index':12},
	"STAR":{'value':'star', 'index':13},
	"STAR-EMPTY":{'value':'star-empty', 'index':14},
	"USER":{'value':'user', 'index':15},
	"FILM":{'value':'film', 'index':16},
	"TH-LARGE":{'value':'th-large', 'index':17},
	"TH":{'value':'th', 'index':18},
	"TH-LIST":{'value':'th-list', 'index':19},
	"OK":{'value':'ok', 'index':20},
	"REMOVE":{'value':'remove', 'index':21},
	"ZOOM-IN":{'value':'zoom-in', 'index':22},
	"ZOOM-OUT":{'value':'zoom-out', 'index':23},
	"OFF":{'value':'off', 'index':24},
	"SIGNAL":{'value':'signal', 'index':25},
	"COG":{'value':'cog', 'index':26},
	"TRASH":{'value':'trash', 'index':27},
	"HOME":{'value':'home', 'index':28},
	"FILE":{'value':'file', 'index':29},
	"TIME":{'value':'time', 'index':30},
	"ROAD":{'value':'road', 'index':31},
	"DOWNLOAD-ALT":{'value':'download-alt', 'index':32},
	"DOWNLOAD":{'value':'download', 'index':33},
	"UPLOAD":{'value':'upload', 'index':34},
	"INBOX":{'value':'inbox', 'index':35},
	"PLAY-CIRCLE":{'value':'play-circle', 'index':36},
	"REPEAT":{'value':'repeat', 'index':37},
	"REFRESH":{'value':'refresh', 'index':38},
	"LIST-ALT":{'value':'list-alt', 'index':39},
	"LOCK":{'value':'lock', 'index':40},
	"FLAG":{'value':'flag', 'index':41},
	"HEADPHONES":{'value':'headphones', 'index':42},
	"VOLUME-OFF":{'value':'volume-off', 'index':43},
	"VOLUME-DOWN":{'value':'volume-down', 'index':44},
	"VOLUME-UP":{'value':'volume-up', 'index':45},
	"QRCODE":{'value':'qrcode', 'index':46},
	"BARCODE":{'value':'barcode', 'index':47},
	"TAG":{'value':'tag', 'index':48},
	"TAGS":{'value':'tags', 'index':49},
	"BOOK":{'value':'book', 'index':50},
	"BOOKMARK":{'value':'bookmark', 'index':51},
	"PRINT":{'value':'print', 'index':52},
	"CAMERA":{'value':'camera', 'index':53},
	"FONT":{'value':'font', 'index':54},
	"BOLD":{'value':'bold', 'index':55},
	"ITALIC":{'value':'italic', 'index':56},
	"TEXT-HEIGHT":{'value':'text-height', 'index':57},
	"TEXT-WIDTH":{'value':'text-width', 'index':58},
	"ALIGN-LEFT":{'value':'align-left', 'index':59},
	"ALIGN-CENTER":{'value':'align-center', 'index':60},
	"ALIGN-RIGHT":{'value':'align-right', 'index':61},
	"ALIGN-JUSTIFY":{'value':'align-justify', 'index':62},
	"LIST":{'value':'list', 'index':63},
	"INDENT-LEFT":{'value':'indent-left', 'index':64},
	"INDENT-RIGHT":{'value':'indent-right', 'index':65},
	"FACETIME-VIDEO":{'value':'facetime-video', 'index':66},
	"PICTURE":{'value':'picture', 'index':67},
	"MAP-MARKER":{'value':'map-marker', 'index':68},
	"ADJUST":{'value':'adjust', 'index':69},
	"TINT":{'value':'tint', 'index':70},
	"EDIT":{'value':'edit', 'index':71},
	"SHARE":{'value':'share', 'index':72},
	"CHECK":{'value':'check', 'index':73},
	"MOVE":{'value':'move', 'index':74},
	"STEP-BACKWARD":{'value':'step-backward', 'index':75},
	"FAST-BACKWARD":{'value':'fast-backward', 'index':76},
	"BACKWARD":{'value':'backward', 'index':77},
	"PLAY":{'value':'play', 'index':78},
	"PAUSE":{'value':'pause', 'index':79},
	"STOP":{'value':'stop', 'index':80},
	"FORWARD":{'value':'forward', 'index':81},
	"FAST-FORWARD":{'value':'fast-forward', 'index':82},
	"STEP-FORWARD":{'value':'step-forward', 'index':83},
	"EJECT":{'value':'eject', 'index':84},
	"CHEVRON-LEFT":{'value':'chevron-left', 'index':85},
	"CHEVRON-RIGHT":{'value':'chevron-right', 'index':86},
	"PLUS-SIGN":{'value':'plus-sign', 'index':87},
	"MINUS-SIGN":{'value':'minus-sign', 'index':88},
	"REMOVE-SIGN":{'value':'remove-sign', 'index':89},
	"OK-SIGN":{'value':'ok-sign', 'index':90},
	"QUESTION-SIGN":{'value':'question-sign', 'index':91},
	"INFO-SIGN":{'value':'info-sign', 'index':92},
	"SCREENSHOT":{'value':'screenshot', 'index':93},
	"REMOVE-CIRCLE":{'value':'remove-circle', 'index':94},
	"OK-CIRCLE":{'value':'ok-circle', 'index':95},
	"BAN-CIRCLE":{'value':'ban-circle', 'index':96},
	"ARROW-LEFT":{'value':'arrow-left', 'index':97},
	"ARROW-RIGHT":{'value':'arrow-right', 'index':98},
	"ARROW-UP":{'value':'arrow-up', 'index':99},
	"ARROW-DOWN":{'value':'arrow-down', 'index':100},
	"SHARE-ALT":{'value':'share-alt', 'index':101},
	"RESIZE-FULL":{'value':'resize-full', 'index':102},
	"RESIZE-SMALL":{'value':'resize-small', 'index':103},
	"EXCLAMATION-SIGN":{'value':'exclamation-sign', 'index':104},
	"GIFT":{'value':'gift', 'index':105},
	"LEAF":{'value':'leaf', 'index':106},
	"FIRE":{'value':'fire', 'index':107},
	"EYE-OPEN":{'value':'eye-open', 'index':108},
	"EYE-CLOSE":{'value':'eye-close', 'index':109},
	"WARNING-SIGN":{'value':'warning-sign', 'index':110},
	"PLANE":{'value':'plane', 'index':111},
	"CALENDAR":{'value':'calendar', 'index':112},
	"RANDOM":{'value':'random', 'index':113},
	"COMMENT":{'value':'comment', 'index':114},
	"MAGNET":{'value':'magnet', 'index':115},
	"CHEVRON-UP":{'value':'chevron-up', 'index':116},
	"CHEVRON-DOWN":{'value':'chevron-down', 'index':117},
	"RETWEET":{'value':'retweet', 'index':118},
	"SHOPPING-CART":{'value':'shopping-cart', 'index':119},
	"FOLDER-CLOSE":{'value':'folder-close', 'index':120},
	"FOLDER-OPEN":{'value':'folder-open', 'index':121},
	"RESIZE-VERTICAL":{'value':'resize-vertical', 'index':122},
	"RESIZE-HORIZONTAL":{'value':'resize-horizontal', 'index':123},
	"HDD":{'value':'hdd', 'index':124},
	"BULLHORN":{'value':'bullhorn', 'index':125},
	"BELL":{'value':'bell', 'index':126},
	"CERTIFICATE":{'value':'certificate', 'index':127},
	"THUMBS-UP":{'value':'thumbs-up', 'index':128},
	"THUMBS-DOWN":{'value':'thumbs-down', 'index':129},
	"HAND-RIGHT":{'value':'hand-right', 'index':130},
	"HAND-LEFT":{'value':'hand-left', 'index':131},
	"HAND-UP":{'value':'hand-up', 'index':132},
	"HAND-DOWN":{'value':'hand-down', 'index':133},
	"CIRCLE-ARROW-RIGHT":{'value':'circle-arrow-right', 'index':134},
	"CIRCLE-ARROW-LEFT":{'value':'circle-arrow-left', 'index':135},
	"CIRCLE-ARROW-UP":{'value':'circle-arrow-up', 'index':136},
	"CIRCLE-ARROW-DOWN":{'value':'circle-arrow-down', 'index':137},
	"GLOBE":{'value':'globe', 'index':138},
	"WRENCH":{'value':'wrench', 'index':139},
	"TASKS":{'value':'tasks', 'index':140},
	"FILTER":{'value':'filter', 'index':141},
	"BRIEFCASE":{'value':'briefcase', 'index':142},
	"FULLSCREEN":{'value':'fullscreen', 'index':143},
	"DASHBOARD":{'value':'dashboard', 'index':144},
	"PAPERCLIP":{'value':'paperclip', 'index':145},
	"HEART-EMPTY":{'value':'heart-empty', 'index':146},
	"LINK":{'value':'link', 'index':147},
	"PHONE":{'value':'phone', 'index':148},
	"PUSHPIN":{'value':'pushpin', 'index':149},
	"USD":{'value':'usd', 'index':150},
	"GBP":{'value':'gbp', 'index':151},
	"SORT":{'value':'sort', 'index':152},
	"SORT-BY-ALPHABET":{'value':'sort-by-alphabet', 'index':153},
	"SORT-BY-ALPHABET-ALT":{'value':'sort-by-alphabet-alt', 'index':154},
	"SORT-BY-ORDER":{'value':'sort-by-order', 'index':155},
	"SORT-BY-ORDER-ALT":{'value':'sort-by-order-alt', 'index':156},
	"SORT-BY-ATTRIBUTES":{'value':'sort-by-attributes', 'index':157},
	"SORT-BY-ATTRIBUTES-ALT":{'value':'sort-by-attributes-alt', 'index':158},
	"UNCHECKED":{'value':'unchecked', 'index':159},
	"EXPAND":{'value':'expand', 'index':160},
	"COLLAPSE-DOWN":{'value':'collapse-down', 'index':161},
	"COLLAPSE-UP":{'value':'collapse-up', 'index':162},
	"LOG-IN":{'value':'log-in', 'index':163},
	"FLASH":{'value':'flash', 'index':164},
	"LOG-OUT":{'value':'log-out', 'index':165},
	"NEW-WINDOW":{'value':'new-window', 'index':166},
	"RECORD":{'value':'record', 'index':167},
	"SAVE":{'value':'save', 'index':168},
	"OPEN":{'value':'open', 'index':169},
	"SAVED":{'value':'saved', 'index':170},
	"IMPORT":{'value':'import', 'index':171},
	"EXPORT":{'value':'export', 'index':172},
	"SEND":{'value':'send', 'index':173},
	"FLOPPY-DISK":{'value':'floppy-disk', 'index':174},
	"FLOPPY-SAVED":{'value':'floppy-saved', 'index':175},
	"FLOPPY-REMOVE":{'value':'floppy-remove', 'index':176},
	"FLOPPY-SAVE":{'value':'floppy-save', 'index':177},
	"FLOPPY-OPEN":{'value':'floppy-open', 'index':178},
	"CREDIT-CARD":{'value':'credit-card', 'index':179},
	"TRANSFER":{'value':'transfer', 'index':180},
	"CUTLERY":{'value':'cutlery', 'index':181},
	"HEADER":{'value':'header', 'index':182},
	"COMPRESSED":{'value':'compressed', 'index':183},
	"EARPHONE":{'value':'earphone', 'index':184},
	"PHONE-ALT":{'value':'phone-alt', 'index':185},
	"TOWER":{'value':'tower', 'index':186},
	"STATS":{'value':'stats', 'index':187},
	"SD-VIDEO":{'value':'sd-video', 'index':188},
	"HD-VIDEO":{'value':'hd-video', 'index':189},
	"SUBTITLES":{'value':'subtitles', 'index':190},
	"SOUND-STEREO":{'value':'sound-stereo', 'index':191},
	"SOUND-DOLBY":{'value':'sound-dolby', 'index':192},
	"SOUND-5-1":{'value':'sound-5-1', 'index':193},
	"SOUND-6-1":{'value':'sound-6-1', 'index':194},
	"SOUND-7-1":{'value':'sound-7-1', 'index':195},
	"COPYRIGHT-MARK":{'value':'copyright-mark', 'index':196},
	"REGISTRATION-MARK":{'value':'registration-mark', 'index':197},
	"CLOUD-DOWNLOAD":{'value':'cloud-download', 'index':198},
	"CLOUD-UPLOAD":{'value':'cloud-upload', 'index':199},
	"TREE-CONIFER":{'value':'tree-conifer', 'index':200},
	"TREE-DECIDUOUS":{'value':'tree-deciduous', 'index':201},
	"CD":{'value':'cd', 'index':202},
	"SAVE-FILE":{'value':'save-file', 'index':203},
	"OPEN-FILE":{'value':'open-file', 'index':204},
	"LEVEL-UP":{'value':'level-up', 'index':205},
	"COPY":{'value':'copy', 'index':206},
	"PASTE":{'value':'paste', 'index':207},
	"ALERT":{'value':'alert', 'index':208},
	"EQUALIZER":{'value':'equalizer', 'index':209},
	"KING":{'value':'king', 'index':210},
	"QUEEN":{'value':'queen', 'index':211},
	"PAWN":{'value':'pawn', 'index':212},
	"BISHOP":{'value':'bishop', 'index':213},
	"KNIGHT":{'value':'knight', 'index':214},
	"BABY-FORMULA":{'value':'baby-formula', 'index':215},
	"TENT":{'value':'tent', 'index':216},
	"BLACKBOARD":{'value':'blackboard', 'index':217},
	"BED":{'value':'bed', 'index':218},
	"APPLE":{'value':'apple', 'index':219},
	"ERASE":{'value':'erase', 'index':220},
	"HOURGLASS":{'value':'hourglass', 'index':221},
	"LAMP":{'value':'lamp', 'index':222},
	"DUPLICATE":{'value':'duplicate', 'index':223},
	"PIGGY-BANK":{'value':'piggy-bank', 'index':224},
	"SCISSORS":{'value':'scissors', 'index':225},
	"BITCOIN":{'value':'bitcoin', 'index':226},
	"BTC":{'value':'btc', 'index':227},
	"XBT":{'value':'xbt', 'index':228},
	"YEN":{'value':'yen', 'index':229},
	"JPY":{'value':'jpy', 'index':230},
	"RUBLE":{'value':'ruble', 'index':231},
	"RUB":{'value':'rub', 'index':232},
	"SCALE":{'value':'scale', 'index':233},
	"ICE-LOLLY":{'value':'ice-lolly', 'index':234},
	"ICE-LOLLY-TASTED":{'value':'ice-lolly-tasted', 'index':235},
	"EDUCATION":{'value':'education', 'index':236},
	"OPTION-HORIZONTAL":{'value':'option-horizontal', 'index':237},
	"OPTION-VERTICAL":{'value':'option-vertical', 'index':238},
	"MENU-HAMBURGER":{'value':'menu-hamburger', 'index':239},
	"MODAL-WINDOW":{'value':'modal-window', 'index':240},
	"OIL":{'value':'oil', 'index':241},
	"GRAIN":{'value':'grain', 'index':242},
	"SUNGLASSES":{'value':'sunglasses', 'index':243},
	"TEXT-SIZE":{'value':'text-size', 'index':244},
	"TEXT-COLOR":{'value':'text-color', 'index':245},
	"TEXT-BACKGROUND":{'value':'text-background', 'index':246},
	"OBJECT-ALIGN-TOP":{'value':'object-align-top', 'index':247},
	"OBJECT-ALIGN-BOTTOM":{'value':'object-align-bottom', 'index':248},
	"OBJECT-ALIGN-HORIZONTAL":{'value':'object-align-horizontal', 'index':249},
	"OBJECT-ALIGN-LEFT":{'value':'object-align-left', 'index':250},
	"OBJECT-ALIGN-VERTICAL":{'value':'object-align-vertical', 'index':251},
	"OBJECT-ALIGN-RIGHT":{'value':'object-align-right', 'index':252},
	"TRIANGLE-RIGHT":{'value':'triangle-right', 'index':253},
	"TRIANGLE-LEFT":{'value':'triangle-left', 'index':254},
	"TRIANGLE-BOTTOM":{'value':'triangle-bottom', 'index':255},
	"TRIANGLE-TOP":{'value':'triangle-top', 'index':256},
	"CONSOLE":{'value':'console', 'index':257},
	"SUPERSCRIPT":{'value':'superscript', 'index':258},
	"SUBSCRIPT":{'value':'subscript', 'index':259},
	"MENU-LEFT":{'value':'menu-left', 'index':260},
	"MENU-RIGHT":{'value':'menu-right', 'index':261},
	"MENU-DOWN":{'value':'menu-down', 'index':262},
	"MENU-UP":{'value':'menu-up', 'index':263}
}

// Bootstrap GlyphIcon (wee images for buttons)
UI.Glyph = function(glyphIcon){
	UI.Element.call( this );

	glyphIcon = typeof glyphIcon !== 'undefined' ?  glyphIcon : UI.GlyphIcons.CLOUD;

	var span = document.createElement('span');
	span.className = 'glyphicon glyphicon-' + glyphIcon.value
	span.setAttribute('aria-hidden','true');

	this.dom = span;
	return this;
}
UI.Glyph.prototype.constructor = UI.Glyph;
UI.Glyph.prototype = Object.create( UI.Element.prototype );

// Bootstrap Grid System: Row
UI.Row = function(){
	UI.Element.call( this );

	var dom = document.createElement( 'div' );
	dom.className = 'row top5';

	this.dom = dom;
	return this;
}
UI.Row.prototype.constructor = UI.Row;
UI.Row.prototype = Object.create( UI.Element.prototype );

UI.Row.prototype.add = function () {
  for ( var i = 0; i < arguments.length; i ++ ) {
      var argument = arguments[ i ];
      this.dom.appendChild( argument.dom );
  }
  return this;
};

// Bootstrap Grid System: Column

UI.Column = function(width){
	UI.Element.call( this );

	var dom = document.createElement( 'div' );
	dom.className = 'col-md-' + width.toString();
	this.dom = dom;
	return this;
}
UI.Column.prototype.constructor = UI.Column;
UI.Column.prototype = Object.create( UI.Element.prototype );

UI.Column.prototype.add = function () {
  for ( var i = 0; i < arguments.length; i ++ ) {
    var argument = arguments[ i ];
    this.dom.appendChild( argument.dom );
  }
  return this;
};

// HTML Headings1-6
// TODO:  Replace integer size w/ enum.
UI.Heading = function(options){
	UI.Element.call( this );

	var options = options || {};

	options.subContent = typeof options.subContent !== 'undefined' ?  options.subContent :'';
	options.size = typeof options.size !== 'undefined' ?  options.size :'1';
	options.content = typeof options.content !== 'undefined' ?  options.content :'';

	var dom = document.createElement("h{0}".format(options.size));
	dom.innerHTML = options.content;

	if (options.subContent.length > 0){
		var span = document.createElement('small');
		span.innerHTML = options.subContent;
		dom.appendChild(span);
	}
	this.dom = dom;
	return this;
}
UI.Heading.prototype.constructor = UI.Heading;
UI.Heading.prototype = Object.create( UI.Element.prototype );


UI.TextAlignment = {
	'LEFT':{'value':'text-left','index':1},
	'CENTER':{'value':'text-center','index':2},
	'RIGHT':{'value':'text-right','index':3},
	'JUSTIFY':{'value':'text-justify','index':4},
	'NOWRAP':{'value':'text-nowrap','index':5},
	'DEFAULT':{'value':'text-left','index':6}
}
UI.TextTransformation = {
	'LOWER':{'value':'text-lowercase','index':1},
	'UPPER':{'value':'text-uppercase','index':2},
	'CAPITALIZE':{'value':'text-capitalize','index':3},
	'DEFAULT':{'value':'','index':4},
}

// Bootstrap Parapraphs
// TODO:  A lot.
UI.Typography = function(content,options){
	UI.Element.call( this );

	var options = options || {};

	options.alignment = typeof options.alignment !== 'undefined' ?  options.alignment : UI.TextAlignment.DEFAULT;
	options.transform = typeof options.transform !== 'undefined' ?  options.transform : UI.TextTransformation.DEFAULT;

	//TODO:  Typography is a sizable chunk of code, Consider
	//		 using a markdown wrapper to support:
	//		 highlight, strikethrough, underline, etc.

	var p = document.createElement('p');
	p.className = "{0} {1}".format(options.alignment.value,options.transform.value);
	p.innerHTML = content;

	this.dom = p;
	return this;
}
UI.Typography.prototype.constructor = UI.Typography;
UI.Typography.prototype = Object.create( UI.Element.prototype );

// Simplified Name
UI.Paragraph = UI.Typography;


UI.ButtonTypes = {
	'PRIMARY':{'value':'btn-primary','index':1},
	'DEFAULT':{'value':'btn-default','index':2},
	'SUCCESS':{'value':'btn-success','index':3},
	'INFO':{'value':'btn-info','index':4},
	'DANGER':{'value':'btn-danger','index':5},
	'LINK':{'value':'btn-link','index':6},
	'WARNING':{'value':'btn-warning','index':7},
}
UI.ButtonSizes = {
	'SMALL':{'value':'btn-sm','index':1},
	'DEFAULT':{'value':'','index':2},
	'LARGE':{'value':'btn-lg','index':3},
	'EXTRASMALL':{'value':'btn-xs','index':4}
}

// Bootstrap Push Button
UI.Button = function(options){
	UI.Element.call( this );

	var options = options || {}
	options.content = typeof options.content !== 'undefined' ?  options.content : '';
	options.fullWidth = typeof options.fullWidth !== 'undefined' ?  options.fullWidth : false;
	options.buttonType = typeof options.buttonType !== 'undefined' ?  options.buttonType : UI.ButtonTypes.DEFAULT;
	options.buttonSize = typeof options.buttonSize !== 'undefined' ?  options.buttonSize : UI.ButtonSizes.DEFAULT;


	var className = "btn";
	className += (options.fullWidth)?' btn-block':'';
	className += ' ' + options.buttonType.value;
	className += ' ' + options.buttonSize.value;

	var dom = document.createElement( 'div' );
	dom.className = className
	dom.setAttribute("type",'button');
	dom.innerHTML = options.content
	this.dom = dom;
	this.enabled = true;

	return this;
}
UI.Button.prototype.constructor = UI.Button;
UI.Button.prototype = Object.create( UI.Element.prototype );

UI.Button.prototype.add = function(){
	for ( var i = 0; i < arguments.length; i ++ ) {
		var argument = arguments[ i ];
		if ( argument instanceof UI.Glyph ) {
			this.dom.appendChild( argument.dom );
		} else {
			console.error( 'UI.Button:', argument, 'is not an instance of UI.Glyph.' )
		}
	}
	return this;
}
UI.Button.prototype.setDisabled = function(value){
	this.enabled = !value;
	if(value){
		$(this.dom).addClass('disabled');
		$(this.dom).prop('disabled',value);
	 	$(this.dom).off('click');
	} else {
		$(this.dom).removeClass('disabled');

		// Stored during creation of 'on<Event>'s
		$(this.dom)['click'](this['_$callback_onClick'].bind(this));
	}
	return this;
}
UI.Button.prototype.isEnabled = function(){
	return this.enabled;
}



UI.ImageShapes = {
	'ROUNDED':{'value':'img-rounded','index':1},
	'CIRCLE':{'value':'img-circle','index':2},
	'THUMBNAIL':{'value':'img-thumbnail','index':3},
	'DEFAULT':{'value':'img-rounded','index':3},
}

// Bootstrap Image
UI.Image = function(options){
	UI.Element.call( this );

	var options = options || {};
	options.source = typeof options.source !== 'undefined' ?  options.source : '';
	options.alt = typeof options.alt !== 'undefined' ?  options.alt : '';
	options.imageShape = typeof options.imageShape !== 'undefined' ?  options.imageShape : UI.ImageShapes.DEFAULT;

	var img = document.createElement('img');
	img.className = options.imageShape.value;

	this.dom = img;
	return this;
}
UI.Image.prototype.constructor = UI.Image;
UI.Image.prototype = Object.create( UI.Element.prototype );

UI.MenuBarTypes = {
    "FIXED":{'value':'navbar-fixed-top','key':1},
    "STATIC":{'value':'navbar-static-top','key':2},
    "DEFAULT":{'value':'','key':3},

}
// Bootstrap Navbar (Floating or anchored menubar).
// TODO:  Rename to Navbar
UI.Menubar = function(options){
	UI.Element.call( this );

    var options = options || {}
    options.menuBarType = typeof options.menuBarType !== 'undefined' ?  options.menuBarType : UI.MenuBarTypes.DEFAULT;

    var dom = document.createElement( 'div' );
    switch(options.menuBarType.key){
        case UI.MenuBarTypes.FIXED.key:
            //TODO:  Fixed headers need padding on top of body to account for header
            //       Either use a unique <div> id or dynamically modify css
            dom.className = 'container';
            break;
        case UI.MenuBarTypes.STATIC.key:
            dom.className = 'container';
            break;
        case UI.MenuBarTypes.DEFAULT.key:
            dom.className = 'container-fluid';
            break;

    }

    var nav = document.createElement( 'nav' );
    nav.className = 'navbar navbar-default ' + options.menuBarType.value
    nav.appendChild(dom);

    var divCollapse = document.createElement( 'div' );
    divCollapse.className = 'navbar-collapse collapse';
    dom.appendChild(divCollapse);

    //TODO:  Move to Menubar.Menu and support other navbar alignments (which are applied per-menu)
    var ul = document.createElement( 'ul' );
    ul.className = 'nav navbar-nav';
    divCollapse.appendChild(ul);

    this.dom = nav;
    this.container = ul;

    return this;
}
UI.Menubar.prototype.constructor = UI.Menubar;
UI.Menubar.prototype = Object.create( UI.Element.prototype );
UI.Menubar.prototype.add = function () {
  for ( var i = 0; i < arguments.length; i ++ ) {
      var argument = arguments[ i ];
      this.container.appendChild( argument.container );
  }
  return this;
};

UI.MenuTypes = {
	'DROPDOWN':{'value':'dropdown','key':1},
	'SINGLE':{'value':'single','key':2},
	'DEFAULT':{'value':'single','key':3}
}
UI.Menubar.Menu = function(options){
	UI.Element.call( this );

	var options = options || {};
	options.title = typeof options.title !== 'undefined' ?  options.title : '';
	options.active = typeof options.active !== 'undefined' ?  options.active : false;
	options.menuType = typeof options.menuType !== 'undefined' ?  options.menuType : UI.MenuTypes.DEFAULT;

    // TODO:  Replace w/ a menu generating factory function, switch will do in a pinch
    switch (options.menuType.key) {
        case UI.MenuTypes.DEFAULT.key:
        case UI.MenuTypes.SINGLE.key:
            var li = document.createElement( 'li' );
            li.className = ((options.active)?'active':'');


            var a = document.createElement( 'a' );
            a.setAttribute("href","#" + options.title);
            a.innerHTML = options.title;
            li.appendChild(a);

            this.dom = a;
            this.container = li;
            break;
        case UI.MenuTypes.DROPDOWN.key:
            var li = document.createElement( 'li' );
            li.className = 'dropdown';

            var a = document.createElement( 'a' );
            a.className = "dropdown-toggle"
            a.setAttribute("href","#");
            a.setAttribute("data-toggle","dropdown");
            a.setAttribute("role","button");
            a.setAttribute("aria-haspopup","true");
            a.setAttribute("aria-expanded","false");
            a.innerHTML = options.title + " ";
            li.appendChild(a);

            var span = document.createElement("span");
            span.className = "caret";
            a.appendChild(span);

            var ul = document.createElement("ul");
            ul.className = "dropdown-menu";
            li.appendChild(ul);

            this.dom = ul;
            this.container = li;
            break;
        default:
            console.log("Invalid menu type: " + options.menuType);
    }
    return this;
}
UI.Menubar.Menu.prototype.constructor = UI.Menubar.Menu;
UI.Menubar.Menu.prototype = Object.create( UI.Element.prototype );
UI.Menubar.Menu.prototype.add = function () {
  for ( var i = 0; i < arguments.length; i ++ ) {
      var argument = arguments[ i ];
      this.dom.appendChild( argument.container );
  }
  return this;
};


UI.Menubar.MenuItem = function(title){
	UI.Element.call( this );

	//TODO: Add way of creating links to anchors in the document....
    var li = document.createElement( 'li' );
    var a = document.createElement( 'a' );
    a.setAttribute("href","#"); //TODO: replace with something that doesn't append '#' to url
    a.innerHTML = title;
    li.appendChild(a);

    this.dom = a;
    this.container = li;
    return this;
}
UI.Menubar.MenuItem.prototype.constructor = UI.Menubar.MenuItem;
UI.Menubar.MenuItem.prototype = Object.create( UI.Element.prototype );

UI.Menubar.MenuSeparator = function(){
	UI.Element.call( this );

    //<li><a href="#">New</a></li>
    var li = document.createElement( 'li' );
    li.className = "divider";
    li.setAttribute("role","separator");

    this.dom = li;
    this.container = li;
    return this;
}
UI.Menubar.MenuItem.prototype.constructor = UI.Menubar.MenuItem;
UI.Menubar.MenuItem.prototype = Object.create( UI.Element.prototype );

/* Dropdown TODO:
    * clear() to remove all options
    * setTitle() to set (or remove) the dropdown header
    * Drop up option
    * multi-select support
    * style options
    * width option
    * separators
    * group options
*/
UI.DropDown = function(options){
	UI.Element.call( this );

	var self = this;
	var uuid = UI.UUID();
	var options = options || {};

	this.callback = function(value){};

	options.title = options.title || "";
	options.selectionOptions = options.selectionOptions || {};

	var div = document.createElement( 'div' );
	div.id = uuid;

	var select = document.createElement( 'select' );
	select.className = 'selectpicker';
    div.appendChild(select);

    // Don't add title attribute if title is empty or 'selectpicker()' will create a blank
    // dropdown header.
	if(options.title.length > 0)select.setAttribute("title",options.title);

	$(select).on('change', function(){
      self.callback(self.selection());
    });

	this.domContent = select;
	this.dom = div;

	for(var opt in options.selectionOptions){
		this.addOption(opt,options.selectionOptions[opt]);
	}
	this.title = options.title;

	$(this.domContent).selectpicker();
	return this;
}
UI.DropDown.prototype.constructor = UI.DropDown;
UI.DropDown.prototype = Object.create( UI.Element.prototype );

UI.DropDown.prototype.addOption = function (content,value) {
	var opt = new UI.DropDown.Option(content,value);
	this.add(opt);
	this.refresh();
	return this;
};

UI.DropDown.prototype.addOptions = function (options) {
	for(var opt in options){
		var opt = new UI.DropDown.Option(opt,options[opt]);
		this.add(opt);
	}
	this.refresh();
	return this;
};
UI.DropDown.prototype.removeOption = function (option) {
	$(this.domContent).find('[value=' + option + ']').remove();
	this.refresh();

	return this;
};
UI.DropDown.prototype.removeOptions = function () {
	for ( var i = 0; i < arguments.length; i ++ ) {
		var argument = arguments[ i ];
		$(this.domContent).find('[value=' + argument + ']').remove();
	}
	this.refresh();

	return this;
};
UI.DropDown.prototype.onChange = function(callback){
	this.callback = callback;
}

UI.DropDown.prototype.reinitialize = function(){
	$(this.domContent).selectpicker('render');
}
UI.DropDown.prototype.refresh = function(){
	$(this.domContent).selectpicker('refresh');
}
UI.DropDown.prototype.add = function () {
	for ( var i = 0; i < arguments.length; i ++ ) {
		var argument = arguments[ i ];

        if(argument instanceof UI.DropDown.Option) {
            this.domContent.appendChild( argument.dom );
        } else {
            console.error( 'UI.DropDown:', argument, 'is not an instance of UI.DropDown.Option' )
        }
	}
	return this;
};

UI.DropDown.prototype.setSelection = function (content) {
	$(this.domContent).selectpicker('val',content);
	return this;
};
UI.DropDown.prototype.selection = function () {
	var hackCheck = $(this.domContent).find("option:selected").get(0);
	// bootstrap-select doesn't have an apparent option for checking if selection is the label.
	// TODO:  Consider hooking onChange() and setting a selectionValid flag
	if(hackCheck.className === "bs-title-option") return null;

	return $(this.domContent).find("option:selected").text();
};

UI.DropDown.Option = function(content,value){
	var opt = document.createElement("option");
	var value = value || content;

	opt.innerHTML = content;
	opt.setAttribute('value',value);

	this.dom = opt;
	return this;
}
UI.DropDown.Option.prototype.constructor = UI.DropDown.Option;
UI.DropDown.Option.prototype = Object.create( UI.Element.prototype );

//

//
//
// UI.Text = function(text){
// 	UI.Element.call( this );
//
// 	var dom = document.createElement( 'p' );
// 	dom.className = 'text-left';
// 	dom.innerHTML = text;
//
// 	this.dom = dom;
// 	return this;
// }
// UI.Text.prototype.constructor = UI.Text;
// UI.Text.prototype = Object.create( UI.Element.prototype );
//
// UI.Checkbox = function(text, checked){
// 	UI.Element.call( this );
//
// 	var checked = checked || false;
//
// 	var uuid = UI.UUID();
// 	var div = document.createElement( 'div' );
// 	div.className = 'checkbox';
// 	div.id = uuid + "_outer_div";
//
// 	var lbl = document.createElement('label');
// 	lbl.id = uuid + "_label";
// 	div.appendChild(lbl);
//
// 	var a = document.createElement('input');
// 	a.setAttribute("type","checkbox");
// 	a.id = uuid + "_input";
// 	lbl.appendChild(a);
// 	lbl.innerHTML = lbl.innerHTML + text;
//
//
// 	if(checked){
// 		$(a).prop("checked", true);
// 		$(lbl).click();					//Hack way to get checkmark to show up.
// 	}
//
// 	$(div).on('change',function(){
// 		$(a).prop("checked", !$(a).prop("checked"));
// 	});
//
// 	this.dom = div;
// 	this.domContainer = a;
// 	return this;
// }
// UI.Checkbox.prototype.constructor = UI.Checkbox;
// UI.Checkbox.prototype = Object.create( UI.Element.prototype );
// UI.Checkbox.prototype.getValue = function () {
// 	return this.domContainer.checked;
//
// };
// UI.Panel = function(title){
// 	UI.Element.call( this );
//
//     var domPanel = document.createElement( 'div' );
//     domPanel.className = 'panel panel-default';
//
//     if(title !== null){
//         var domTitle = document.createElement( 'div' );
//         domTitle.className = 'panel-heading';
//         domTitle.innerHTML = title;
//         domPanel.appendChild(domTitle);
//     }
//     var domContent = document.createElement( 'div' );
//     domContent.className = 'panel-body';
//     domPanel.appendChild(domContent);
//
//     this.dom = domPanel;
//     this.domContent = domContent
//     return this;
// }
// UI.Panel.prototype.constructor = UI.Panel;
// UI.Panel.prototype = Object.create( UI.Element.prototype );
//
// UI.Panel.prototype.add = function () {
//   for ( var i = 0; i < arguments.length; i ++ ) {
//     var argument = arguments[ i ];
//     this.domContent.appendChild( argument.dom );
//   }
//   return this;
// };
//
// UI.CollapsePanel = function(title){
// 	UI.Element.call( this );
//
//     title = title || "No Title";
// 	var self = this;
//
//     var uuid = UI.UUID();
//     var domPanel = document.createElement( 'div' );
//     domPanel.className = 'panel panel-default';
//
//     var domTitle = document.createElement( 'div' );
//     domTitle.className = 'panel-heading';
//     domPanel.appendChild(domTitle);
//
//     var h4 = document.createElement('h4');
//     h4.className = "panel-title";
//     domTitle.appendChild(h4);
//
//     var a = document.createElement('a');
//     a.setAttribute("data-toggle","collapse");
//     a.setAttribute("href","#" + uuid);
//     a.innerHTML = title;
//     h4.appendChild(a);
//
//     var domCollapse = document.createElement( 'div' );
//     domCollapse.className = 'panel-collapse collapse in';
//     domCollapse.setAttribute("id",uuid);
//     domPanel.appendChild(domCollapse);
//
//     var domContent = document.createElement( 'div' );
//     domContent.className = 'panel-body';
//     domCollapse.appendChild(domContent);
//
//
//     this.dom = domPanel;
//     this.domContent = domContent;
//     this.domCollapse = domCollapse;
//     this.domToggle = a;
// 	this.onCollapsedChangeCallback = function(){}
//
// 	$(domCollapse).on('hidden.bs.collapse', function () {
// 		  self.onCollapsedChangeCallback(true);
//   	});
// 	$(domCollapse).on('shown.bs.collapse', function () {
// 		  self.onCollapsedChangeCallback(false);
// 	});
//     return this;
// }
// UI.CollapsePanel.prototype.constructor = UI.CollapsePanel;
// UI.CollapsePanel.prototype = Object.create( UI.Element.prototype );
//
// UI.CollapsePanel.prototype.add = function () {
//   for ( var i = 0; i < arguments.length; i ++ ) {
//     var argument = arguments[ i ];
//     this.domContent.appendChild( argument.dom );
//   }
//   return this;
// };
// UI.CollapsePanel.prototype.setCollapsed = function ( boolean ) {
// 	$(this.domCollapse).collapse((!boolean)?'show':'hide');
// };
// UI.CollapsePanel.prototype.onCollapsedChange = function ( callback ) {
//
// 	this.onCollapsedChangeCallback = callback;
// };
//
// UI.ModalDialog = function(options){
// 	UI.Element.call( this );
//
// 	var self = this;
//
// 	var options = options || {};
// 	options.header = options.header || {};
// 	options.header.show = options.header.show ||  false;
// 	options.header.title = options.header.title ||  "";
// 	options.header.closeButton = options.header.closeButton ||  false;
//
// 	options.footer = options.footer || {}
// 	options.footer.show = options.footer.show || false;
// 	options.footer.buttonLeft = options.footer.buttonLeft || {title:"Cancel",callback:function(){
// 		self.close();
// 	}};
// 	options.footer.buttonRight = options.footer.buttonRight || {title:"Ok",callback:function(){
// 		self.close();
// 	}};
//
// 	var uuid = UI.UUID();
//
// 	var div = document.createElement( 'div' );
//     div.className = 'modal';
// 	div.setAttribute("aria-hidden","false");
// 	div.id = uuid;
//
// 	var divDlg = document.createElement( 'div' );
//     divDlg.className = 'modal-dialog';
// 	div.appendChild(divDlg);
//
// 	var divCont = document.createElement( 'div' );
// 	divCont.className = 'modal-content';
// 	divDlg.appendChild(divCont);
//
// 	if(options.header.show){
// 		var divHeader = document.createElement( 'div' );
// 		divHeader.className = 'modal-header';
// 		divCont.appendChild(divHeader);
//
// 		if(options.header.closeButton){
// 			var closeButton = new UI.Button('&times;');
// 			closeButton.dom.className = "close";
// 			closeButton.dom.setAttribute("type","button");
// 			closeButton.dom.setAttribute("aria-hidden","true");
// 			divHeader.appendChild(closeButton.dom);
//
// 			closeButton.onClick(function(){
// 				options.onCancel();
// 				self.close();
// 			});
// 		}
//
// 		var title = document.createElement("h4");
// 		title.className = "modal-title";
// 		title.innerHTML = options.header.title;
// 		divHeader.appendChild(title);
// 	}
//
//
// 	var divContent = document.createElement( 'div' );
// 	divContent.className = 'modal-body';
// 	divCont.appendChild(divContent);
//
// 	this.domContent = divContent;
//
// 	if(options.footer.show && (options.footer.buttonLeft || options.footer.buttonRight)){
// 		var divFooter = document.createElement( 'div' );
// 		divFooter.className = 'modal-footer';
// 		divCont.appendChild(divFooter);
//
// 		if(options.footer.buttonLeft){
// 			var button = new UI.Button(options.footer.buttonLeft.title);
// 			divFooter.appendChild(button.dom);
//
// 			button.onClick(function(){
// 				options.footer.buttonLeft.callback();
// 				self.close();
// 			});
// 		}
// 		if(options.footer.buttonRight){
// 			var button = new UI.Button(options.footer.buttonRight.title);
// 			divFooter.appendChild(button.dom);
//
// 			button.onClick(function(){
// 				options.footer.buttonRight.callback();
// 				self.close();
// 			});
// 		}
// 	}
//
// 	this.dom = div;
// 	$(divDlg).draggable({
//       handle: ".modal-header"
//   	});
// 	$(divCont).resizable();
//
// 	$(document.body).append(this.dom);
//
// 	if(options.show){this.show();}
// }
// UI.ModalDialog.prototype.constructor = UI.ModalDialog;
// UI.ModalDialog.prototype = Object.create( UI.Element.prototype );
//
// UI.ModalDialog.prototype.add = function () {
//   for ( var i = 0; i < arguments.length; i ++ ) {
//     var argument = arguments[ i ];
//     this.domContent.appendChild( argument.dom );
//   }
//   return this;
// };
// UI.ModalDialog.prototype.show = function () {
// 	$(this.dom).modal({
// 		show:true,
// 		backdrop:false,
// 		keyboard:false
// 	});
// };
// UI.ModalDialog.prototype.close = function() {
// 	$(this.dom).remove();
// }
//

//
// UI.CheckTreeView = function ( data, tree_name ) {
// 	tree_name = (typeof tree_name === 'undefined')?"tree":tree_name;
//
// 	UI.Element.call( this );
// 	var self = this;
//
// 	var dom = document.createElement( 'div' );
// 	dom.id = tree_name;
//
// 	var dom_list = document.createElement('ul');
// 	dom.appendChild(dom_list);
//
// 	var append_branch = function(name,parent,node){
// 		var this_node = document.createElement("li");
// 		this_node.className = "collapsed";
//
// 		var input = document.createElement("input");
// 		input.type = "checkbox";
//
// 		var span = document.createElement("span");
// 		span.innerHTML = name;
//
// 		this_node.appendChild(input);
// 		this_node.appendChild(span);
//
// 		// Keep digging through children to create pretty tree.
// 		if(Object.keys(node).length > 0){
// 			var this_node_ul = document.createElement("ul");
// 			this_node.appendChild(this_node_ul);
//
// 			for(var key in node){
// 				append_branch(key,this_node_ul,node[key]);
// 			}
// 		}
// 		parent.appendChild(this_node);
// 	};
//
//
// 	for(var key in data){
// 		append_branch(key,dom_list,data[key]);
// 	}
//
// 		$(dom).tree({
// 			// specify here your options
// 			collapseDuration:0,
// 			onCheck: {
// 				node: 'expand'
// 			},
// 			onUncheck: {
// 				node: 'collapse'
// 			}
// 		});
//
// 	this.dom = dom;
// 	return this;
// };
//
// UI.CheckTreeView.prototype = Object.create( UI.Element.prototype );
// UI.CheckTreeView.prototype.constructor = UI.CheckTreeview;
//
// UI.HorizonalAlignment = function(){
// 	UI.Element.call( this );
//
// 	var div = document.createElement( 'div' );
// 	div.className = 'form-horizontal';
//
// 	var innerDiv = document.createElement( 'div' );
// 	innerDiv.className = 'control-group row-fluid form-inline';
// 	div.appendChild(innerDiv);
//
// 	this.dom = div;
// 	this.domContainer = innerDiv;
// 	return this;
// }
// UI.HorizonalAlignment.prototype.constructor = UI.HorizonalAlignment;
// UI.HorizonalAlignment.prototype = Object.create( UI.Element.prototype );
//
// UI.HorizonalAlignment.prototype.add = function () {
//   for ( var i = 0; i < arguments.length; i ++ ) {
//     var argument = arguments[ i ];
//     this.domContainer.appendChild( argument.dom );
//   }
//   return this;
// };
//
//
// UI.Label = function(content){
// 	UI.Element.call( this );
//
// 	var span = document.createElement( 'span' );
// 	span.className = 'label';
// 	span.innerHTML = content;
//
//
// 	this.dom = span;
// 	return this;
// }
// UI.Label.prototype.constructor = UI.Label;
// UI.Label.prototype = Object.create( UI.Element.prototype );
//
// UI.TextBox = function(label,options){
// 	var label = label || "";
// 	var options = options || {}
//
// 	options.formType = options.formType || 'horizontal';
//
// 	UI.Element.call( this );
//
// 	var uuid = UI.UUID();
// 	var div = document.createElement( 'div' );
// 	div.className = 'form-' + options.formType;
//
//
// 	var lbl = document.createElement( 'label' );
// 	lbl.setAttribute('for',uuid);
// 	lbl.innerHTML = label;
// 	div.appendChild(lbl);
//
// 	var input= document.createElement('input');
// 	input.className = "form-control";
// 	input.setAttribute("type","text");
// 	input.id = uuid;
// 	div.appendChild(input);
//
// 	this.dom = div;
// 	this.input = input;
// 	return this;
// }
// UI.TextBox.prototype.constructor = UI.TextBox;
// UI.TextBox.prototype = Object.create( UI.Element.prototype );
//
// UI.TextBox.prototype.value = function(){
// 	return $(this.input).val();
// }
//
// UI.TextArea = function(label,options){
// 	var label = label || "";
// 	var options = options || {}
//
// 	options.rows = options.rows || 10;
// 	options.formType = options.formType || 'horizontal';
//
// 	UI.Element.call( this );
//
// 	var uuid = UI.UUID();
// 	var div = document.createElement( 'div' );
// 	div.className = 'form-' + options.formType;
//
// 	if(label !== ""){
// 		var lbl = document.createElement( 'label' );
// 		lbl.setAttribute('for',uuid);
// 		lbl.innerHTML = label;
// 		div.appendChild(lbl);
// 	}
//
// 	var input= document.createElement('textarea');
// 	input.className = "form-control";
// 	input.setAttribute("rows",options.rows);
// 	input.id = uuid;
// 	div.appendChild(input);
//
// 	this.dom = div;
// 	this.input = input;
// 	return this;
// }
// UI.TextArea.prototype.constructor = UI.TextArea;
// UI.TextArea.prototype = Object.create( UI.Element.prototype );
//
// UI.TextArea.prototype.text = function(){
// 	return $(this.input).val();
// }
// UI.TextArea.prototype.text = function(text){
// 	if(text === null || text === undefined)return $(this.input).val();
// 	$(this.input).val(text);
//
// }
// UI.TextArea.prototype.appendText = function(text){
// 	// Don't use append (suggested in SO), this appends the text to the innerHTML.  Not correct.
// 	//$(this.input).append(text);
//
// 	$(this.input).val($(this.input).val() + text);
// 	return this;
// }
// UI.TextArea.prototype.clear = function(text){
// 	// This doesn't work, it does clear the textarea but then nothing can be added
// 	// after.
// 	 $(this.input).val('');
//
// 	return this;
// }
//
// UI.ModalessDialog = function (options){
//   UI.Element.call( this );
//
//   var options = options || {};
//   options.resize = options.resize || function(ui){};
//   options.modal = options.modal || false;
//   options.minWidth = options.minWidth || 400;
//   options.minHeight = options.minHeight || 400;
//   options.noXButton = options.noXButton || false;
//   options.noCloseButton = options.noCloseButton || false;
//   options.title = options.title || "Dialog";
//
//   var dom = document.createElement("div");
//   var self = this;
//
//   this.options = options;
//   var buttons = [];
//   if(!options.noCloseButton){
//     buttons.push({
//       text: "Close",
//       icons: {
//         primary: "ui-icon-close"
//       },
//       click: function() {
//         $( dom ).dialog( "close" );
//       }
//     });
//   }
//   $(dom).dialog({
//     buttons: buttons,
//     title:options.title,
//     dialogClass: (options.noXButton)?"no-close":"allow-close",
//     open:function(event,ui){
//       dom.id = UI.UUID();
//     },
//     close:function(event,ui){
//       var elem = document.getElementById(dom.id);
//       elem = elem.parentNode;                     //jquery.ui dialog creates a new parent node to wrap the dialog.
//       document.body.removeChild(elem);
//     },
//     resize:function(event,ui){
//       self.options.resize(ui);
//     },
//     modal:self.options.modal,
//     minWidth:self.options.minWidth,
//     minHeight:self.options.minHeight
//   });
//
//   this.dom = dom;
//   return this;
// }
// UI.ModalessDialog.prototype = Object.create( UI.Element.prototype );
// UI.ModalessDialog.prototype.constructor = UI.ModalessDialog;
//
// UI.ModalessDialog.prototype.add = function () {
// 	for ( var i = 0; i < arguments.length; i ++ ) {
// 		var argument = arguments[ i ];
// 		if ( argument instanceof UI.Element ) {
//       		this.dom.appendChild( argument.dom );
// 		} else {
// 			console.error( 'UI.ModalessDialog:', argument, 'is not an instance of UI.Element.' )
// 		}
//
// 	}
// 	return this;
// };
//
// UI.ModalessDialog.prototype.close = function(){
//   $(this.dom).dialog("close");
// }
//
// UI.CheckTreeView2 = function ( options ) {
//     var options = options || {};
//     options.search = options.search || false;
//     options.types = options.types || false;
//     options.dnd = options.dnd || false;
//
//     options.onChanged = options.onChanged || function(value){};
//     options.onReady = options.onReady || function(){};
//     options.onDNDStop = options.onDNDStop || function(element,target){};
//
//     this.roots = [];
// 	var uuid = UI.UUID();
//     var self = this;
//
//     var dom = document.createElement("div");
//     dom.setAttribute("id",uuid);
//
//
// 	this.dom = dom;
//     this.options = options;
//
//     // Call last
//     this._build();
//
//     return this;
// };
//
// UI.CheckTreeView2.prototype = Object.create( UI.Element.prototype );
// UI.CheckTreeView2.prototype.constructor = UI.CheckTreeview;
//
// UI.CheckTreeView2.prototype._addNodeHelper = function(node){
//
// }
// UI.CheckTreeView2.prototype._build = function(){
//     var self = this;
//
//     var plugins = ["themes"];
//     if(self.options.search)plugins.push("search");
//     if(self.options.types)plugins.push("types");
//     if(self.options.dnd)plugins.push("dnd");
//
//     self.$treeRoot = $(self.dom).jstree({
//         "plugins": plugins,
//         'core': {
//             check_callback: true,
//             multiple:false,
//             "themes": {
//                 "name":"default-dark",
//                 "icons": false,
//                 "stripes": true,
//                 "default": true
//             },
//             'data': []
//         }
//     });
//
//     self.$treeRoot.on('changed.jstree',function(e,data){
//         var val = data.instance.get_node(data.selected).text;
//         var uuid = data.instance.get_node(data.selected).id;
//
//         if(val !== undefined){
//             self.options.onChanged(val,uuid);
//         }
//     });
//     self.$treeRoot.on('ready.jstree',function(e,data){
//         self.options.onReady();
//     });
//     if(self.options.dnd){
//         $(document).on('dnd_stop.vakata',function(e,data){
//             var target = $(data.event.target).text();
//             var element = $(data.element).text();
//             options.onDNDStop(element,target);
//         });
//     }
// }
// UI.CheckTreeView2.prototype.clear = function(){
//     var self = this;
//     $.each(this.roots,function(index,value){
//         self.$treeRoot.jstree(true).delete_node(value);
//     });
//     this.roots = [];
// }
// UI.CheckTreeView2.prototype.addNode = function(title,id,parentID){
//     var actualID = this.$treeRoot.jstree(true).create_node(
//         this.$treeRoot.jstree(true).get_node(parentID),    // parent
//         {                                                  // New node object (can be a string or valid JSON object)
//             'text':title,
//             'id':id,
//             'state':{'opened':true}
//         }
//     );
//     return actualID;
// }
// UI.CheckTreeView2.prototype.addRoot = function(title,id){
//     var actualID = this.$treeRoot.jstree(true).create_node(
//         '#',                            // root parent
//         {                               // New node object (can be a string or valid JSON object)
//             'text':title,
//             'id':id,
//             'state':{'opened':true}
//         }
//     );
//     this.roots.push(actualID);
// }
//
// UI.CheckTreeView2.prototype.setSelection = function(uuid){
//     if(uuid !== null)this.$treeRoot.jstree('select_node', uuid);
//     else this.$treeRoot.jstree(true).deselect_all(true)
// }
//
// UI.Slider = function (options){
//   UI.Element.call( this );
//
//   var options = options || {};
//   var uuid = UI.UUID();
//   options.min = options.min || 0;
//   options.max = options.max || 10;
//   options.step = options.step || 1;
//   options.orientation = options.orientation || 'horizontal';
//   options.value = options.value || 5;
//   options.tooltip = options.tooltip || "hide";
//
//   var input = document.createElement("input");
//   input.setAttribute("type","text");
//   input.setAttribute("class","span2");
//   input.setAttribute("value","");
//   input.setAttribute("id",uuid);
//   // input.setAttribute("data-slider-min", options.min);
//   // input.setAttribute("data-slider-max",options.max);
//   // input.setAttribute("data-slider-step",options.step);
//   // input.setAttribute("data-slider-value",options.value);
//   // input.setAttribute("data-slider-orientation",options.orientation);
//   // input.setAttribute("data-slider-tooltip",options.tooltip);
//   // input.setAttribute("data-slider-selection",'none');
//
//   this.$slider = $(input).slider();
//   this.dom = input;
//
//   return this;
// }
// UI.Slider.prototype = Object.create( UI.Element.prototype );
// UI.Slider.prototype.constructor = UI.Slider;
//
// //TODO:  ALL event hooks should look like this from now on, stop using shitty
// // callbacks.
// var sliderEvents = [ 'SlideStart', 'Slide', 'SlideStop' ];
//
// sliderEvents.forEach( function ( event ) {
// 	var method = 'on' + event;
// 		console.log("New method: ",method)
// 	UI.Slider.prototype[ method ] = function ( callback ) {
// 		this.$slider.on( event, callback.bind( this ), false );
// 		return this;
// 	};
// } );
