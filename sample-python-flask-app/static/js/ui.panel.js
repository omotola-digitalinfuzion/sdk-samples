var UI = UI || {};

UI.GoldenLayout = function(){}

UI.GoldenLayout.prototype._getContainerDOM = function(obj){
    if(obj.element === null || obj.element.length===0)return null;
    for(var i = 0; i < obj.element.length; ++i){
        var elem = obj.element[i];
        if(elem instanceof HTMLDivElement && elem.className.indexOf("lm_item_container")>-1){
            if(elem.children !== null && elem.children.length > 0 && elem.children[0].className.indexOf("lm_content")>-1){
                return elem.children[i];
            }
        }
    }
    for(var i = 0; i < obj.contentItems.length; ++i){
        var result = this._getContainerDOM(obj.contentItems[i]);
        if(result !== null)return result;
    }
    return null;
}
UI.GoldenLayout.prototype.constructor = UI.GoldenLayout;

UI.Panels = function(options){
    var options = options || {};
    options.type = options.type || "row";                   //GoldenLayout container type (row or column)
    options.divID = options.divID || "grid_layout_div";     //Container div identifier

    // Callbacks
    options.complete = options.complete || function(){};
    options.error = options.error || function(err){};

    var self = this;
    var dom = document.createElement( 'div' );
    dom.className = 'grid_layout_div';

    this.config = {
        content:[
        {
            type:options.type,
            content:[],
        }],
        settings:{
          popoutWholeStack: false,
          showPopoutIcon:false,
          showCloseIcon:false
        }
    };
    this.layout = new GoldenLayout(this.config);

    // TODO:  Handle component registration at a later stage, like when a new component is introduced.
    this.layout.registerComponent( 'example', function( container, state ){
        // console.log("Registered another container: "  + state.text);
        //
        // self._last_container = container.getElement().get(0);
        // console.log(self._last_container);
    });

    this.layout.on( 'initialised', function(){
        self.container = self.layout.root.contentItems[0];
        self.element = self.layout.root.element[0];

        $("#"+options.divID).append(self.element);
        //console.log(self.layout.root.element.get(0)); //jquery object
    })
    this.layout.init();

    return this;
}
UI.Panels.prototype = Object.create( UI.GoldenLayout.prototype );
UI.Panels.prototype.constructor = UI.Panels;


UI.Panels.prototype.add = function () {
    for ( var i = 0; i < arguments.length; i ++ ) {
        var argument = arguments[ i ];

        // Create a new component by adding it to *this* container
        this.container.addChild( argument.config );

        //
        argument.parent = this;
        argument.container = this.container.contentItems[this.container.contentItems.length-1];

        // ONLY PanelElements can hold other UI items so the DOM must be pulled from the GoldenLayout hierarchy.
        if ( argument instanceof UI.PanelElement) {
            argument.dom = this._getContainerDOM(argument.container);
        }
    }
    return this;
};

UI.PanelElement = function(title, options){
    title = (title)?title:"NoTitle";
    var self = this;


    // TODO:  For now, use a dummy config w/ 'row' type, make this an option later.
    this.config = {
        title: title,
        type: 'component',
        componentName: 'example',
        componentState: { text: title }
    };
    this.dom = null;

    return this;
}
UI.PanelElement.prototype = Object.create( UI.GoldenLayout.prototype );
UI.PanelElement.prototype.constructor = UI.PanelElement;

UI.PanelElement.prototype.add = function () {
  for ( var i = 0; i < arguments.length; i ++ ) {
      var argument = arguments[ i ];
      if ( argument instanceof UI.PanelElement || argument instanceof UI.PanelColumn) {
          this.container.addChild( argument.config );
          argument.parent = this;
          argument.container = this.container.contentItems[this.container.contentItems.length-1];
          argument.dom = this._getContainerDOM(argument.container);
      } else {
          this.dom.appendChild(argument.dom);
      }
  }
  return this;
};


UI.PanelColumn = function(){
    var self = this;

    // TODO:  For now, use a dummy config w/ 'row' type, make this an option later.
    this.config = {
        type:'column',
        content: []
    };
    this.container = null;
    this.dom = null;

    return this;
}
UI.PanelColumn.prototype = Object.create( UI.GoldenLayout.prototype );
UI.PanelColumn.prototype.constructor = UI.PanelColumn;

UI.PanelColumn.prototype.add = function () {
  for ( var i = 0; i < arguments.length; i ++ ) {
      var argument = arguments[ i ];
      if ( argument instanceof UI.PanelColumn) {
          this.container.addChild( argument.config );
          argument.parent = this;
          argument.container = this.container.contentItems[this.container.contentItems.length-1];
      }

      if ( argument instanceof UI.PanelElement) {
          this.container.addChild( argument.config );

          argument.parent = this;
          argument.container = this.container.contentItems[this.container.contentItems.length-1];
          argument.dom = this._getContainerDOM(argument.container);
      }
  }
  return this;
};
