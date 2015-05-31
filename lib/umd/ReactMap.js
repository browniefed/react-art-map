(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["ReactMap"] = factory(require("react"));
	else
		root["ReactMap"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.Map = __webpack_require__(1);
	exports.ZoomControl = __webpack_require__(80);
	exports.TileUtil = __webpack_require__(71);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(3);
	var ReactArt = __webpack_require__(4);
	var TileUtil = __webpack_require__(71);
	var MapTheTiles = __webpack_require__(2);
	var Rectangle = __webpack_require__(75);

	var Surface = ReactArt.Surface;
	var Shape = ReactArt.Shape;
	var Group = ReactArt.Group;
	var Pattern = ReactArt.Pattern;

	var rectanglePath = Rectangle({
	    top: 0,
	    left: 0,
	    right: 256,
	    bottom: 256
	}).path.print();

	var gmu = __webpack_require__(73);

	var Map = React.createClass({
	    displayName: 'Map',

	    propTypes: {
	        width: React.PropTypes.number,
	        height: React.PropTypes.number,
	        zoom: React.PropTypes.number,
	        center: React.PropTypes.array,
	        tileSource: React.PropTypes.string,
	        subdomains: React.PropTypes.string,
	        tileWidth: React.PropTypes.number,

	        onMouseDown: React.PropTypes.func,
	        onMouseMove: React.PropTypes.func,
	        onMouseUp: React.PropTypes.func
	    },
	    getDefaultProps: function getDefaultProps() {
	        return {
	            subdomains: 'abc',
	            tileWidth: 256,
	            zoom: 15,
	            onMouseDown: function onMouseDown() {},
	            onMouseMove: function onMouseMove() {},
	            onMouseUp: function onMouseUp() {},
	            onDrag: function onDrag() {}
	        };
	    },
	    componentDidMount: function componentDidMount() {
	        document.addEventListener('mousemove', this.handleMouseMove, false);
	        document.addEventListener('mouseup', this.handleMouseUp, false);
	    },
	    componentWillUnmount: function componentWillUnmount() {
	        document.removeEventListener('mousemove', this.handleMouseMove, false);
	        document.removeEventListener('mouseup', this.handleMouseUp, false);
	    },
	    handleMouseDown: function handleMouseDown(e) {
	        this.dragging = true;
	        this.coords = {
	            x: e.x,
	            y: e.y
	        };
	        this.dragCenter = this.props.center.slice(0);

	        this.props.onMouseDown(e);
	    },
	    handleMouseUp: function handleMouseUp(e) {
	        this.dragging = false;
	        this.coords = {};
	        this.dragCenter = [];
	        this.props.onMouseUp(e);
	    },
	    handleMouseMove: function handleMouseMove(e) {
	        if (this.dragging) {
	            e.preventDefault();
	            //Get mouse change differential
	            var xDiff = this.coords.x - e.x,
	                yDiff = this.coords.y - e.y;
	            //Update to our new coordinates
	            this.coords.x = e.x;
	            this.coords.y = e.y;

	            var centerMeters = TileUtil.degrees2meters(this.dragCenter[0], this.dragCenter[1]);

	            var R = 6378137,
	                lat = this.dragCenter[1],
	                lon = this.dragCenter[0];

	            var dn = xDiff * 10;
	            var de = yDiff * 5;

	            //Coordinate offsets in radians
	            var dLat = de / R || 0;
	            var dLon = dn / R || 0;

	            //OffsetPosition, decimal degrees
	            var latO = lat - dLat * 180 / Math.PI;
	            var lonO = lon + dLon * 180 / Math.PI;

	            var newPos = [lonO, latO];

	            this.dragCenter = newPos;
	            this.props.onDrag(newPos, e);
	        }
	    },
	    getTiles: function getTiles() {

	        var layout = TileUtil.getTileLayout({
	            center: this.props.center,
	            zoom: this.props.zoom,
	            tileWidth: this.props.tileWidth,

	            tileSource: this.props.tileSource,
	            subdomains: this.props.subdomains,

	            width: this.props.width,
	            height: this.props.height
	        });

	        return layout.map(function (tile) {
	            return React.createElement(Shape, {
	                d: rectanglePath,
	                x: tile.x,
	                y: tile.y,
	                fill: new Pattern(tile.img, this.props.tileWidth, this.props.tileWidth, 0, 0)
	            });
	        }, this);
	    },
	    render: function render() {
	        return React.createElement(
	            Surface,
	            {
	                width: this.props.width,
	                height: this.props.height
	            },
	            React.createElement(
	                Group,
	                {
	                    onMouseDown: this.handleMouseDown
	                },
	                this.getTiles(),
	                this.props.children
	            )
	        );
	    }

	});

	module.exports = Map;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var MapTheTiles = function MapTheTiles(projExtent, tileSize) {
	  // default spherical mercator project extent
	  this.projExtent = projExtent || {
	    left: -20037508.342789244,
	    right: 20037508.342789244,
	    bottom: -20037508.342789244,
	    top: 20037508.342789244
	  };
	  this.size = tileSize || 256;
	  this.maxRes = Math.min(Math.abs(this.projExtent.right - this.projExtent.left) / this.size, Math.abs(this.projExtent.top - this.projExtent.bottom) / this.size);
	};
	MapTheTiles.prototype.getTiles = function (extent, zoom) {
	  var res = this.maxRes / Math.pow(2, zoom),

	  //coordinated in pixel
	  lx = Math.floor((extent.left - this.projExtent.left) / res),
	      rx = Math.floor((extent.right - this.projExtent.left) / res),
	      by = Math.floor((this.projExtent.top - extent.bottom) / res),
	      ty = Math.floor((this.projExtent.top - extent.top) / res),

	  // tile numbers
	  lX = Math.floor(lx / this.size),
	      rX = Math.floor(rx / this.size),
	      bY = Math.floor(by / this.size),
	      tY = Math.floor(ty / this.size),

	  //top left tile position of top-left tile with respect to window/div
	  top = topStart = tY * this.size - ty,
	      left = lX * this.size - lx,
	      tiles = [];
	  for (var i = lX; i <= rX; i++) {
	    top = topStart;
	    for (var j = tY; j <= bY; j++) {
	      tiles.push({
	        X: i,
	        Y: j,
	        Z: zoom,
	        top: top,
	        left: left
	      });
	      top += this.size;
	    }
	    left += this.size;
	  }
	  return tiles;
	};

	module.exports = MapTheTiles;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2014 Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactART
	 */

	'use strict';

	__webpack_require__(42); // Flip this to DOM mode for debugging

	var Transform = __webpack_require__(46);
	var Mode = __webpack_require__(61);

	var React = __webpack_require__(3);
	var ReactMultiChild = __webpack_require__(5);
	var ReactUpdates = __webpack_require__(36);

	var assign = __webpack_require__(19);
	var emptyObject = __webpack_require__(20);

	var pooledTransform = new Transform();

	// Utilities

	function childrenAsString(children) {
	  if (!children) {
	    return '';
	  }
	  if (typeof children === 'string') {
	    return children;
	  }
	  if (children.length) {
	    return children.join('\n');
	  }
	  return '';
	}

	function createComponent(name) {
	  var ReactARTComponent = function ReactARTComponent(props) {
	    this.node = null;
	    this.subscriptions = null;
	    this.listeners = null;
	    this._mountImage = null;
	    this._renderedChildren = null;
	    this._mostRecentlyPlacedChild = null;
	  };
	  ReactARTComponent.displayName = name;
	  for (var i = 1, l = arguments.length; i < l; i++) {
	    assign(ReactARTComponent.prototype, arguments[i]);
	  }

	  return ReactARTComponent;
	}

	// ContainerMixin for components that can hold ART nodes

	var ContainerMixin = assign({}, ReactMultiChild.Mixin, {

	  /**
	   * Moves a child component to the supplied index.
	   *
	   * @param {ReactComponent} child Component to move.
	   * @param {number} toIndex Destination index of the element.
	   * @protected
	   */
	  moveChild: function moveChild(child, toIndex) {
	    var childNode = child._mountImage;
	    var mostRecentlyPlacedChild = this._mostRecentlyPlacedChild;
	    if (mostRecentlyPlacedChild == null) {
	      // I'm supposed to be first.
	      if (childNode.previousSibling) {
	        if (this.node.firstChild) {
	          childNode.injectBefore(this.node.firstChild);
	        } else {
	          childNode.inject(this.node);
	        }
	      }
	    } else {
	      // I'm supposed to be after the previous one.
	      if (mostRecentlyPlacedChild.nextSibling !== childNode) {
	        if (mostRecentlyPlacedChild.nextSibling) {
	          childNode.injectBefore(mostRecentlyPlacedChild.nextSibling);
	        } else {
	          childNode.inject(this.node);
	        }
	      }
	    }
	    this._mostRecentlyPlacedChild = childNode;
	  },

	  /**
	   * Creates a child component.
	   *
	   * @param {ReactComponent} child Component to create.
	   * @param {object} childNode ART node to insert.
	   * @protected
	   */
	  createChild: function createChild(child, childNode) {
	    child._mountImage = childNode;
	    var mostRecentlyPlacedChild = this._mostRecentlyPlacedChild;
	    if (mostRecentlyPlacedChild == null) {
	      // I'm supposed to be first.
	      if (this.node.firstChild) {
	        childNode.injectBefore(this.node.firstChild);
	      } else {
	        childNode.inject(this.node);
	      }
	    } else {
	      // I'm supposed to be after the previous one.
	      if (mostRecentlyPlacedChild.nextSibling) {
	        childNode.injectBefore(mostRecentlyPlacedChild.nextSibling);
	      } else {
	        childNode.inject(this.node);
	      }
	    }
	    this._mostRecentlyPlacedChild = childNode;
	  },

	  /**
	   * Removes a child component.
	   *
	   * @param {ReactComponent} child Child to remove.
	   * @protected
	   */
	  removeChild: function removeChild(child) {
	    child._mountImage.eject();
	    child._mountImage = null;
	  },

	  updateChildrenAtRoot: function updateChildrenAtRoot(nextChildren, transaction) {
	    this.updateChildren(nextChildren, transaction, emptyObject);
	  },

	  mountAndInjectChildrenAtRoot: function mountAndInjectChildrenAtRoot(children, transaction) {
	    this.mountAndInjectChildren(children, transaction, emptyObject);
	  },

	  /**
	   * Override to bypass batch updating because it is not necessary.
	   *
	   * @param {?object} nextChildren.
	   * @param {ReactReconcileTransaction} transaction
	   * @internal
	   * @override {ReactMultiChild.Mixin.updateChildren}
	   */
	  updateChildren: function updateChildren(nextChildren, transaction, context) {
	    this._mostRecentlyPlacedChild = null;
	    this._updateChildren(nextChildren, transaction, context);
	  },

	  // Shorthands

	  mountAndInjectChildren: function mountAndInjectChildren(children, transaction, context) {
	    var mountedImages = this.mountChildren(children, transaction, context);
	    // Each mount image corresponds to one of the flattened children
	    var i = 0;
	    for (var key in this._renderedChildren) {
	      if (this._renderedChildren.hasOwnProperty(key)) {
	        var child = this._renderedChildren[key];
	        child._mountImage = mountedImages[i];
	        mountedImages[i].inject(this.node);
	        i++;
	      }
	    }
	  }

	});

	// Surface is a React DOM Component, not an ART component. It serves as the
	// entry point into the ART reconciler.

	var Surface = React.createClass({

	  displayName: 'Surface',

	  mixins: [ContainerMixin],

	  componentDidMount: function componentDidMount() {
	    var domNode = this.getDOMNode();

	    this.node = Mode.Surface(+this.props.width, +this.props.height, domNode);

	    var transaction = ReactUpdates.ReactReconcileTransaction.getPooled();
	    transaction.perform(this.mountAndInjectChildrenAtRoot, this, this.props.children, transaction);
	    ReactUpdates.ReactReconcileTransaction.release(transaction);
	  },

	  componentDidUpdate: function componentDidUpdate(oldProps) {
	    var node = this.node;
	    if (this.props.width != oldProps.width || this.props.height != oldProps.height) {
	      node.resize(+this.props.width, +this.props.height);
	    }

	    var transaction = ReactUpdates.ReactReconcileTransaction.getPooled();
	    transaction.perform(this.updateChildrenAtRoot, this, this.props.children, transaction);
	    ReactUpdates.ReactReconcileTransaction.release(transaction);

	    if (node.render) {
	      node.render();
	    }
	  },

	  componentWillUnmount: function componentWillUnmount() {
	    this.unmountChildren();
	  },

	  render: function render() {
	    // This is going to be a placeholder because we don't know what it will
	    // actually resolve to because ART may render canvas, vml or svg tags here.
	    // We only allow a subset of properties since others might conflict with
	    // ART's properties.
	    var props = this.props;

	    // TODO: ART's Canvas Mode overrides surface title and cursor
	    return React.createElement(Mode.Surface.tagName, {
	      accesskey: props.accesskey,
	      className: props.className,
	      draggable: props.draggable,
	      role: props.role,
	      style: props.style,
	      tabindex: props.tabindex,
	      title: props.title });
	  }

	});

	// Various nodes that can go into a surface

	var EventTypes = {
	  onMouseMove: 'mousemove',
	  onMouseOver: 'mouseover',
	  onMouseOut: 'mouseout',
	  onMouseUp: 'mouseup',
	  onMouseDown: 'mousedown',
	  onClick: 'click'
	};

	var NodeMixin = {

	  construct: function construct(element) {
	    this._currentElement = element;
	  },

	  getPublicInstance: function getPublicInstance() {
	    return this.node;
	  },

	  putEventListener: function putEventListener(type, listener) {
	    var subscriptions = this.subscriptions || (this.subscriptions = {});
	    var listeners = this.listeners || (this.listeners = {});
	    listeners[type] = listener;
	    if (listener) {
	      if (!subscriptions[type]) {
	        subscriptions[type] = this.node.subscribe(type, listener, this);
	      }
	    } else {
	      if (subscriptions[type]) {
	        subscriptions[type]();
	        delete subscriptions[type];
	      }
	    }
	  },

	  handleEvent: function handleEvent(event) {
	    var listener = this.listeners[event.type];
	    if (!listener) {
	      return;
	    }
	    if (typeof listener === 'function') {
	      listener.call(this, event);
	    } else if (listener.handleEvent) {
	      listener.handleEvent(event);
	    }
	  },

	  destroyEventListeners: function destroyEventListeners() {
	    var subscriptions = this.subscriptions;
	    if (subscriptions) {
	      for (var type in subscriptions) {
	        subscriptions[type]();
	      }
	    }
	    this.subscriptions = null;
	    this.listeners = null;
	  },

	  applyNodeProps: function applyNodeProps(oldProps, props) {
	    var node = this.node;

	    var scaleX = props.scaleX != null ? props.scaleX : props.scale != null ? props.scale : 1;
	    var scaleY = props.scaleY != null ? props.scaleY : props.scale != null ? props.scale : 1;

	    pooledTransform.transformTo(1, 0, 0, 1, 0, 0).move(props.x || 0, props.y || 0).rotate(props.rotation || 0, props.originX, props.originY).scale(scaleX, scaleY, props.originX, props.originY);

	    if (props.transform != null) {
	      pooledTransform.transform(props.transform);
	    }

	    if (node.xx !== pooledTransform.xx || node.yx !== pooledTransform.yx || node.xy !== pooledTransform.xy || node.yy !== pooledTransform.yy || node.x !== pooledTransform.x || node.y !== pooledTransform.y) {
	      node.transformTo(pooledTransform);
	    }

	    if (props.cursor !== oldProps.cursor || props.title !== oldProps.title) {
	      node.indicate(props.cursor, props.title);
	    }

	    if (node.blend && props.opacity !== oldProps.opacity) {
	      node.blend(props.opacity == null ? 1 : props.opacity);
	    }

	    if (props.visible !== oldProps.visible) {
	      if (props.visible == null || props.visible) {
	        node.show();
	      } else {
	        node.hide();
	      }
	    }

	    for (var type in EventTypes) {
	      this.putEventListener(EventTypes[type], props[type]);
	    }
	  },

	  mountComponentIntoNode: function mountComponentIntoNode(rootID, container) {
	    throw new Error('You cannot render an ART component standalone. ' + 'You need to wrap it in a Surface.');
	  }

	};

	// Group

	var Group = createComponent('Group', NodeMixin, ContainerMixin, {

	  mountComponent: function mountComponent(rootID, transaction, context) {
	    this.node = Mode.Group();
	    var props = this._currentElement.props;
	    this.applyGroupProps(emptyObject, props);
	    this.mountAndInjectChildren(props.children, transaction, context);
	    return this.node;
	  },

	  receiveComponent: function receiveComponent(nextComponent, transaction, context) {
	    var props = nextComponent.props;
	    var oldProps = this._currentElement.props;
	    this.applyGroupProps(oldProps, props);
	    this.updateChildren(props.children, transaction, context);
	    this._currentElement = nextComponent;
	  },

	  applyGroupProps: function applyGroupProps(oldProps, props) {
	    this.node.width = props.width;
	    this.node.height = props.height;
	    this.applyNodeProps(oldProps, props);
	  },

	  unmountComponent: function unmountComponent() {
	    this.destroyEventListeners();
	    this.unmountChildren();
	  }

	});

	// ClippingRectangle
	var ClippingRectangle = createComponent('ClippingRectangle', NodeMixin, ContainerMixin, {

	  mountComponent: function mountComponent(rootID, transaction, context) {
	    this.node = Mode.ClippingRectangle();
	    var props = this._currentElement.props;
	    this.applyClippingProps(emptyObject, props);
	    this.mountAndInjectChildren(props.children, transaction, context);
	    return this.node;
	  },

	  receiveComponent: function receiveComponent(nextComponent, transaction, context) {
	    var props = nextComponent.props;
	    var oldProps = this._currentElement.props;
	    this.applyClippingProps(oldProps, props);
	    this.updateChildren(props.children, transaction, context);
	    this._currentElement = nextComponent;
	  },

	  applyClippingProps: function applyClippingProps(oldProps, props) {
	    this.node.width = props.width;
	    this.node.height = props.height;
	    this.node.x = props.x;
	    this.node.y = props.y;
	    this.applyNodeProps(oldProps, props);
	  },

	  unmountComponent: function unmountComponent() {
	    this.destroyEventListeners();
	    this.unmountChildren();
	  }

	});

	// Renderables

	var RenderableMixin = assign({}, NodeMixin, {

	  applyRenderableProps: function applyRenderableProps(oldProps, props) {
	    if (oldProps.fill !== props.fill) {
	      if (props.fill && props.fill.applyFill) {
	        props.fill.applyFill(this.node);
	      } else {
	        this.node.fill(props.fill);
	      }
	    }
	    if (oldProps.stroke !== props.stroke || oldProps.strokeWidth !== props.strokeWidth || oldProps.strokeCap !== props.strokeCap || oldProps.strokeJoin !== props.strokeJoin ||
	    // TODO: Consider a deep check of stokeDash.
	    // This may benefit the VML version in IE.
	    oldProps.strokeDash !== props.strokeDash) {
	      this.node.stroke(props.stroke, props.strokeWidth, props.strokeCap, props.strokeJoin, props.strokeDash);
	    }
	    this.applyNodeProps(oldProps, props);
	  },

	  unmountComponent: function unmountComponent() {
	    this.destroyEventListeners();
	  }

	});

	// Shape

	var Shape = createComponent('Shape', RenderableMixin, {

	  construct: function construct(element) {
	    this._currentElement = element;
	    this._oldPath = null;
	  },

	  mountComponent: function mountComponent(rootID, transaction, context) {
	    this.node = Mode.Shape();
	    var props = this._currentElement.props;
	    this.applyShapeProps(emptyObject, props);
	    return this.node;
	  },

	  receiveComponent: function receiveComponent(nextComponent, transaction, context) {
	    var props = nextComponent.props;
	    var oldProps = this._currentElement.props;
	    this.applyShapeProps(oldProps, props);
	    this._currentElement = nextComponent;
	  },

	  applyShapeProps: function applyShapeProps(oldProps, props) {
	    var oldPath = this._oldPath;
	    var path = props.d || childrenAsString(props.children);
	    if (path !== oldPath || oldProps.width !== props.width || oldProps.height !== props.height) {
	      this.node.draw(path, props.width, props.height);
	      this._oldPath = path;
	    }
	    this.applyRenderableProps(oldProps, props);
	  }

	});

	// Text

	var Text = createComponent('Text', RenderableMixin, {

	  construct: function construct(element) {
	    this._currentElement = element;
	    this._oldString = null;
	  },

	  mountComponent: function mountComponent(rootID, transaction, context) {
	    var props = this._currentElement.props;
	    var newString = childrenAsString(props.children);
	    this.node = Mode.Text(newString, props.font, props.alignment, props.path);
	    this._oldString = newString;
	    this.applyRenderableProps(emptyObject, props);
	    return this.node;
	  },

	  isSameFont: function isSameFont(oldFont, newFont) {
	    if (oldFont === newFont) {
	      return true;
	    }
	    if (typeof newFont === 'string' || typeof oldFont === 'string') {
	      return false;
	    }
	    return newFont.fontSize === oldFont.fontSize && newFont.fontStyle === oldFont.fontStyle && newFont.fontVariant === oldFont.fontVariant && newFont.fontWeight === oldFont.fontWeight && newFont.fontFamily === oldFont.fontFamily;
	  },

	  receiveComponent: function receiveComponent(nextComponent, transaction, context) {
	    var props = nextComponent.props;
	    var oldProps = this._currentElement.props;

	    var oldString = this._oldString;
	    var newString = childrenAsString(props.children);

	    if (oldString !== newString || !this.isSameFont(oldProps.font, props.font) || oldProps.alignment !== props.alignment || oldProps.path !== props.path) {
	      this.node.draw(newString, props.font, props.alignment, props.path);
	      this._oldString = newString;
	    }

	    this.applyRenderableProps(oldProps, props);
	    this._currentElement = nextComponent;
	  }

	});

	// Declarative fill type objects - API design not finalized

	var slice = Array.prototype.slice;

	function LinearGradient(stops, x1, y1, x2, y2) {
	  this.args = slice.call(arguments);
	};
	LinearGradient.prototype.applyFill = function (node) {
	  node.fillLinear.apply(node, this.args);
	};

	function RadialGradient(stops, fx, fy, rx, ry, cx, cy) {
	  this.args = slice.call(arguments);
	};
	RadialGradient.prototype.applyFill = function (node) {
	  node.fillRadial.apply(node, this.args);
	};

	function Pattern(url, width, height, left, top) {
	  this.args = slice.call(arguments);
	};
	Pattern.prototype.applyFill = function (node) {
	  node.fillImage.apply(node, this.args);
	};

	var ReactART = {

	  LinearGradient: LinearGradient,
	  RadialGradient: RadialGradient,
	  Pattern: Pattern,
	  Transform: Transform,
	  Path: Mode.Path,
	  Surface: Surface,
	  Group: Group,
	  ClippingRectangle: ClippingRectangle,
	  Shape: Shape,
	  Text: Text

	};

	module.exports = ReactART;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactMultiChild
	 * @typechecks static-only
	 */

	"use strict";

	var ReactComponentEnvironment = __webpack_require__(6);
	var ReactMultiChildUpdateTypes = __webpack_require__(8);

	var ReactReconciler = __webpack_require__(10);
	var ReactChildReconciler = __webpack_require__(26);

	/**
	 * Updating children of a component may trigger recursive updates. The depth is
	 * used to batch recursive updates to render markup more efficiently.
	 *
	 * @type {number}
	 * @private
	 */
	var updateDepth = 0;

	/**
	 * Queue of update configuration objects.
	 *
	 * Each object has a `type` property that is in `ReactMultiChildUpdateTypes`.
	 *
	 * @type {array<object>}
	 * @private
	 */
	var updateQueue = [];

	/**
	 * Queue of markup to be rendered.
	 *
	 * @type {array<string>}
	 * @private
	 */
	var markupQueue = [];

	/**
	 * Enqueues markup to be rendered and inserted at a supplied index.
	 *
	 * @param {string} parentID ID of the parent component.
	 * @param {string} markup Markup that renders into an element.
	 * @param {number} toIndex Destination index.
	 * @private
	 */
	function enqueueMarkup(parentID, markup, toIndex) {
	  // NOTE: Null values reduce hidden classes.
	  updateQueue.push({
	    parentID: parentID,
	    parentNode: null,
	    type: ReactMultiChildUpdateTypes.INSERT_MARKUP,
	    markupIndex: markupQueue.push(markup) - 1,
	    textContent: null,
	    fromIndex: null,
	    toIndex: toIndex
	  });
	}

	/**
	 * Enqueues moving an existing element to another index.
	 *
	 * @param {string} parentID ID of the parent component.
	 * @param {number} fromIndex Source index of the existing element.
	 * @param {number} toIndex Destination index of the element.
	 * @private
	 */
	function enqueueMove(parentID, fromIndex, toIndex) {
	  // NOTE: Null values reduce hidden classes.
	  updateQueue.push({
	    parentID: parentID,
	    parentNode: null,
	    type: ReactMultiChildUpdateTypes.MOVE_EXISTING,
	    markupIndex: null,
	    textContent: null,
	    fromIndex: fromIndex,
	    toIndex: toIndex
	  });
	}

	/**
	 * Enqueues removing an element at an index.
	 *
	 * @param {string} parentID ID of the parent component.
	 * @param {number} fromIndex Index of the element to remove.
	 * @private
	 */
	function enqueueRemove(parentID, fromIndex) {
	  // NOTE: Null values reduce hidden classes.
	  updateQueue.push({
	    parentID: parentID,
	    parentNode: null,
	    type: ReactMultiChildUpdateTypes.REMOVE_NODE,
	    markupIndex: null,
	    textContent: null,
	    fromIndex: fromIndex,
	    toIndex: null
	  });
	}

	/**
	 * Enqueues setting the text content.
	 *
	 * @param {string} parentID ID of the parent component.
	 * @param {string} textContent Text content to set.
	 * @private
	 */
	function enqueueTextContent(parentID, textContent) {
	  // NOTE: Null values reduce hidden classes.
	  updateQueue.push({
	    parentID: parentID,
	    parentNode: null,
	    type: ReactMultiChildUpdateTypes.TEXT_CONTENT,
	    markupIndex: null,
	    textContent: textContent,
	    fromIndex: null,
	    toIndex: null
	  });
	}

	/**
	 * Processes any enqueued updates.
	 *
	 * @private
	 */
	function processQueue() {
	  if (updateQueue.length) {
	    ReactComponentEnvironment.processChildrenUpdates(updateQueue, markupQueue);
	    clearQueue();
	  }
	}

	/**
	 * Clears any enqueued updates.
	 *
	 * @private
	 */
	function clearQueue() {
	  updateQueue.length = 0;
	  markupQueue.length = 0;
	}

	/**
	 * ReactMultiChild are capable of reconciling multiple children.
	 *
	 * @class ReactMultiChild
	 * @internal
	 */
	var ReactMultiChild = {

	  /**
	   * Provides common functionality for components that must reconcile multiple
	   * children. This is used by `ReactDOMComponent` to mount, update, and
	   * unmount child components.
	   *
	   * @lends {ReactMultiChild.prototype}
	   */
	  Mixin: {

	    /**
	     * Generates a "mount image" for each of the supplied children. In the case
	     * of `ReactDOMComponent`, a mount image is a string of markup.
	     *
	     * @param {?object} nestedChildren Nested child maps.
	     * @return {array} An array of mounted representations.
	     * @internal
	     */
	    mountChildren: function mountChildren(nestedChildren, transaction, context) {
	      var children = ReactChildReconciler.instantiateChildren(nestedChildren, transaction, context);
	      this._renderedChildren = children;
	      var mountImages = [];
	      var index = 0;
	      for (var name in children) {
	        if (children.hasOwnProperty(name)) {
	          var child = children[name];
	          // Inlined for performance, see `ReactInstanceHandles.createReactID`.
	          var rootID = this._rootNodeID + name;
	          var mountImage = ReactReconciler.mountComponent(child, rootID, transaction, context);
	          child._mountIndex = index;
	          mountImages.push(mountImage);
	          index++;
	        }
	      }
	      return mountImages;
	    },

	    /**
	     * Replaces any rendered children with a text content string.
	     *
	     * @param {string} nextContent String of content.
	     * @internal
	     */
	    updateTextContent: function updateTextContent(nextContent) {
	      updateDepth++;
	      var errorThrown = true;
	      try {
	        var prevChildren = this._renderedChildren;
	        // Remove any rendered children.
	        ReactChildReconciler.unmountChildren(prevChildren);
	        // TODO: The setTextContent operation should be enough
	        for (var name in prevChildren) {
	          if (prevChildren.hasOwnProperty(name)) {
	            this._unmountChildByName(prevChildren[name], name);
	          }
	        }
	        // Set new text content.
	        this.setTextContent(nextContent);
	        errorThrown = false;
	      } finally {
	        updateDepth--;
	        if (!updateDepth) {
	          if (errorThrown) {
	            clearQueue();
	          } else {
	            processQueue();
	          }
	        }
	      }
	    },

	    /**
	     * Updates the rendered children with new children.
	     *
	     * @param {?object} nextNestedChildren Nested child maps.
	     * @param {ReactReconcileTransaction} transaction
	     * @internal
	     */
	    updateChildren: function updateChildren(nextNestedChildren, transaction, context) {
	      updateDepth++;
	      var errorThrown = true;
	      try {
	        this._updateChildren(nextNestedChildren, transaction, context);
	        errorThrown = false;
	      } finally {
	        updateDepth--;
	        if (!updateDepth) {
	          if (errorThrown) {
	            clearQueue();
	          } else {
	            processQueue();
	          }
	        }
	      }
	    },

	    /**
	     * Improve performance by isolating this hot code path from the try/catch
	     * block in `updateChildren`.
	     *
	     * @param {?object} nextNestedChildren Nested child maps.
	     * @param {ReactReconcileTransaction} transaction
	     * @final
	     * @protected
	     */
	    _updateChildren: function _updateChildren(nextNestedChildren, transaction, context) {
	      var prevChildren = this._renderedChildren;
	      var nextChildren = ReactChildReconciler.updateChildren(prevChildren, nextNestedChildren, transaction, context);
	      this._renderedChildren = nextChildren;
	      if (!nextChildren && !prevChildren) {
	        return;
	      }
	      var name;
	      // `nextIndex` will increment for each child in `nextChildren`, but
	      // `lastIndex` will be the last index visited in `prevChildren`.
	      var lastIndex = 0;
	      var nextIndex = 0;
	      for (name in nextChildren) {
	        if (!nextChildren.hasOwnProperty(name)) {
	          continue;
	        }
	        var prevChild = prevChildren && prevChildren[name];
	        var nextChild = nextChildren[name];
	        if (prevChild === nextChild) {
	          this.moveChild(prevChild, nextIndex, lastIndex);
	          lastIndex = Math.max(prevChild._mountIndex, lastIndex);
	          prevChild._mountIndex = nextIndex;
	        } else {
	          if (prevChild) {
	            // Update `lastIndex` before `_mountIndex` gets unset by unmounting.
	            lastIndex = Math.max(prevChild._mountIndex, lastIndex);
	            this._unmountChildByName(prevChild, name);
	          }
	          // The child must be instantiated before it's mounted.
	          this._mountChildByNameAtIndex(nextChild, name, nextIndex, transaction, context);
	        }
	        nextIndex++;
	      }
	      // Remove children that are no longer present.
	      for (name in prevChildren) {
	        if (prevChildren.hasOwnProperty(name) && !(nextChildren && nextChildren.hasOwnProperty(name))) {
	          this._unmountChildByName(prevChildren[name], name);
	        }
	      }
	    },

	    /**
	     * Unmounts all rendered children. This should be used to clean up children
	     * when this component is unmounted.
	     *
	     * @internal
	     */
	    unmountChildren: function unmountChildren() {
	      var renderedChildren = this._renderedChildren;
	      ReactChildReconciler.unmountChildren(renderedChildren);
	      this._renderedChildren = null;
	    },

	    /**
	     * Moves a child component to the supplied index.
	     *
	     * @param {ReactComponent} child Component to move.
	     * @param {number} toIndex Destination index of the element.
	     * @param {number} lastIndex Last index visited of the siblings of `child`.
	     * @protected
	     */
	    moveChild: function moveChild(child, toIndex, lastIndex) {
	      // If the index of `child` is less than `lastIndex`, then it needs to
	      // be moved. Otherwise, we do not need to move it because a child will be
	      // inserted or moved before `child`.
	      if (child._mountIndex < lastIndex) {
	        enqueueMove(this._rootNodeID, child._mountIndex, toIndex);
	      }
	    },

	    /**
	     * Creates a child component.
	     *
	     * @param {ReactComponent} child Component to create.
	     * @param {string} mountImage Markup to insert.
	     * @protected
	     */
	    createChild: function createChild(child, mountImage) {
	      enqueueMarkup(this._rootNodeID, mountImage, child._mountIndex);
	    },

	    /**
	     * Removes a child component.
	     *
	     * @param {ReactComponent} child Child to remove.
	     * @protected
	     */
	    removeChild: function removeChild(child) {
	      enqueueRemove(this._rootNodeID, child._mountIndex);
	    },

	    /**
	     * Sets this text content string.
	     *
	     * @param {string} textContent Text content to set.
	     * @protected
	     */
	    setTextContent: function setTextContent(textContent) {
	      enqueueTextContent(this._rootNodeID, textContent);
	    },

	    /**
	     * Mounts a child with the supplied name.
	     *
	     * NOTE: This is part of `updateChildren` and is here for readability.
	     *
	     * @param {ReactComponent} child Component to mount.
	     * @param {string} name Name of the child.
	     * @param {number} index Index at which to insert the child.
	     * @param {ReactReconcileTransaction} transaction
	     * @private
	     */
	    _mountChildByNameAtIndex: function _mountChildByNameAtIndex(child, name, index, transaction, context) {
	      // Inlined for performance, see `ReactInstanceHandles.createReactID`.
	      var rootID = this._rootNodeID + name;
	      var mountImage = ReactReconciler.mountComponent(child, rootID, transaction, context);
	      child._mountIndex = index;
	      this.createChild(child, mountImage);
	    },

	    /**
	     * Unmounts a rendered child by name.
	     *
	     * NOTE: This is part of `updateChildren` and is here for readability.
	     *
	     * @param {ReactComponent} child Component to unmount.
	     * @param {string} name Name of the child in `this._renderedChildren`.
	     * @private
	     */
	    _unmountChildByName: function _unmountChildByName(child, name) {
	      this.removeChild(child);
	      child._mountIndex = null;
	    }

	  }

	};

	module.exports = ReactMultiChild;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactComponentEnvironment
	 */

	"use strict";

	var invariant = __webpack_require__(7);

	var injected = false;

	var ReactComponentEnvironment = {

	  /**
	   * Optionally injectable environment dependent cleanup hook. (server vs.
	   * browser etc). Example: A browser system caches DOM nodes based on component
	   * ID and must remove that cache entry when this instance is unmounted.
	   */
	  unmountIDFromEnvironment: null,

	  /**
	   * Optionally injectable hook for swapping out mount images in the middle of
	   * the tree.
	   */
	  replaceNodeWithMarkupByID: null,

	  /**
	   * Optionally injectable hook for processing a queue of child updates. Will
	   * later move into MultiChildComponents.
	   */
	  processChildrenUpdates: null,

	  injection: {
	    injectEnvironment: function injectEnvironment(environment) {
	      false ? invariant(!injected, "ReactCompositeComponent: injectEnvironment() can only be called once.") : invariant(!injected);
	      ReactComponentEnvironment.unmountIDFromEnvironment = environment.unmountIDFromEnvironment;
	      ReactComponentEnvironment.replaceNodeWithMarkupByID = environment.replaceNodeWithMarkupByID;
	      ReactComponentEnvironment.processChildrenUpdates = environment.processChildrenUpdates;
	      injected = true;
	    }
	  }

	};

	module.exports = ReactComponentEnvironment;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule invariant
	 */

	"use strict";

	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */

	var invariant = function invariant(condition, format, a, b, c, d, e, f) {
	  if (false) {
	    if (format === undefined) {
	      throw new Error("invariant requires an error message argument");
	    }
	  }

	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error("Minified exception occurred; use the non-minified dev environment " + "for the full error message and additional helpful warnings.");
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error("Invariant Violation: " + format.replace(/%s/g, function () {
	        return args[argIndex++];
	      }));
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	};

	module.exports = invariant;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactMultiChildUpdateTypes
	 */

	"use strict";

	var keyMirror = __webpack_require__(9);

	/**
	 * When a component's children are updated, a series of update configuration
	 * objects are created in order to batch and serialize the required changes.
	 *
	 * Enumerates all the possible types of update configurations.
	 *
	 * @internal
	 */
	var ReactMultiChildUpdateTypes = keyMirror({
	  INSERT_MARKUP: null,
	  MOVE_EXISTING: null,
	  REMOVE_NODE: null,
	  TEXT_CONTENT: null
	});

	module.exports = ReactMultiChildUpdateTypes;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule keyMirror
	 * @typechecks static-only
	 */

	"use strict";

	var invariant = __webpack_require__(7);

	/**
	 * Constructs an enumeration with keys equal to their value.
	 *
	 * For example:
	 *
	 *   var COLORS = keyMirror({blue: null, red: null});
	 *   var myColor = COLORS.blue;
	 *   var isColorValid = !!COLORS[myColor];
	 *
	 * The last line could not be performed if the values of the generated enum were
	 * not equal to their keys.
	 *
	 *   Input:  {key1: val1, key2: val2}
	 *   Output: {key1: key1, key2: key2}
	 *
	 * @param {object} obj
	 * @return {object}
	 */
	var keyMirror = function keyMirror(obj) {
	  var ret = {};
	  var key;
	  false ? invariant(obj instanceof Object && !Array.isArray(obj), "keyMirror(...): Argument must be an object.") : invariant(obj instanceof Object && !Array.isArray(obj));
	  for (key in obj) {
	    if (!obj.hasOwnProperty(key)) {
	      continue;
	    }
	    ret[key] = key;
	  }
	  return ret;
	};

	module.exports = keyMirror;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactReconciler
	 */

	"use strict";

	var ReactRef = __webpack_require__(11);
	var ReactElementValidator = __webpack_require__(13);

	/**
	 * Helper to call ReactRef.attachRefs with this composite component, split out
	 * to avoid allocations in the transaction mount-ready queue.
	 */
	function attachRefs() {
	  ReactRef.attachRefs(this, this._currentElement);
	}

	var ReactReconciler = {

	  /**
	   * Initializes the component, renders markup, and registers event listeners.
	   *
	   * @param {ReactComponent} internalInstance
	   * @param {string} rootID DOM ID of the root node.
	   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
	   * @return {?string} Rendered markup to be inserted into the DOM.
	   * @final
	   * @internal
	   */
	  mountComponent: function mountComponent(internalInstance, rootID, transaction, context) {
	    var markup = internalInstance.mountComponent(rootID, transaction, context);
	    if (false) {
	      ReactElementValidator.checkAndWarnForMutatedProps(internalInstance._currentElement);
	    }
	    transaction.getReactMountReady().enqueue(attachRefs, internalInstance);
	    return markup;
	  },

	  /**
	   * Releases any resources allocated by `mountComponent`.
	   *
	   * @final
	   * @internal
	   */
	  unmountComponent: function unmountComponent(internalInstance) {
	    ReactRef.detachRefs(internalInstance, internalInstance._currentElement);
	    internalInstance.unmountComponent();
	  },

	  /**
	   * Update a component using a new element.
	   *
	   * @param {ReactComponent} internalInstance
	   * @param {ReactElement} nextElement
	   * @param {ReactReconcileTransaction} transaction
	   * @param {object} context
	   * @internal
	   */
	  receiveComponent: function receiveComponent(internalInstance, nextElement, transaction, context) {
	    var prevElement = internalInstance._currentElement;

	    if (nextElement === prevElement && nextElement._owner != null) {
	      // Since elements are immutable after the owner is rendered,
	      // we can do a cheap identity compare here to determine if this is a
	      // superfluous reconcile. It's possible for state to be mutable but such
	      // change should trigger an update of the owner which would recreate
	      // the element. We explicitly check for the existence of an owner since
	      // it's possible for an element created outside a composite to be
	      // deeply mutated and reused.
	      return;
	    }

	    if (false) {
	      ReactElementValidator.checkAndWarnForMutatedProps(nextElement);
	    }

	    var refsChanged = ReactRef.shouldUpdateRefs(prevElement, nextElement);

	    if (refsChanged) {
	      ReactRef.detachRefs(internalInstance, prevElement);
	    }

	    internalInstance.receiveComponent(nextElement, transaction, context);

	    if (refsChanged) {
	      transaction.getReactMountReady().enqueue(attachRefs, internalInstance);
	    }
	  },

	  /**
	   * Flush any dirty changes in a component.
	   *
	   * @param {ReactComponent} internalInstance
	   * @param {ReactReconcileTransaction} transaction
	   * @internal
	   */
	  performUpdateIfNecessary: function performUpdateIfNecessary(internalInstance, transaction) {
	    internalInstance.performUpdateIfNecessary(transaction);
	  }

	};

	module.exports = ReactReconciler;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactRef
	 */

	'use strict';

	var ReactOwner = __webpack_require__(12);

	var ReactRef = {};

	function attachRef(ref, component, owner) {
	  if (typeof ref === 'function') {
	    ref(component.getPublicInstance());
	  } else {
	    // Legacy ref
	    ReactOwner.addComponentAsRefTo(component, ref, owner);
	  }
	}

	function detachRef(ref, component, owner) {
	  if (typeof ref === 'function') {
	    ref(null);
	  } else {
	    // Legacy ref
	    ReactOwner.removeComponentAsRefFrom(component, ref, owner);
	  }
	}

	ReactRef.attachRefs = function (instance, element) {
	  var ref = element.ref;
	  if (ref != null) {
	    attachRef(ref, instance, element._owner);
	  }
	};

	ReactRef.shouldUpdateRefs = function (prevElement, nextElement) {
	  // If either the owner or a `ref` has changed, make sure the newest owner
	  // has stored a reference to `this`, and the previous owner (if different)
	  // has forgotten the reference to `this`. We use the element instead
	  // of the public this.props because the post processing cannot determine
	  // a ref. The ref conceptually lives on the element.

	  // TODO: Should this even be possible? The owner cannot change because
	  // it's forbidden by shouldUpdateReactComponent. The ref can change
	  // if you swap the keys of but not the refs. Reconsider where this check
	  // is made. It probably belongs where the key checking and
	  // instantiateReactComponent is done.

	  return nextElement._owner !== prevElement._owner || nextElement.ref !== prevElement.ref;
	};

	ReactRef.detachRefs = function (instance, element) {
	  var ref = element.ref;
	  if (ref != null) {
	    detachRef(ref, instance, element._owner);
	  }
	};

	module.exports = ReactRef;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactOwner
	 */

	'use strict';

	var invariant = __webpack_require__(7);

	/**
	 * ReactOwners are capable of storing references to owned components.
	 *
	 * All components are capable of //being// referenced by owner components, but
	 * only ReactOwner components are capable of //referencing// owned components.
	 * The named reference is known as a "ref".
	 *
	 * Refs are available when mounted and updated during reconciliation.
	 *
	 *   var MyComponent = React.createClass({
	 *     render: function() {
	 *       return (
	 *         <div onClick={this.handleClick}>
	 *           <CustomComponent ref="custom" />
	 *         </div>
	 *       );
	 *     },
	 *     handleClick: function() {
	 *       this.refs.custom.handleClick();
	 *     },
	 *     componentDidMount: function() {
	 *       this.refs.custom.initialize();
	 *     }
	 *   });
	 *
	 * Refs should rarely be used. When refs are used, they should only be done to
	 * control data that is not handled by React's data flow.
	 *
	 * @class ReactOwner
	 */
	var ReactOwner = {

	  /**
	   * @param {?object} object
	   * @return {boolean} True if `object` is a valid owner.
	   * @final
	   */
	  isValidOwner: function isValidOwner(object) {
	    return !!(object && typeof object.attachRef === 'function' && typeof object.detachRef === 'function');
	  },

	  /**
	   * Adds a component by ref to an owner component.
	   *
	   * @param {ReactComponent} component Component to reference.
	   * @param {string} ref Name by which to refer to the component.
	   * @param {ReactOwner} owner Component on which to record the ref.
	   * @final
	   * @internal
	   */
	  addComponentAsRefTo: function addComponentAsRefTo(component, ref, owner) {
	    false ? invariant(ReactOwner.isValidOwner(owner), 'addComponentAsRefTo(...): Only a ReactOwner can have refs. This ' + 'usually means that you\'re trying to add a ref to a component that ' + 'doesn\'t have an owner (that is, was not created inside of another ' + 'component\'s `render` method). Try rendering this component inside of ' + 'a new top-level component which will hold the ref.') : invariant(ReactOwner.isValidOwner(owner));
	    owner.attachRef(ref, component);
	  },

	  /**
	   * Removes a component by ref from an owner component.
	   *
	   * @param {ReactComponent} component Component to dereference.
	   * @param {string} ref Name of the ref to remove.
	   * @param {ReactOwner} owner Component on which the ref is recorded.
	   * @final
	   * @internal
	   */
	  removeComponentAsRefFrom: function removeComponentAsRefFrom(component, ref, owner) {
	    false ? invariant(ReactOwner.isValidOwner(owner), 'removeComponentAsRefFrom(...): Only a ReactOwner can have refs. This ' + 'usually means that you\'re trying to remove a ref to a component that ' + 'doesn\'t have an owner (that is, was not created inside of another ' + 'component\'s `render` method). Try rendering this component inside of ' + 'a new top-level component which will hold the ref.') : invariant(ReactOwner.isValidOwner(owner));
	    // Check that `component` is still the current ref because we do not want to
	    // detach the ref if another component stole it.
	    if (owner.getPublicInstance().refs[ref] === component.getPublicInstance()) {
	      owner.detachRef(ref);
	    }
	  }

	};

	module.exports = ReactOwner;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactElementValidator
	 */

	/**
	 * ReactElementValidator provides a wrapper around a element factory
	 * which validates the props passed to the element. This is intended to be
	 * used only in DEV and could be replaced by a static type checker for languages
	 * that support it.
	 */

	"use strict";

	var ReactElement = __webpack_require__(15);
	var ReactFragment = __webpack_require__(22);
	var ReactPropTypeLocations = __webpack_require__(23);
	var ReactPropTypeLocationNames = __webpack_require__(24);
	var ReactCurrentOwner = __webpack_require__(21);
	var ReactNativeComponent = __webpack_require__(25);

	var getIteratorFn = __webpack_require__(14);
	var invariant = __webpack_require__(7);
	var warning = __webpack_require__(16);

	function getDeclarationErrorAddendum() {
	  if (ReactCurrentOwner.current) {
	    var name = ReactCurrentOwner.current.getName();
	    if (name) {
	      return " Check the render method of `" + name + "`.";
	    }
	  }
	  return "";
	}

	/**
	 * Warn if there's no key explicitly set on dynamic arrays of children or
	 * object keys are not valid. This allows us to keep track of children between
	 * updates.
	 */
	var ownerHasKeyUseWarning = {};

	var loggedTypeFailures = {};

	var NUMERIC_PROPERTY_REGEX = /^\d+$/;

	/**
	 * Gets the instance's name for use in warnings.
	 *
	 * @internal
	 * @return {?string} Display name or undefined
	 */
	function getName(instance) {
	  var publicInstance = instance && instance.getPublicInstance();
	  if (!publicInstance) {
	    return undefined;
	  }
	  var constructor = publicInstance.constructor;
	  if (!constructor) {
	    return undefined;
	  }
	  return constructor.displayName || constructor.name || undefined;
	}

	/**
	 * Gets the current owner's displayName for use in warnings.
	 *
	 * @internal
	 * @return {?string} Display name or undefined
	 */
	function getCurrentOwnerDisplayName() {
	  var current = ReactCurrentOwner.current;
	  return current && getName(current) || undefined;
	}

	/**
	 * Warn if the element doesn't have an explicit key assigned to it.
	 * This element is in an array. The array could grow and shrink or be
	 * reordered. All children that haven't already been validated are required to
	 * have a "key" property assigned to it.
	 *
	 * @internal
	 * @param {ReactElement} element Element that requires a key.
	 * @param {*} parentType element's parent's type.
	 */
	function validateExplicitKey(element, parentType) {
	  if (element._store.validated || element.key != null) {
	    return;
	  }
	  element._store.validated = true;

	  warnAndMonitorForKeyUse("Each child in an array or iterator should have a unique \"key\" prop.", element, parentType);
	}

	/**
	 * Warn if the key is being defined as an object property but has an incorrect
	 * value.
	 *
	 * @internal
	 * @param {string} name Property name of the key.
	 * @param {ReactElement} element Component that requires a key.
	 * @param {*} parentType element's parent's type.
	 */
	function validatePropertyKey(name, element, parentType) {
	  if (!NUMERIC_PROPERTY_REGEX.test(name)) {
	    return;
	  }
	  warnAndMonitorForKeyUse("Child objects should have non-numeric keys so ordering is preserved.", element, parentType);
	}

	/**
	 * Shared warning and monitoring code for the key warnings.
	 *
	 * @internal
	 * @param {string} message The base warning that gets output.
	 * @param {ReactElement} element Component that requires a key.
	 * @param {*} parentType element's parent's type.
	 */
	function warnAndMonitorForKeyUse(message, element, parentType) {
	  var ownerName = getCurrentOwnerDisplayName();
	  var parentName = typeof parentType === "string" ? parentType : parentType.displayName || parentType.name;

	  var useName = ownerName || parentName;
	  var memoizer = ownerHasKeyUseWarning[message] || (ownerHasKeyUseWarning[message] = {});
	  if (memoizer.hasOwnProperty(useName)) {
	    return;
	  }
	  memoizer[useName] = true;

	  var parentOrOwnerAddendum = ownerName ? " Check the render method of " + ownerName + "." : parentName ? " Check the React.render call using <" + parentName + ">." : "";

	  // Usually the current owner is the offender, but if it accepts children as a
	  // property, it may be the creator of the child that's responsible for
	  // assigning it a key.
	  var childOwnerAddendum = "";
	  if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
	    // Name of the component that originally created this child.
	    var childOwnerName = getName(element._owner);

	    childOwnerAddendum = " It was passed a child from " + childOwnerName + ".";
	  }

	  false ? warning(false, message + "%s%s See https://fb.me/react-warning-keys for more information.", parentOrOwnerAddendum, childOwnerAddendum) : null;
	}

	/**
	 * Ensure that every element either is passed in a static location, in an
	 * array with an explicit keys property defined, or in an object literal
	 * with valid key property.
	 *
	 * @internal
	 * @param {ReactNode} node Statically passed child of any type.
	 * @param {*} parentType node's parent's type.
	 */
	function validateChildKeys(node, parentType) {
	  if (Array.isArray(node)) {
	    for (var i = 0; i < node.length; i++) {
	      var child = node[i];
	      if (ReactElement.isValidElement(child)) {
	        validateExplicitKey(child, parentType);
	      }
	    }
	  } else if (ReactElement.isValidElement(node)) {
	    // This element was passed in a valid location.
	    node._store.validated = true;
	  } else if (node) {
	    var iteratorFn = getIteratorFn(node);
	    // Entry iterators provide implicit keys.
	    if (iteratorFn) {
	      if (iteratorFn !== node.entries) {
	        var iterator = iteratorFn.call(node);
	        var step;
	        while (!(step = iterator.next()).done) {
	          if (ReactElement.isValidElement(step.value)) {
	            validateExplicitKey(step.value, parentType);
	          }
	        }
	      }
	    } else if (typeof node === "object") {
	      var fragment = ReactFragment.extractIfFragment(node);
	      for (var key in fragment) {
	        if (fragment.hasOwnProperty(key)) {
	          validatePropertyKey(key, fragment[key], parentType);
	        }
	      }
	    }
	  }
	}

	/**
	 * Assert that the props are valid
	 *
	 * @param {string} componentName Name of the component for error messages.
	 * @param {object} propTypes Map of prop name to a ReactPropType
	 * @param {object} props
	 * @param {string} location e.g. "prop", "context", "child context"
	 * @private
	 */
	function checkPropTypes(componentName, propTypes, props, location) {
	  for (var propName in propTypes) {
	    if (propTypes.hasOwnProperty(propName)) {
	      var error;
	      // Prop type validation may throw. In case they do, we don't want to
	      // fail the render phase where it didn't fail before. So we log it.
	      // After these have been cleaned up, we'll let them throw.
	      try {
	        // This is intentionally an invariant that gets caught. It's the same
	        // behavior as without this statement except with a better message.
	        false ? invariant(typeof propTypes[propName] === "function", "%s: %s type `%s` is invalid; it must be a function, usually from " + "React.PropTypes.", componentName || "React class", ReactPropTypeLocationNames[location], propName) : invariant(typeof propTypes[propName] === "function");
	        error = propTypes[propName](props, propName, componentName, location);
	      } catch (ex) {
	        error = ex;
	      }
	      if (error instanceof Error && !(error.message in loggedTypeFailures)) {
	        // Only monitor this failure once because there tends to be a lot of the
	        // same error.
	        loggedTypeFailures[error.message] = true;

	        var addendum = getDeclarationErrorAddendum(this);
	        false ? warning(false, "Failed propType: %s%s", error.message, addendum) : null;
	      }
	    }
	  }
	}

	var warnedPropsMutations = {};

	/**
	 * Warn about mutating props when setting `propName` on `element`.
	 *
	 * @param {string} propName The string key within props that was set
	 * @param {ReactElement} element
	 */
	function warnForPropsMutation(propName, element) {
	  var type = element.type;
	  var elementName = typeof type === "string" ? type : type.displayName;
	  var ownerName = element._owner ? element._owner.getPublicInstance().constructor.displayName : null;

	  var warningKey = propName + "|" + elementName + "|" + ownerName;
	  if (warnedPropsMutations.hasOwnProperty(warningKey)) {
	    return;
	  }
	  warnedPropsMutations[warningKey] = true;

	  var elementInfo = "";
	  if (elementName) {
	    elementInfo = " <" + elementName + " />";
	  }
	  var ownerInfo = "";
	  if (ownerName) {
	    ownerInfo = " The element was created by " + ownerName + ".";
	  }

	  false ? warning(false, "Don't set .props.%s of the React component%s. Instead, specify the " + "correct value when initially creating the element or use " + "React.cloneElement to make a new element with updated props.%s", propName, elementInfo, ownerInfo) : null;
	}

	// Inline Object.is polyfill
	function is(a, b) {
	  if (a !== a) {
	    // NaN
	    return b !== b;
	  }
	  if (a === 0 && b === 0) {
	    // +-0
	    return 1 / a === 1 / b;
	  }
	  return a === b;
	}

	/**
	 * Given an element, check if its props have been mutated since element
	 * creation (or the last call to this function). In particular, check if any
	 * new props have been added, which we can't directly catch by defining warning
	 * properties on the props object.
	 *
	 * @param {ReactElement} element
	 */
	function checkAndWarnForMutatedProps(element) {
	  if (!element._store) {
	    // Element was created using `new ReactElement` directly or with
	    // `ReactElement.createElement`; skip mutation checking
	    return;
	  }

	  var originalProps = element._store.originalProps;
	  var props = element.props;

	  for (var propName in props) {
	    if (props.hasOwnProperty(propName)) {
	      if (!originalProps.hasOwnProperty(propName) || !is(originalProps[propName], props[propName])) {
	        warnForPropsMutation(propName, element);

	        // Copy over the new value so that the two props objects match again
	        originalProps[propName] = props[propName];
	      }
	    }
	  }
	}

	/**
	 * Given an element, validate that its props follow the propTypes definition,
	 * provided by the type.
	 *
	 * @param {ReactElement} element
	 */
	function validatePropTypes(element) {
	  if (element.type == null) {
	    // This has already warned. Don't throw.
	    return;
	  }
	  // Extract the component class from the element. Converts string types
	  // to a composite class which may have propTypes.
	  // TODO: Validating a string's propTypes is not decoupled from the
	  // rendering target which is problematic.
	  var componentClass = ReactNativeComponent.getComponentClassForElement(element);
	  var name = componentClass.displayName || componentClass.name;
	  if (componentClass.propTypes) {
	    checkPropTypes(name, componentClass.propTypes, element.props, ReactPropTypeLocations.prop);
	  }
	  if (typeof componentClass.getDefaultProps === "function") {
	    false ? warning(componentClass.getDefaultProps.isReactClassApproved, "getDefaultProps is only used on classic React.createClass " + "definitions. Use a static property named `defaultProps` instead.") : null;
	  }
	}

	var ReactElementValidator = {

	  checkAndWarnForMutatedProps: checkAndWarnForMutatedProps,

	  createElement: function createElement(type, props, children) {
	    // We warn in this case but don't throw. We expect the element creation to
	    // succeed and there will likely be errors in render.
	    false ? warning(type != null, "React.createElement: type should not be null or undefined. It should " + "be a string (for DOM elements) or a ReactClass (for composite " + "components).") : null;

	    var element = ReactElement.createElement.apply(this, arguments);

	    // The result can be nullish if a mock or a custom function is used.
	    // TODO: Drop this when these are no longer allowed as the type argument.
	    if (element == null) {
	      return element;
	    }

	    for (var i = 2; i < arguments.length; i++) {
	      validateChildKeys(arguments[i], type);
	    }

	    validatePropTypes(element);

	    return element;
	  },

	  createFactory: function createFactory(type) {
	    var validatedFactory = ReactElementValidator.createElement.bind(null, type);
	    // Legacy hook TODO: Warn if this is accessed
	    validatedFactory.type = type;

	    if (false) {
	      try {
	        Object.defineProperty(validatedFactory, "type", {
	          enumerable: false,
	          get: function get() {
	            "production" !== process.env.NODE_ENV ? warning(false, "Factory.type is deprecated. Access the class directly " + "before passing it to createFactory.") : null;
	            Object.defineProperty(this, "type", {
	              value: type
	            });
	            return type;
	          }
	        });
	      } catch (x) {}
	    }

	    return validatedFactory;
	  },

	  cloneElement: function cloneElement(element, props, children) {
	    var newElement = ReactElement.cloneElement.apply(this, arguments);
	    for (var i = 2; i < arguments.length; i++) {
	      validateChildKeys(arguments[i], newElement.type);
	    }
	    validatePropTypes(newElement);
	    return newElement;
	  }

	};

	module.exports = ReactElementValidator;

	// IE will fail on defineProperty (es5-shim/sham too)

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule getIteratorFn
	 * @typechecks static-only
	 */

	'use strict';

	/* global Symbol */
	var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
	var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

	/**
	 * Returns the iterator method function contained on the iterable object.
	 *
	 * Be sure to invoke the function with the iterable as context:
	 *
	 *     var iteratorFn = getIteratorFn(myIterable);
	 *     if (iteratorFn) {
	 *       var iterator = iteratorFn.call(myIterable);
	 *       ...
	 *     }
	 *
	 * @param {?object} maybeIterable
	 * @return {?function}
	 */
	function getIteratorFn(maybeIterable) {
	  var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
	  if (typeof iteratorFn === 'function') {
	    return iteratorFn;
	  }
	}

	module.exports = getIteratorFn;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactElement
	 */

	"use strict";

	var ReactContext = __webpack_require__(18);
	var ReactCurrentOwner = __webpack_require__(21);

	var assign = __webpack_require__(19);
	var warning = __webpack_require__(16);

	var RESERVED_PROPS = {
	  key: true,
	  ref: true
	};

	/**
	 * Warn for mutations.
	 *
	 * @internal
	 * @param {object} object
	 * @param {string} key
	 */
	function defineWarningProperty(object, key) {
	  Object.defineProperty(object, key, {

	    configurable: false,
	    enumerable: true,

	    get: function get() {
	      if (!this._store) {
	        return null;
	      }
	      return this._store[key];
	    },

	    set: function set(value) {
	      false ? warning(false, "Don't set the %s property of the React element. Instead, " + "specify the correct value when initially creating the element.", key) : null;
	      this._store[key] = value;
	    }

	  });
	}

	/**
	 * This is updated to true if the membrane is successfully created.
	 */
	var useMutationMembrane = false;

	/**
	 * Warn for mutations.
	 *
	 * @internal
	 * @param {object} element
	 */
	function defineMutationMembrane(prototype) {
	  try {
	    var pseudoFrozenProperties = {
	      props: true
	    };
	    for (var key in pseudoFrozenProperties) {
	      defineWarningProperty(prototype, key);
	    }
	    useMutationMembrane = true;
	  } catch (x) {}
	}

	/**
	 * Base constructor for all React elements. This is only used to make this
	 * work with a dynamic instanceof check. Nothing should live on this prototype.
	 *
	 * @param {*} type
	 * @param {string|object} ref
	 * @param {*} key
	 * @param {*} props
	 * @internal
	 */
	var ReactElement = function ReactElement(type, key, ref, owner, context, props) {
	  // Built-in properties that belong on the element
	  this.type = type;
	  this.key = key;
	  this.ref = ref;

	  // Record the component responsible for creating this element.
	  this._owner = owner;

	  // TODO: Deprecate withContext, and then the context becomes accessible
	  // through the owner.
	  this._context = context;

	  if (false) {
	    // The validation flag and props are currently mutative. We put them on
	    // an external backing store so that we can freeze the whole object.
	    // This can be replaced with a WeakMap once they are implemented in
	    // commonly used development environments.
	    this._store = { props: props, originalProps: assign({}, props) };

	    // To make comparing ReactElements easier for testing purposes, we make
	    // the validation flag non-enumerable (where possible, which should
	    // include every environment we run tests in), so the test framework
	    // ignores it.
	    try {
	      Object.defineProperty(this._store, "validated", {
	        configurable: false,
	        enumerable: false,
	        writable: true
	      });
	    } catch (x) {}
	    this._store.validated = false;

	    // We're not allowed to set props directly on the object so we early
	    // return and rely on the prototype membrane to forward to the backing
	    // store.
	    if (useMutationMembrane) {
	      Object.freeze(this);
	      return;
	    }
	  }

	  this.props = props;
	};

	// We intentionally don't expose the function on the constructor property.
	// ReactElement should be indistinguishable from a plain object.
	ReactElement.prototype = {
	  _isReactElement: true
	};

	if (false) {
	  defineMutationMembrane(ReactElement.prototype);
	}

	ReactElement.createElement = function (type, config, children) {
	  var propName;

	  // Reserved names are extracted
	  var props = {};

	  var key = null;
	  var ref = null;

	  if (config != null) {
	    ref = config.ref === undefined ? null : config.ref;
	    key = config.key === undefined ? null : "" + config.key;
	    // Remaining properties are added to a new props object
	    for (propName in config) {
	      if (config.hasOwnProperty(propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
	        props[propName] = config[propName];
	      }
	    }
	  }

	  // Children can be more than one argument, and those are transferred onto
	  // the newly allocated props object.
	  var childrenLength = arguments.length - 2;
	  if (childrenLength === 1) {
	    props.children = children;
	  } else if (childrenLength > 1) {
	    var childArray = Array(childrenLength);
	    for (var i = 0; i < childrenLength; i++) {
	      childArray[i] = arguments[i + 2];
	    }
	    props.children = childArray;
	  }

	  // Resolve default props
	  if (type && type.defaultProps) {
	    var defaultProps = type.defaultProps;
	    for (propName in defaultProps) {
	      if (typeof props[propName] === "undefined") {
	        props[propName] = defaultProps[propName];
	      }
	    }
	  }

	  return new ReactElement(type, key, ref, ReactCurrentOwner.current, ReactContext.current, props);
	};

	ReactElement.createFactory = function (type) {
	  var factory = ReactElement.createElement.bind(null, type);
	  // Expose the type on the factory and the prototype so that it can be
	  // easily accessed on elements. E.g. <Foo />.type === Foo.type.
	  // This should not be named `constructor` since this may not be the function
	  // that created the element, and it may not even be a constructor.
	  // Legacy hook TODO: Warn if this is accessed
	  factory.type = type;
	  return factory;
	};

	ReactElement.cloneAndReplaceProps = function (oldElement, newProps) {
	  var newElement = new ReactElement(oldElement.type, oldElement.key, oldElement.ref, oldElement._owner, oldElement._context, newProps);

	  if (false) {
	    // If the key on the original is valid, then the clone is valid
	    newElement._store.validated = oldElement._store.validated;
	  }
	  return newElement;
	};

	ReactElement.cloneElement = function (element, config, children) {
	  var propName;

	  // Original props are copied
	  var props = assign({}, element.props);

	  // Reserved names are extracted
	  var key = element.key;
	  var ref = element.ref;

	  // Owner will be preserved, unless ref is overridden
	  var owner = element._owner;

	  if (config != null) {
	    if (config.ref !== undefined) {
	      // Silently steal the ref from the parent.
	      ref = config.ref;
	      owner = ReactCurrentOwner.current;
	    }
	    if (config.key !== undefined) {
	      key = "" + config.key;
	    }
	    // Remaining properties override existing props
	    for (propName in config) {
	      if (config.hasOwnProperty(propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
	        props[propName] = config[propName];
	      }
	    }
	  }

	  // Children can be more than one argument, and those are transferred onto
	  // the newly allocated props object.
	  var childrenLength = arguments.length - 2;
	  if (childrenLength === 1) {
	    props.children = children;
	  } else if (childrenLength > 1) {
	    var childArray = Array(childrenLength);
	    for (var i = 0; i < childrenLength; i++) {
	      childArray[i] = arguments[i + 2];
	    }
	    props.children = childArray;
	  }

	  return new ReactElement(element.type, key, ref, owner, element._context, props);
	};

	/**
	 * @param {?object} object
	 * @return {boolean} True if `object` is a valid component.
	 * @final
	 */
	ReactElement.isValidElement = function (object) {
	  // ReactTestUtils is often used outside of beforeEach where as React is
	  // within it. This leads to two different instances of React on the same
	  // page. To identify a element from a different React instance we use
	  // a flag instead of an instanceof check.
	  var isElement = !!(object && object._isReactElement);
	  // if (isElement && !(object instanceof ReactElement)) {
	  // This is an indicator that you're using multiple versions of React at the
	  // same time. This will screw with ownership and stuff. Fix it, please.
	  // TODO: We could possibly warn here.
	  // }
	  return isElement;
	};

	module.exports = ReactElement;

	// IE will fail on defineProperty

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule warning
	 */

	"use strict";

	var emptyFunction = __webpack_require__(17);

	/**
	 * Similar to invariant but only logs a warning if the condition is not met.
	 * This can be used to log issues in development environments in critical
	 * paths. Removing the logging code for production environments will keep the
	 * same logic and follow the same code paths.
	 */

	var warning = emptyFunction;

	if (false) {
	  warning = function (condition, format) {
	    for (var args = [], $__0 = 2, $__1 = arguments.length; $__0 < $__1; $__0++) args.push(arguments[$__0]);
	    if (format === undefined) {
	      throw new Error("`warning(condition, format, ...args)` requires a warning " + "message argument");
	    }

	    if (format.length < 10 || /^[s\W]*$/.test(format)) {
	      throw new Error("The warning format should be able to uniquely identify this " + "warning. Please, use a more descriptive format than: " + format);
	    }

	    if (format.indexOf("Failed Composite propType: ") === 0) {
	      return; // Ignore CompositeComponent proptype check.
	    }

	    if (!condition) {
	      var argIndex = 0;
	      var message = "Warning: " + format.replace(/%s/g, function () {
	        return args[argIndex++];
	      });
	      console.warn(message);
	      try {
	        // --- Welcome to debugging React ---
	        // This error was thrown as a convenience so that you can use this stack
	        // to find the callsite that caused this warning to fire.
	        throw new Error(message);
	      } catch (x) {}
	    }
	  };
	}

	module.exports = warning;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule emptyFunction
	 */

	"use strict";

	function makeEmptyFunction(arg) {
	  return function () {
	    return arg;
	  };
	}

	/**
	 * This function accepts and discards inputs; it has no side effects. This is
	 * primarily useful idiomatically for overridable function endpoints which
	 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
	 */
	function emptyFunction() {}

	emptyFunction.thatReturns = makeEmptyFunction;
	emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
	emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
	emptyFunction.thatReturnsNull = makeEmptyFunction(null);
	emptyFunction.thatReturnsThis = function () {
	  return this;
	};
	emptyFunction.thatReturnsArgument = function (arg) {
	  return arg;
	};

	module.exports = emptyFunction;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactContext
	 */

	"use strict";

	var assign = __webpack_require__(19);
	var emptyObject = __webpack_require__(20);
	var warning = __webpack_require__(16);

	var didWarn = false;

	/**
	 * Keeps track of the current context.
	 *
	 * The context is automatically passed down the component ownership hierarchy
	 * and is accessible via `this.context` on ReactCompositeComponents.
	 */
	var ReactContext = {

	  /**
	   * @internal
	   * @type {object}
	   */
	  current: emptyObject,

	  /**
	   * Temporarily extends the current context while executing scopedCallback.
	   *
	   * A typical use case might look like
	   *
	   *  render: function() {
	   *    var children = ReactContext.withContext({foo: 'foo'}, () => (
	   *
	   *    ));
	   *    return <div>{children}</div>;
	   *  }
	   *
	   * @param {object} newContext New context to merge into the existing context
	   * @param {function} scopedCallback Callback to run with the new context
	   * @return {ReactComponent|array<ReactComponent>}
	   */
	  withContext: function withContext(newContext, scopedCallback) {
	    if (false) {
	      "production" !== process.env.NODE_ENV ? warning(didWarn, "withContext is deprecated and will be removed in a future version. " + "Use a wrapper component with getChildContext instead.") : null;

	      didWarn = true;
	    }

	    var result;
	    var previousContext = ReactContext.current;
	    ReactContext.current = assign({}, previousContext, newContext);
	    try {
	      result = scopedCallback();
	    } finally {
	      ReactContext.current = previousContext;
	    }
	    return result;
	  }

	};

	module.exports = ReactContext;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule Object.assign
	 */

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.assign

	'use strict';

	function assign(target, sources) {
	  if (target == null) {
	    throw new TypeError('Object.assign target cannot be null or undefined');
	  }

	  var to = Object(target);
	  var hasOwnProperty = Object.prototype.hasOwnProperty;

	  for (var nextIndex = 1; nextIndex < arguments.length; nextIndex++) {
	    var nextSource = arguments[nextIndex];
	    if (nextSource == null) {
	      continue;
	    }

	    var from = Object(nextSource);

	    // We don't currently support accessors nor proxies. Therefore this
	    // copy cannot throw. If we ever supported this then we must handle
	    // exceptions and side-effects. We don't support symbols so they won't
	    // be transferred.

	    for (var key in from) {
	      if (hasOwnProperty.call(from, key)) {
	        to[key] = from[key];
	      }
	    }
	  }

	  return to;
	}

	module.exports = assign;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule emptyObject
	 */

	"use strict";

	var emptyObject = {};

	if (false) {
	  Object.freeze(emptyObject);
	}

	module.exports = emptyObject;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactCurrentOwner
	 */

	'use strict';

	/**
	 * Keeps track of the current owner.
	 *
	 * The current owner is the component who should own any components that are
	 * currently being constructed.
	 *
	 * The depth indicate how many composite components are above this render level.
	 */
	var ReactCurrentOwner = {

	  /**
	   * @internal
	   * @type {ReactComponent}
	   */
	  current: null

	};

	module.exports = ReactCurrentOwner;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	* @providesModule ReactFragment
	*/

	"use strict";

	var ReactElement = __webpack_require__(15);

	var warning = __webpack_require__(16);

	/**
	 * We used to allow keyed objects to serve as a collection of ReactElements,
	 * or nested sets. This allowed us a way to explicitly key a set a fragment of
	 * components. This is now being replaced with an opaque data structure.
	 * The upgrade path is to call React.addons.createFragment({ key: value }) to
	 * create a keyed fragment. The resulting data structure is opaque, for now.
	 */

	if (false) {
	  var fragmentKey = "_reactFragment";
	  var didWarnKey = "_reactDidWarn";
	  var canWarnForReactFragment = false;

	  try {
	    // Feature test. Don't even try to issue this warning if we can't use
	    // enumerable: false.

	    var dummy = function dummy() {
	      return 1;
	    };

	    Object.defineProperty({}, fragmentKey, { enumerable: false, value: true });

	    Object.defineProperty({}, "key", { enumerable: true, get: dummy });

	    canWarnForReactFragment = true;
	  } catch (x) {}

	  var proxyPropertyAccessWithWarning = function proxyPropertyAccessWithWarning(obj, key) {
	    Object.defineProperty(obj, key, {
	      enumerable: true,
	      get: function get() {
	        "production" !== process.env.NODE_ENV ? warning(this[didWarnKey], "A ReactFragment is an opaque type. Accessing any of its " + "properties is deprecated. Pass it to one of the React.Children " + "helpers.") : null;
	        this[didWarnKey] = true;
	        return this[fragmentKey][key];
	      },
	      set: function set(value) {
	        "production" !== process.env.NODE_ENV ? warning(this[didWarnKey], "A ReactFragment is an immutable opaque type. Mutating its " + "properties is deprecated.") : null;
	        this[didWarnKey] = true;
	        this[fragmentKey][key] = value;
	      }
	    });
	  };

	  var issuedWarnings = {};

	  var didWarnForFragment = function didWarnForFragment(fragment) {
	    // We use the keys and the type of the value as a heuristic to dedupe the
	    // warning to avoid spamming too much.
	    var fragmentCacheKey = "";
	    for (var key in fragment) {
	      fragmentCacheKey += key + ":" + typeof fragment[key] + ",";
	    }
	    var alreadyWarnedOnce = !!issuedWarnings[fragmentCacheKey];
	    issuedWarnings[fragmentCacheKey] = true;
	    return alreadyWarnedOnce;
	  };
	}

	var ReactFragment = {
	  // Wrap a keyed object in an opaque proxy that warns you if you access any
	  // of its properties.
	  create: function create(object) {
	    if (false) {
	      if (typeof object !== "object" || !object || Array.isArray(object)) {
	        "production" !== process.env.NODE_ENV ? warning(false, "React.addons.createFragment only accepts a single object.", object) : null;
	        return object;
	      }
	      if (ReactElement.isValidElement(object)) {
	        "production" !== process.env.NODE_ENV ? warning(false, "React.addons.createFragment does not accept a ReactElement " + "without a wrapper object.") : null;
	        return object;
	      }
	      if (canWarnForReactFragment) {
	        var proxy = {};
	        Object.defineProperty(proxy, fragmentKey, {
	          enumerable: false,
	          value: object
	        });
	        Object.defineProperty(proxy, didWarnKey, {
	          writable: true,
	          enumerable: false,
	          value: false
	        });
	        for (var key in object) {
	          proxyPropertyAccessWithWarning(proxy, key);
	        }
	        Object.preventExtensions(proxy);
	        return proxy;
	      }
	    }
	    return object;
	  },
	  // Extract the original keyed object from the fragment opaque type. Warn if
	  // a plain object is passed here.
	  extract: function extract(fragment) {
	    if (false) {
	      if (canWarnForReactFragment) {
	        if (!fragment[fragmentKey]) {
	          "production" !== process.env.NODE_ENV ? warning(didWarnForFragment(fragment), "Any use of a keyed object should be wrapped in " + "React.addons.createFragment(object) before being passed as a " + "child.") : null;
	          return fragment;
	        }
	        return fragment[fragmentKey];
	      }
	    }
	    return fragment;
	  },
	  // Check if this is a fragment and if so, extract the keyed object. If it
	  // is a fragment-like object, warn that it should be wrapped. Ignore if we
	  // can't determine what kind of object this is.
	  extractIfFragment: function extractIfFragment(fragment) {
	    if (false) {
	      if (canWarnForReactFragment) {
	        // If it is the opaque type, return the keyed object.
	        if (fragment[fragmentKey]) {
	          return fragment[fragmentKey];
	        }
	        // Otherwise, check each property if it has an element, if it does
	        // it is probably meant as a fragment, so we can warn early. Defer,
	        // the warning to extract.
	        for (var key in fragment) {
	          if (fragment.hasOwnProperty(key) && ReactElement.isValidElement(fragment[key])) {
	            // This looks like a fragment object, we should provide an
	            // early warning.
	            return ReactFragment.extract(fragment);
	          }
	        }
	      }
	    }
	    return fragment;
	  }
	};

	module.exports = ReactFragment;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactPropTypeLocations
	 */

	"use strict";

	var keyMirror = __webpack_require__(9);

	var ReactPropTypeLocations = keyMirror({
	  prop: null,
	  context: null,
	  childContext: null
	});

	module.exports = ReactPropTypeLocations;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactPropTypeLocationNames
	 */

	'use strict';

	var ReactPropTypeLocationNames = {};

	if (false) {
	  ReactPropTypeLocationNames = {
	    prop: 'prop',
	    context: 'context',
	    childContext: 'child context'
	  };
	}

	module.exports = ReactPropTypeLocationNames;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactNativeComponent
	 */

	"use strict";

	var assign = __webpack_require__(19);
	var invariant = __webpack_require__(7);

	var autoGenerateWrapperClass = null;
	var genericComponentClass = null;
	// This registry keeps track of wrapper classes around native tags
	var tagToComponentClass = {};
	var textComponentClass = null;

	var ReactNativeComponentInjection = {
	  // This accepts a class that receives the tag string. This is a catch all
	  // that can render any kind of tag.
	  injectGenericComponentClass: function injectGenericComponentClass(componentClass) {
	    genericComponentClass = componentClass;
	  },
	  // This accepts a text component class that takes the text string to be
	  // rendered as props.
	  injectTextComponentClass: function injectTextComponentClass(componentClass) {
	    textComponentClass = componentClass;
	  },
	  // This accepts a keyed object with classes as values. Each key represents a
	  // tag. That particular tag will use this class instead of the generic one.
	  injectComponentClasses: function injectComponentClasses(componentClasses) {
	    assign(tagToComponentClass, componentClasses);
	  },
	  // Temporary hack since we expect DOM refs to behave like composites,
	  // for this release.
	  injectAutoWrapper: function injectAutoWrapper(wrapperFactory) {
	    autoGenerateWrapperClass = wrapperFactory;
	  }
	};

	/**
	 * Get a composite component wrapper class for a specific tag.
	 *
	 * @param {ReactElement} element The tag for which to get the class.
	 * @return {function} The React class constructor function.
	 */
	function getComponentClassForElement(element) {
	  if (typeof element.type === "function") {
	    return element.type;
	  }
	  var tag = element.type;
	  var componentClass = tagToComponentClass[tag];
	  if (componentClass == null) {
	    tagToComponentClass[tag] = componentClass = autoGenerateWrapperClass(tag);
	  }
	  return componentClass;
	}

	/**
	 * Get a native internal component class for a specific tag.
	 *
	 * @param {ReactElement} element The element to create.
	 * @return {function} The internal class constructor function.
	 */
	function createInternalComponent(element) {
	  false ? invariant(genericComponentClass, "There is no registered component for the tag %s", element.type) : invariant(genericComponentClass);
	  return new genericComponentClass(element.type, element.props);
	}

	/**
	 * @param {ReactText} text
	 * @return {ReactComponent}
	 */
	function createInstanceForText(text) {
	  return new textComponentClass(text);
	}

	/**
	 * @param {ReactComponent} component
	 * @return {boolean}
	 */
	function isTextComponent(component) {
	  return component instanceof textComponentClass;
	}

	var ReactNativeComponent = {
	  getComponentClassForElement: getComponentClassForElement,
	  createInternalComponent: createInternalComponent,
	  createInstanceForText: createInstanceForText,
	  isTextComponent: isTextComponent,
	  injection: ReactNativeComponentInjection
	};

	module.exports = ReactNativeComponent;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactChildReconciler
	 * @typechecks static-only
	 */

	"use strict";

	var ReactReconciler = __webpack_require__(10);

	var flattenChildren = __webpack_require__(27);
	var instantiateReactComponent = __webpack_require__(31);
	var shouldUpdateReactComponent = __webpack_require__(40);

	/**
	 * ReactChildReconciler provides helpers for initializing or updating a set of
	 * children. Its output is suitable for passing it onto ReactMultiChild which
	 * does diffed reordering and insertion.
	 */
	var ReactChildReconciler = {

	  /**
	   * Generates a "mount image" for each of the supplied children. In the case
	   * of `ReactDOMComponent`, a mount image is a string of markup.
	   *
	   * @param {?object} nestedChildNodes Nested child maps.
	   * @return {?object} A set of child instances.
	   * @internal
	   */
	  instantiateChildren: function instantiateChildren(nestedChildNodes, transaction, context) {
	    var children = flattenChildren(nestedChildNodes);
	    for (var name in children) {
	      if (children.hasOwnProperty(name)) {
	        var child = children[name];
	        // The rendered children must be turned into instances as they're
	        // mounted.
	        var childInstance = instantiateReactComponent(child, null);
	        children[name] = childInstance;
	      }
	    }
	    return children;
	  },

	  /**
	   * Updates the rendered children and returns a new set of children.
	   *
	   * @param {?object} prevChildren Previously initialized set of children.
	   * @param {?object} nextNestedChildNodes Nested child maps.
	   * @param {ReactReconcileTransaction} transaction
	   * @param {object} context
	   * @return {?object} A new set of child instances.
	   * @internal
	   */
	  updateChildren: function updateChildren(prevChildren, nextNestedChildNodes, transaction, context) {
	    // We currently don't have a way to track moves here but if we use iterators
	    // instead of for..in we can zip the iterators and check if an item has
	    // moved.
	    // TODO: If nothing has changed, return the prevChildren object so that we
	    // can quickly bailout if nothing has changed.
	    var nextChildren = flattenChildren(nextNestedChildNodes);
	    if (!nextChildren && !prevChildren) {
	      return null;
	    }
	    var name;
	    for (name in nextChildren) {
	      if (!nextChildren.hasOwnProperty(name)) {
	        continue;
	      }
	      var prevChild = prevChildren && prevChildren[name];
	      var prevElement = prevChild && prevChild._currentElement;
	      var nextElement = nextChildren[name];
	      if (shouldUpdateReactComponent(prevElement, nextElement)) {
	        ReactReconciler.receiveComponent(prevChild, nextElement, transaction, context);
	        nextChildren[name] = prevChild;
	      } else {
	        if (prevChild) {
	          ReactReconciler.unmountComponent(prevChild, name);
	        }
	        // The child must be instantiated before it's mounted.
	        var nextChildInstance = instantiateReactComponent(nextElement, null);
	        nextChildren[name] = nextChildInstance;
	      }
	    }
	    // Unmount children that are no longer present.
	    for (name in prevChildren) {
	      if (prevChildren.hasOwnProperty(name) && !(nextChildren && nextChildren.hasOwnProperty(name))) {
	        ReactReconciler.unmountComponent(prevChildren[name]);
	      }
	    }
	    return nextChildren;
	  },

	  /**
	   * Unmounts all rendered children. This should be used to clean up children
	   * when this component is unmounted.
	   *
	   * @param {?object} renderedChildren Previously initialized set of children.
	   * @internal
	   */
	  unmountChildren: function unmountChildren(renderedChildren) {
	    for (var name in renderedChildren) {
	      var renderedChild = renderedChildren[name];
	      ReactReconciler.unmountComponent(renderedChild);
	    }
	  }

	};

	module.exports = ReactChildReconciler;

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule flattenChildren
	 */

	"use strict";

	var traverseAllChildren = __webpack_require__(28);
	var warning = __webpack_require__(16);

	/**
	 * @param {function} traverseContext Context passed through traversal.
	 * @param {?ReactComponent} child React child component.
	 * @param {!string} name String name of key path to child.
	 */
	function flattenSingleChildIntoContext(traverseContext, child, name) {
	  // We found a component instance.
	  var result = traverseContext;
	  var keyUnique = !result.hasOwnProperty(name);
	  if (false) {
	    "production" !== process.env.NODE_ENV ? warning(keyUnique, "flattenChildren(...): Encountered two children with the same key, " + "`%s`. Child keys must be unique; when two children share a key, only " + "the first child will be used.", name) : null;
	  }
	  if (keyUnique && child != null) {
	    result[name] = child;
	  }
	}

	/**
	 * Flattens children that are typically specified as `props.children`. Any null
	 * children will not be included in the resulting object.
	 * @return {!object} flattened children keyed by name.
	 */
	function flattenChildren(children) {
	  if (children == null) {
	    return children;
	  }
	  var result = {};
	  traverseAllChildren(children, flattenSingleChildIntoContext, result);
	  return result;
	}

	module.exports = flattenChildren;

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule traverseAllChildren
	 */

	"use strict";

	var ReactElement = __webpack_require__(15);
	var ReactFragment = __webpack_require__(22);
	var ReactInstanceHandles = __webpack_require__(29);

	var getIteratorFn = __webpack_require__(14);
	var invariant = __webpack_require__(7);
	var warning = __webpack_require__(16);

	var SEPARATOR = ReactInstanceHandles.SEPARATOR;
	var SUBSEPARATOR = ":";

	/**
	 * TODO: Test that a single child and an array with one item have the same key
	 * pattern.
	 */

	var userProvidedKeyEscaperLookup = {
	  "=": "=0",
	  ".": "=1",
	  ":": "=2"
	};

	var userProvidedKeyEscapeRegex = /[=.:]/g;

	var didWarnAboutMaps = false;

	function userProvidedKeyEscaper(match) {
	  return userProvidedKeyEscaperLookup[match];
	}

	/**
	 * Generate a key string that identifies a component within a set.
	 *
	 * @param {*} component A component that could contain a manual key.
	 * @param {number} index Index that is used if a manual key is not provided.
	 * @return {string}
	 */
	function getComponentKey(component, index) {
	  if (component && component.key != null) {
	    // Explicit key
	    return wrapUserProvidedKey(component.key);
	  }
	  // Implicit key determined by the index in the set
	  return index.toString(36);
	}

	/**
	 * Escape a component key so that it is safe to use in a reactid.
	 *
	 * @param {*} key Component key to be escaped.
	 * @return {string} An escaped string.
	 */
	function escapeUserProvidedKey(text) {
	  return ("" + text).replace(userProvidedKeyEscapeRegex, userProvidedKeyEscaper);
	}

	/**
	 * Wrap a `key` value explicitly provided by the user to distinguish it from
	 * implicitly-generated keys generated by a component's index in its parent.
	 *
	 * @param {string} key Value of a user-provided `key` attribute
	 * @return {string}
	 */
	function wrapUserProvidedKey(key) {
	  return "$" + escapeUserProvidedKey(key);
	}

	/**
	 * @param {?*} children Children tree container.
	 * @param {!string} nameSoFar Name of the key path so far.
	 * @param {!number} indexSoFar Number of children encountered until this point.
	 * @param {!function} callback Callback to invoke with each child found.
	 * @param {?*} traverseContext Used to pass information throughout the traversal
	 * process.
	 * @return {!number} The number of children in this subtree.
	 */
	function traverseAllChildrenImpl(children, nameSoFar, indexSoFar, callback, traverseContext) {
	  var type = typeof children;

	  if (type === "undefined" || type === "boolean") {
	    // All of the above are perceived as null.
	    children = null;
	  }

	  if (children === null || type === "string" || type === "number" || ReactElement.isValidElement(children)) {
	    callback(traverseContext, children,
	    // If it's the only child, treat the name as if it was wrapped in an array
	    // so that it's consistent if the number of children grows.
	    nameSoFar === "" ? SEPARATOR + getComponentKey(children, 0) : nameSoFar, indexSoFar);
	    return 1;
	  }

	  var child, nextName, nextIndex;
	  var subtreeCount = 0; // Count of children found in the current subtree.

	  if (Array.isArray(children)) {
	    for (var i = 0; i < children.length; i++) {
	      child = children[i];
	      nextName = (nameSoFar !== "" ? nameSoFar + SUBSEPARATOR : SEPARATOR) + getComponentKey(child, i);
	      nextIndex = indexSoFar + subtreeCount;
	      subtreeCount += traverseAllChildrenImpl(child, nextName, nextIndex, callback, traverseContext);
	    }
	  } else {
	    var iteratorFn = getIteratorFn(children);
	    if (iteratorFn) {
	      var iterator = iteratorFn.call(children);
	      var step;
	      if (iteratorFn !== children.entries) {
	        var ii = 0;
	        while (!(step = iterator.next()).done) {
	          child = step.value;
	          nextName = (nameSoFar !== "" ? nameSoFar + SUBSEPARATOR : SEPARATOR) + getComponentKey(child, ii++);
	          nextIndex = indexSoFar + subtreeCount;
	          subtreeCount += traverseAllChildrenImpl(child, nextName, nextIndex, callback, traverseContext);
	        }
	      } else {
	        if (false) {
	          "production" !== process.env.NODE_ENV ? warning(didWarnAboutMaps, "Using Maps as children is not yet fully supported. It is an " + "experimental feature that might be removed. Convert it to a " + "sequence / iterable of keyed ReactElements instead.") : null;
	          didWarnAboutMaps = true;
	        }
	        // Iterator will provide entry [k,v] tuples rather than values.
	        while (!(step = iterator.next()).done) {
	          var entry = step.value;
	          if (entry) {
	            child = entry[1];
	            nextName = (nameSoFar !== "" ? nameSoFar + SUBSEPARATOR : SEPARATOR) + wrapUserProvidedKey(entry[0]) + SUBSEPARATOR + getComponentKey(child, 0);
	            nextIndex = indexSoFar + subtreeCount;
	            subtreeCount += traverseAllChildrenImpl(child, nextName, nextIndex, callback, traverseContext);
	          }
	        }
	      }
	    } else if (type === "object") {
	      false ? invariant(children.nodeType !== 1, "traverseAllChildren(...): Encountered an invalid child; DOM " + "elements are not valid children of React components.") : invariant(children.nodeType !== 1);
	      var fragment = ReactFragment.extract(children);
	      for (var key in fragment) {
	        if (fragment.hasOwnProperty(key)) {
	          child = fragment[key];
	          nextName = (nameSoFar !== "" ? nameSoFar + SUBSEPARATOR : SEPARATOR) + wrapUserProvidedKey(key) + SUBSEPARATOR + getComponentKey(child, 0);
	          nextIndex = indexSoFar + subtreeCount;
	          subtreeCount += traverseAllChildrenImpl(child, nextName, nextIndex, callback, traverseContext);
	        }
	      }
	    }
	  }

	  return subtreeCount;
	}

	/**
	 * Traverses children that are typically specified as `props.children`, but
	 * might also be specified through attributes:
	 *
	 * - `traverseAllChildren(this.props.children, ...)`
	 * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
	 *
	 * The `traverseContext` is an optional argument that is passed through the
	 * entire traversal. It can be used to store accumulations or anything else that
	 * the callback might find relevant.
	 *
	 * @param {?*} children Children tree object.
	 * @param {!function} callback To invoke upon traversing each child.
	 * @param {?*} traverseContext Context for traversal.
	 * @return {!number} The number of children in this subtree.
	 */
	function traverseAllChildren(children, callback, traverseContext) {
	  if (children == null) {
	    return 0;
	  }

	  return traverseAllChildrenImpl(children, "", 0, callback, traverseContext);
	}

	module.exports = traverseAllChildren;

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactInstanceHandles
	 * @typechecks static-only
	 */

	"use strict";

	var ReactRootIndex = __webpack_require__(30);

	var invariant = __webpack_require__(7);

	var SEPARATOR = ".";
	var SEPARATOR_LENGTH = SEPARATOR.length;

	/**
	 * Maximum depth of traversals before we consider the possibility of a bad ID.
	 */
	var MAX_TREE_DEPTH = 100;

	/**
	 * Creates a DOM ID prefix to use when mounting React components.
	 *
	 * @param {number} index A unique integer
	 * @return {string} React root ID.
	 * @internal
	 */
	function getReactRootIDString(index) {
	  return SEPARATOR + index.toString(36);
	}

	/**
	 * Checks if a character in the supplied ID is a separator or the end.
	 *
	 * @param {string} id A React DOM ID.
	 * @param {number} index Index of the character to check.
	 * @return {boolean} True if the character is a separator or end of the ID.
	 * @private
	 */
	function isBoundary(id, index) {
	  return id.charAt(index) === SEPARATOR || index === id.length;
	}

	/**
	 * Checks if the supplied string is a valid React DOM ID.
	 *
	 * @param {string} id A React DOM ID, maybe.
	 * @return {boolean} True if the string is a valid React DOM ID.
	 * @private
	 */
	function isValidID(id) {
	  return id === "" || id.charAt(0) === SEPARATOR && id.charAt(id.length - 1) !== SEPARATOR;
	}

	/**
	 * Checks if the first ID is an ancestor of or equal to the second ID.
	 *
	 * @param {string} ancestorID
	 * @param {string} descendantID
	 * @return {boolean} True if `ancestorID` is an ancestor of `descendantID`.
	 * @internal
	 */
	function isAncestorIDOf(ancestorID, descendantID) {
	  return descendantID.indexOf(ancestorID) === 0 && isBoundary(descendantID, ancestorID.length);
	}

	/**
	 * Gets the parent ID of the supplied React DOM ID, `id`.
	 *
	 * @param {string} id ID of a component.
	 * @return {string} ID of the parent, or an empty string.
	 * @private
	 */
	function getParentID(id) {
	  return id ? id.substr(0, id.lastIndexOf(SEPARATOR)) : "";
	}

	/**
	 * Gets the next DOM ID on the tree path from the supplied `ancestorID` to the
	 * supplied `destinationID`. If they are equal, the ID is returned.
	 *
	 * @param {string} ancestorID ID of an ancestor node of `destinationID`.
	 * @param {string} destinationID ID of the destination node.
	 * @return {string} Next ID on the path from `ancestorID` to `destinationID`.
	 * @private
	 */
	function getNextDescendantID(ancestorID, destinationID) {
	  false ? invariant(isValidID(ancestorID) && isValidID(destinationID), "getNextDescendantID(%s, %s): Received an invalid React DOM ID.", ancestorID, destinationID) : invariant(isValidID(ancestorID) && isValidID(destinationID));
	  false ? invariant(isAncestorIDOf(ancestorID, destinationID), "getNextDescendantID(...): React has made an invalid assumption about " + "the DOM hierarchy. Expected `%s` to be an ancestor of `%s`.", ancestorID, destinationID) : invariant(isAncestorIDOf(ancestorID, destinationID));
	  if (ancestorID === destinationID) {
	    return ancestorID;
	  }
	  // Skip over the ancestor and the immediate separator. Traverse until we hit
	  // another separator or we reach the end of `destinationID`.
	  var start = ancestorID.length + SEPARATOR_LENGTH;
	  var i;
	  for (i = start; i < destinationID.length; i++) {
	    if (isBoundary(destinationID, i)) {
	      break;
	    }
	  }
	  return destinationID.substr(0, i);
	}

	/**
	 * Gets the nearest common ancestor ID of two IDs.
	 *
	 * Using this ID scheme, the nearest common ancestor ID is the longest common
	 * prefix of the two IDs that immediately preceded a "marker" in both strings.
	 *
	 * @param {string} oneID
	 * @param {string} twoID
	 * @return {string} Nearest common ancestor ID, or the empty string if none.
	 * @private
	 */
	function getFirstCommonAncestorID(oneID, twoID) {
	  var minLength = Math.min(oneID.length, twoID.length);
	  if (minLength === 0) {
	    return "";
	  }
	  var lastCommonMarkerIndex = 0;
	  // Use `<=` to traverse until the "EOL" of the shorter string.
	  for (var i = 0; i <= minLength; i++) {
	    if (isBoundary(oneID, i) && isBoundary(twoID, i)) {
	      lastCommonMarkerIndex = i;
	    } else if (oneID.charAt(i) !== twoID.charAt(i)) {
	      break;
	    }
	  }
	  var longestCommonID = oneID.substr(0, lastCommonMarkerIndex);
	  false ? invariant(isValidID(longestCommonID), "getFirstCommonAncestorID(%s, %s): Expected a valid React DOM ID: %s", oneID, twoID, longestCommonID) : invariant(isValidID(longestCommonID));
	  return longestCommonID;
	}

	/**
	 * Traverses the parent path between two IDs (either up or down). The IDs must
	 * not be the same, and there must exist a parent path between them. If the
	 * callback returns `false`, traversal is stopped.
	 *
	 * @param {?string} start ID at which to start traversal.
	 * @param {?string} stop ID at which to end traversal.
	 * @param {function} cb Callback to invoke each ID with.
	 * @param {?boolean} skipFirst Whether or not to skip the first node.
	 * @param {?boolean} skipLast Whether or not to skip the last node.
	 * @private
	 */
	function traverseParentPath(start, stop, cb, arg, skipFirst, skipLast) {
	  start = start || "";
	  stop = stop || "";
	  false ? invariant(start !== stop, "traverseParentPath(...): Cannot traverse from and to the same ID, `%s`.", start) : invariant(start !== stop);
	  var traverseUp = isAncestorIDOf(stop, start);
	  false ? invariant(traverseUp || isAncestorIDOf(start, stop), "traverseParentPath(%s, %s, ...): Cannot traverse from two IDs that do " + "not have a parent path.", start, stop) : invariant(traverseUp || isAncestorIDOf(start, stop));
	  // Traverse from `start` to `stop` one depth at a time.
	  var depth = 0;
	  var traverse = traverseUp ? getParentID : getNextDescendantID;
	  for (var id = start;; id = traverse(id, stop)) {
	    var ret;
	    if ((!skipFirst || id !== start) && (!skipLast || id !== stop)) {
	      ret = cb(id, traverseUp, arg);
	    }
	    if (ret === false || id === stop) {
	      // Only break //after// visiting `stop`.
	      break;
	    }
	    false ? invariant(depth++ < MAX_TREE_DEPTH, "traverseParentPath(%s, %s, ...): Detected an infinite loop while " + "traversing the React DOM ID tree. This may be due to malformed IDs: %s", start, stop) : invariant(depth++ < MAX_TREE_DEPTH);
	  }
	}

	/**
	 * Manages the IDs assigned to DOM representations of React components. This
	 * uses a specific scheme in order to traverse the DOM efficiently (e.g. in
	 * order to simulate events).
	 *
	 * @internal
	 */
	var ReactInstanceHandles = {

	  /**
	   * Constructs a React root ID
	   * @return {string} A React root ID.
	   */
	  createReactRootID: function createReactRootID() {
	    return getReactRootIDString(ReactRootIndex.createReactRootIndex());
	  },

	  /**
	   * Constructs a React ID by joining a root ID with a name.
	   *
	   * @param {string} rootID Root ID of a parent component.
	   * @param {string} name A component's name (as flattened children).
	   * @return {string} A React ID.
	   * @internal
	   */
	  createReactID: function createReactID(rootID, name) {
	    return rootID + name;
	  },

	  /**
	   * Gets the DOM ID of the React component that is the root of the tree that
	   * contains the React component with the supplied DOM ID.
	   *
	   * @param {string} id DOM ID of a React component.
	   * @return {?string} DOM ID of the React component that is the root.
	   * @internal
	   */
	  getReactRootIDFromNodeID: function getReactRootIDFromNodeID(id) {
	    if (id && id.charAt(0) === SEPARATOR && id.length > 1) {
	      var index = id.indexOf(SEPARATOR, 1);
	      return index > -1 ? id.substr(0, index) : id;
	    }
	    return null;
	  },

	  /**
	   * Traverses the ID hierarchy and invokes the supplied `cb` on any IDs that
	   * should would receive a `mouseEnter` or `mouseLeave` event.
	   *
	   * NOTE: Does not invoke the callback on the nearest common ancestor because
	   * nothing "entered" or "left" that element.
	   *
	   * @param {string} leaveID ID being left.
	   * @param {string} enterID ID being entered.
	   * @param {function} cb Callback to invoke on each entered/left ID.
	   * @param {*} upArg Argument to invoke the callback with on left IDs.
	   * @param {*} downArg Argument to invoke the callback with on entered IDs.
	   * @internal
	   */
	  traverseEnterLeave: function traverseEnterLeave(leaveID, enterID, cb, upArg, downArg) {
	    var ancestorID = getFirstCommonAncestorID(leaveID, enterID);
	    if (ancestorID !== leaveID) {
	      traverseParentPath(leaveID, ancestorID, cb, upArg, false, true);
	    }
	    if (ancestorID !== enterID) {
	      traverseParentPath(ancestorID, enterID, cb, downArg, true, false);
	    }
	  },

	  /**
	   * Simulates the traversal of a two-phase, capture/bubble event dispatch.
	   *
	   * NOTE: This traversal happens on IDs without touching the DOM.
	   *
	   * @param {string} targetID ID of the target node.
	   * @param {function} cb Callback to invoke.
	   * @param {*} arg Argument to invoke the callback with.
	   * @internal
	   */
	  traverseTwoPhase: function traverseTwoPhase(targetID, cb, arg) {
	    if (targetID) {
	      traverseParentPath("", targetID, cb, arg, true, false);
	      traverseParentPath(targetID, "", cb, arg, false, true);
	    }
	  },

	  /**
	   * Traverse a node ID, calling the supplied `cb` for each ancestor ID. For
	   * example, passing `.0.$row-0.1` would result in `cb` getting called
	   * with `.0`, `.0.$row-0`, and `.0.$row-0.1`.
	   *
	   * NOTE: This traversal happens on IDs without touching the DOM.
	   *
	   * @param {string} targetID ID of the target node.
	   * @param {function} cb Callback to invoke.
	   * @param {*} arg Argument to invoke the callback with.
	   * @internal
	   */
	  traverseAncestors: function traverseAncestors(targetID, cb, arg) {
	    traverseParentPath("", targetID, cb, arg, true, false);
	  },

	  /**
	   * Exposed for unit testing.
	   * @private
	   */
	  _getFirstCommonAncestorID: getFirstCommonAncestorID,

	  /**
	   * Exposed for unit testing.
	   * @private
	   */
	  _getNextDescendantID: getNextDescendantID,

	  isAncestorIDOf: isAncestorIDOf,

	  SEPARATOR: SEPARATOR

	};

	module.exports = ReactInstanceHandles;
	/* until break */

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactRootIndex
	 * @typechecks
	 */

	'use strict';

	var ReactRootIndexInjection = {
	  /**
	   * @param {function} _createReactRootIndex
	   */
	  injectCreateReactRootIndex: function injectCreateReactRootIndex(_createReactRootIndex) {
	    ReactRootIndex.createReactRootIndex = _createReactRootIndex;
	  }
	};

	var ReactRootIndex = {
	  createReactRootIndex: null,
	  injection: ReactRootIndexInjection
	};

	module.exports = ReactRootIndex;

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule instantiateReactComponent
	 * @typechecks static-only
	 */

	"use strict";

	var ReactCompositeComponent = __webpack_require__(32);
	var ReactEmptyComponent = __webpack_require__(41);
	var ReactNativeComponent = __webpack_require__(25);

	var assign = __webpack_require__(19);
	var invariant = __webpack_require__(7);
	var warning = __webpack_require__(16);

	// To avoid a cyclic dependency, we create the final class in this module
	var ReactCompositeComponentWrapper = function ReactCompositeComponentWrapper() {};
	assign(ReactCompositeComponentWrapper.prototype, ReactCompositeComponent.Mixin, {
	  _instantiateReactComponent: instantiateReactComponent
	});

	/**
	 * Check if the type reference is a known internal type. I.e. not a user
	 * provided composite type.
	 *
	 * @param {function} type
	 * @return {boolean} Returns true if this is a valid internal type.
	 */
	function isInternalComponentType(type) {
	  return typeof type === "function" && typeof type.prototype !== "undefined" && typeof type.prototype.mountComponent === "function" && typeof type.prototype.receiveComponent === "function";
	}

	/**
	 * Given a ReactNode, create an instance that will actually be mounted.
	 *
	 * @param {ReactNode} node
	 * @param {*} parentCompositeType The composite type that resolved this.
	 * @return {object} A new instance of the element's constructor.
	 * @protected
	 */
	function instantiateReactComponent(node, parentCompositeType) {
	  var instance;

	  if (node === null || node === false) {
	    node = ReactEmptyComponent.emptyElement;
	  }

	  if (typeof node === "object") {
	    var element = node;
	    if (false) {
	      "production" !== process.env.NODE_ENV ? warning(element && (typeof element.type === "function" || typeof element.type === "string"), "Only functions or strings can be mounted as React components.") : null;
	    }

	    // Special case string values
	    if (parentCompositeType === element.type && typeof element.type === "string") {
	      // Avoid recursion if the wrapper renders itself.
	      instance = ReactNativeComponent.createInternalComponent(element);
	      // All native components are currently wrapped in a composite so we're
	      // safe to assume that this is what we should instantiate.
	    } else if (isInternalComponentType(element.type)) {
	      // This is temporarily available for custom components that are not string
	      // represenations. I.e. ART. Once those are updated to use the string
	      // representation, we can drop this code path.
	      instance = new element.type(element);
	    } else {
	      instance = new ReactCompositeComponentWrapper();
	    }
	  } else if (typeof node === "string" || typeof node === "number") {
	    instance = ReactNativeComponent.createInstanceForText(node);
	  } else {
	    false ? invariant(false, "Encountered invalid React node of type %s", typeof node) : invariant(false);
	  }

	  if (false) {
	    "production" !== process.env.NODE_ENV ? warning(typeof instance.construct === "function" && typeof instance.mountComponent === "function" && typeof instance.receiveComponent === "function" && typeof instance.unmountComponent === "function", "Only React Components can be mounted.") : null;
	  }

	  // Sets up the instance. This can probably just move into the constructor now.
	  instance.construct(node);

	  // These two fields are used by the DOM and ART diffing algorithms
	  // respectively. Instead of using expandos on components, we should be
	  // storing the state needed by the diffing algorithms elsewhere.
	  instance._mountIndex = 0;
	  instance._mountImage = null;

	  if (false) {
	    instance._isOwnerNecessary = false;
	    instance._warnedAboutRefsInRender = false;
	  }

	  // Internal instances should fully constructed at this point, so they should
	  // not get any new fields added to them at this point.
	  if (false) {
	    if (Object.preventExtensions) {
	      Object.preventExtensions(instance);
	    }
	  }

	  return instance;
	}

	module.exports = instantiateReactComponent;

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactCompositeComponent
	 */

	"use strict";

	var ReactComponentEnvironment = __webpack_require__(6);
	var ReactContext = __webpack_require__(18);
	var ReactCurrentOwner = __webpack_require__(21);
	var ReactElement = __webpack_require__(15);
	var ReactElementValidator = __webpack_require__(13);
	var ReactInstanceMap = __webpack_require__(33);
	var ReactLifeCycle = __webpack_require__(34);
	var ReactNativeComponent = __webpack_require__(25);
	var ReactPerf = __webpack_require__(35);
	var ReactPropTypeLocations = __webpack_require__(23);
	var ReactPropTypeLocationNames = __webpack_require__(24);
	var ReactReconciler = __webpack_require__(10);
	var ReactUpdates = __webpack_require__(36);

	var assign = __webpack_require__(19);
	var emptyObject = __webpack_require__(20);
	var invariant = __webpack_require__(7);
	var shouldUpdateReactComponent = __webpack_require__(40);
	var warning = __webpack_require__(16);

	function getDeclarationErrorAddendum(component) {
	  var owner = component._currentElement._owner || null;
	  if (owner) {
	    var name = owner.getName();
	    if (name) {
	      return " Check the render method of `" + name + "`.";
	    }
	  }
	  return "";
	}

	/**
	 * ------------------ The Life-Cycle of a Composite Component ------------------
	 *
	 * - constructor: Initialization of state. The instance is now retained.
	 *   - componentWillMount
	 *   - render
	 *   - [children's constructors]
	 *     - [children's componentWillMount and render]
	 *     - [children's componentDidMount]
	 *     - componentDidMount
	 *
	 *       Update Phases:
	 *       - componentWillReceiveProps (only called if parent updated)
	 *       - shouldComponentUpdate
	 *         - componentWillUpdate
	 *           - render
	 *           - [children's constructors or receive props phases]
	 *         - componentDidUpdate
	 *
	 *     - componentWillUnmount
	 *     - [children's componentWillUnmount]
	 *   - [children destroyed]
	 * - (destroyed): The instance is now blank, released by React and ready for GC.
	 *
	 * -----------------------------------------------------------------------------
	 */

	/**
	 * An incrementing ID assigned to each component when it is mounted. This is
	 * used to enforce the order in which `ReactUpdates` updates dirty components.
	 *
	 * @private
	 */
	var nextMountID = 1;

	/**
	 * @lends {ReactCompositeComponent.prototype}
	 */
	var ReactCompositeComponentMixin = {

	  /**
	   * Base constructor for all composite component.
	   *
	   * @param {ReactElement} element
	   * @final
	   * @internal
	   */
	  construct: function construct(element) {
	    this._currentElement = element;
	    this._rootNodeID = null;
	    this._instance = null;

	    // See ReactUpdateQueue
	    this._pendingElement = null;
	    this._pendingStateQueue = null;
	    this._pendingReplaceState = false;
	    this._pendingForceUpdate = false;

	    this._renderedComponent = null;

	    this._context = null;
	    this._mountOrder = 0;
	    this._isTopLevel = false;

	    // See ReactUpdates and ReactUpdateQueue.
	    this._pendingCallbacks = null;
	  },

	  /**
	   * Initializes the component, renders markup, and registers event listeners.
	   *
	   * @param {string} rootID DOM ID of the root node.
	   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
	   * @return {?string} Rendered markup to be inserted into the DOM.
	   * @final
	   * @internal
	   */
	  mountComponent: function mountComponent(rootID, transaction, context) {
	    this._context = context;
	    this._mountOrder = nextMountID++;
	    this._rootNodeID = rootID;

	    var publicProps = this._processProps(this._currentElement.props);
	    var publicContext = this._processContext(this._currentElement._context);

	    var Component = ReactNativeComponent.getComponentClassForElement(this._currentElement);

	    // Initialize the public class
	    var inst = new Component(publicProps, publicContext);

	    if (false) {
	      // This will throw later in _renderValidatedComponent, but add an early
	      // warning now to help debugging
	      "production" !== process.env.NODE_ENV ? warning(inst.render != null, "%s(...): No `render` method found on the returned component " + "instance: you may have forgotten to define `render` in your " + "component or you may have accidentally tried to render an element " + "whose type is a function that isn't a React component.", Component.displayName || Component.name || "Component") : null;
	    }

	    // These should be set up in the constructor, but as a convenience for
	    // simpler class abstractions, we set them up after the fact.
	    inst.props = publicProps;
	    inst.context = publicContext;
	    inst.refs = emptyObject;

	    this._instance = inst;

	    // Store a reference from the instance back to the internal representation
	    ReactInstanceMap.set(inst, this);

	    if (false) {
	      this._warnIfContextsDiffer(this._currentElement._context, context);
	    }

	    if (false) {
	      // Since plain JS classes are defined without any special initialization
	      // logic, we can not catch common errors early. Therefore, we have to
	      // catch them here, at initialization time, instead.
	      "production" !== process.env.NODE_ENV ? warning(!inst.getInitialState || inst.getInitialState.isReactClassApproved, "getInitialState was defined on %s, a plain JavaScript class. " + "This is only supported for classes created using React.createClass. " + "Did you mean to define a state property instead?", this.getName() || "a component") : null;
	      "production" !== process.env.NODE_ENV ? warning(!inst.getDefaultProps || inst.getDefaultProps.isReactClassApproved, "getDefaultProps was defined on %s, a plain JavaScript class. " + "This is only supported for classes created using React.createClass. " + "Use a static property to define defaultProps instead.", this.getName() || "a component") : null;
	      "production" !== process.env.NODE_ENV ? warning(!inst.propTypes, "propTypes was defined as an instance property on %s. Use a static " + "property to define propTypes instead.", this.getName() || "a component") : null;
	      "production" !== process.env.NODE_ENV ? warning(!inst.contextTypes, "contextTypes was defined as an instance property on %s. Use a " + "static property to define contextTypes instead.", this.getName() || "a component") : null;
	      "production" !== process.env.NODE_ENV ? warning(typeof inst.componentShouldUpdate !== "function", "%s has a method called " + "componentShouldUpdate(). Did you mean shouldComponentUpdate()? " + "The name is phrased as a question because the function is " + "expected to return a value.", this.getName() || "A component") : null;
	    }

	    var initialState = inst.state;
	    if (initialState === undefined) {
	      inst.state = initialState = null;
	    }
	    false ? invariant(typeof initialState === "object" && !Array.isArray(initialState), "%s.state: must be set to an object or null", this.getName() || "ReactCompositeComponent") : invariant(typeof initialState === "object" && !Array.isArray(initialState));

	    this._pendingStateQueue = null;
	    this._pendingReplaceState = false;
	    this._pendingForceUpdate = false;

	    var childContext;
	    var renderedElement;

	    var previouslyMounting = ReactLifeCycle.currentlyMountingInstance;
	    ReactLifeCycle.currentlyMountingInstance = this;
	    try {
	      if (inst.componentWillMount) {
	        inst.componentWillMount();
	        // When mounting, calls to `setState` by `componentWillMount` will set
	        // `this._pendingStateQueue` without triggering a re-render.
	        if (this._pendingStateQueue) {
	          inst.state = this._processPendingState(inst.props, inst.context);
	        }
	      }

	      childContext = this._getValidatedChildContext(context);
	      renderedElement = this._renderValidatedComponent(childContext);
	    } finally {
	      ReactLifeCycle.currentlyMountingInstance = previouslyMounting;
	    }

	    this._renderedComponent = this._instantiateReactComponent(renderedElement, this._currentElement.type // The wrapping type
	    );

	    var markup = ReactReconciler.mountComponent(this._renderedComponent, rootID, transaction, this._mergeChildContext(context, childContext));
	    if (inst.componentDidMount) {
	      transaction.getReactMountReady().enqueue(inst.componentDidMount, inst);
	    }

	    return markup;
	  },

	  /**
	   * Releases any resources allocated by `mountComponent`.
	   *
	   * @final
	   * @internal
	   */
	  unmountComponent: function unmountComponent() {
	    var inst = this._instance;

	    if (inst.componentWillUnmount) {
	      var previouslyUnmounting = ReactLifeCycle.currentlyUnmountingInstance;
	      ReactLifeCycle.currentlyUnmountingInstance = this;
	      try {
	        inst.componentWillUnmount();
	      } finally {
	        ReactLifeCycle.currentlyUnmountingInstance = previouslyUnmounting;
	      }
	    }

	    ReactReconciler.unmountComponent(this._renderedComponent);
	    this._renderedComponent = null;

	    // Reset pending fields
	    this._pendingStateQueue = null;
	    this._pendingReplaceState = false;
	    this._pendingForceUpdate = false;
	    this._pendingCallbacks = null;
	    this._pendingElement = null;

	    // These fields do not really need to be reset since this object is no
	    // longer accessible.
	    this._context = null;
	    this._rootNodeID = null;

	    // Delete the reference from the instance to this internal representation
	    // which allow the internals to be properly cleaned up even if the user
	    // leaks a reference to the public instance.
	    ReactInstanceMap.remove(inst);

	    // Some existing components rely on inst.props even after they've been
	    // destroyed (in event handlers).
	    // TODO: inst.props = null;
	    // TODO: inst.state = null;
	    // TODO: inst.context = null;
	  },

	  /**
	   * Schedule a partial update to the props. Only used for internal testing.
	   *
	   * @param {object} partialProps Subset of the next props.
	   * @param {?function} callback Called after props are updated.
	   * @final
	   * @internal
	   */
	  _setPropsInternal: function _setPropsInternal(partialProps, callback) {
	    // This is a deoptimized path. We optimize for always having an element.
	    // This creates an extra internal element.
	    var element = this._pendingElement || this._currentElement;
	    this._pendingElement = ReactElement.cloneAndReplaceProps(element, assign({}, element.props, partialProps));
	    ReactUpdates.enqueueUpdate(this, callback);
	  },

	  /**
	   * Filters the context object to only contain keys specified in
	   * `contextTypes`
	   *
	   * @param {object} context
	   * @return {?object}
	   * @private
	   */
	  _maskContext: function _maskContext(context) {
	    var maskedContext = null;
	    // This really should be getting the component class for the element,
	    // but we know that we're not going to need it for built-ins.
	    if (typeof this._currentElement.type === "string") {
	      return emptyObject;
	    }
	    var contextTypes = this._currentElement.type.contextTypes;
	    if (!contextTypes) {
	      return emptyObject;
	    }
	    maskedContext = {};
	    for (var contextName in contextTypes) {
	      maskedContext[contextName] = context[contextName];
	    }
	    return maskedContext;
	  },

	  /**
	   * Filters the context object to only contain keys specified in
	   * `contextTypes`, and asserts that they are valid.
	   *
	   * @param {object} context
	   * @return {?object}
	   * @private
	   */
	  _processContext: function _processContext(context) {
	    var maskedContext = this._maskContext(context);
	    if (false) {
	      var Component = ReactNativeComponent.getComponentClassForElement(this._currentElement);
	      if (Component.contextTypes) {
	        this._checkPropTypes(Component.contextTypes, maskedContext, ReactPropTypeLocations.context);
	      }
	    }
	    return maskedContext;
	  },

	  /**
	   * @param {object} currentContext
	   * @return {object}
	   * @private
	   */
	  _getValidatedChildContext: function _getValidatedChildContext(currentContext) {
	    var inst = this._instance;
	    var childContext = inst.getChildContext && inst.getChildContext();
	    if (childContext) {
	      false ? invariant(typeof inst.constructor.childContextTypes === "object", "%s.getChildContext(): childContextTypes must be defined in order to " + "use getChildContext().", this.getName() || "ReactCompositeComponent") : invariant(typeof inst.constructor.childContextTypes === "object");
	      if (false) {
	        this._checkPropTypes(inst.constructor.childContextTypes, childContext, ReactPropTypeLocations.childContext);
	      }
	      for (var name in childContext) {
	        false ? invariant(name in inst.constructor.childContextTypes, "%s.getChildContext(): key \"%s\" is not defined in childContextTypes.", this.getName() || "ReactCompositeComponent", name) : invariant(name in inst.constructor.childContextTypes);
	      }
	      return childContext;
	    }
	    return null;
	  },

	  _mergeChildContext: function _mergeChildContext(currentContext, childContext) {
	    if (childContext) {
	      return assign({}, currentContext, childContext);
	    }
	    return currentContext;
	  },

	  /**
	   * Processes props by setting default values for unspecified props and
	   * asserting that the props are valid. Does not mutate its argument; returns
	   * a new props object with defaults merged in.
	   *
	   * @param {object} newProps
	   * @return {object}
	   * @private
	   */
	  _processProps: function _processProps(newProps) {
	    if (false) {
	      var Component = ReactNativeComponent.getComponentClassForElement(this._currentElement);
	      if (Component.propTypes) {
	        this._checkPropTypes(Component.propTypes, newProps, ReactPropTypeLocations.prop);
	      }
	    }
	    return newProps;
	  },

	  /**
	   * Assert that the props are valid
	   *
	   * @param {object} propTypes Map of prop name to a ReactPropType
	   * @param {object} props
	   * @param {string} location e.g. "prop", "context", "child context"
	   * @private
	   */
	  _checkPropTypes: function _checkPropTypes(propTypes, props, location) {
	    // TODO: Stop validating prop types here and only use the element
	    // validation.
	    var componentName = this.getName();
	    for (var propName in propTypes) {
	      if (propTypes.hasOwnProperty(propName)) {
	        var error;
	        try {
	          // This is intentionally an invariant that gets caught. It's the same
	          // behavior as without this statement except with a better message.
	          false ? invariant(typeof propTypes[propName] === "function", "%s: %s type `%s` is invalid; it must be a function, usually " + "from React.PropTypes.", componentName || "React class", ReactPropTypeLocationNames[location], propName) : invariant(typeof propTypes[propName] === "function");
	          error = propTypes[propName](props, propName, componentName, location);
	        } catch (ex) {
	          error = ex;
	        }
	        if (error instanceof Error) {
	          // We may want to extend this logic for similar errors in
	          // React.render calls, so I'm abstracting it away into
	          // a function to minimize refactoring in the future
	          var addendum = getDeclarationErrorAddendum(this);

	          if (location === ReactPropTypeLocations.prop) {
	            // Preface gives us something to blacklist in warning module
	            false ? warning(false, "Failed Composite propType: %s%s", error.message, addendum) : null;
	          } else {
	            false ? warning(false, "Failed Context Types: %s%s", error.message, addendum) : null;
	          }
	        }
	      }
	    }
	  },

	  receiveComponent: function receiveComponent(nextElement, transaction, nextContext) {
	    var prevElement = this._currentElement;
	    var prevContext = this._context;

	    this._pendingElement = null;

	    this.updateComponent(transaction, prevElement, nextElement, prevContext, nextContext);
	  },

	  /**
	   * If any of `_pendingElement`, `_pendingStateQueue`, or `_pendingForceUpdate`
	   * is set, update the component.
	   *
	   * @param {ReactReconcileTransaction} transaction
	   * @internal
	   */
	  performUpdateIfNecessary: function performUpdateIfNecessary(transaction) {
	    if (this._pendingElement != null) {
	      ReactReconciler.receiveComponent(this, this._pendingElement || this._currentElement, transaction, this._context);
	    }

	    if (this._pendingStateQueue !== null || this._pendingForceUpdate) {
	      if (false) {
	        ReactElementValidator.checkAndWarnForMutatedProps(this._currentElement);
	      }

	      this.updateComponent(transaction, this._currentElement, this._currentElement, this._context, this._context);
	    }
	  },

	  /**
	   * Compare two contexts, warning if they are different
	   * TODO: Remove this check when owner-context is removed
	   */
	  _warnIfContextsDiffer: function _warnIfContextsDiffer(ownerBasedContext, parentBasedContext) {
	    ownerBasedContext = this._maskContext(ownerBasedContext);
	    parentBasedContext = this._maskContext(parentBasedContext);
	    var parentKeys = Object.keys(parentBasedContext).sort();
	    var displayName = this.getName() || "ReactCompositeComponent";
	    for (var i = 0; i < parentKeys.length; i++) {
	      var key = parentKeys[i];
	      false ? warning(ownerBasedContext[key] === parentBasedContext[key], "owner-based and parent-based contexts differ " + "(values: `%s` vs `%s`) for key (%s) while mounting %s " + "(see: http://fb.me/react-context-by-parent)", ownerBasedContext[key], parentBasedContext[key], key, displayName) : null;
	    }
	  },

	  /**
	   * Perform an update to a mounted component. The componentWillReceiveProps and
	   * shouldComponentUpdate methods are called, then (assuming the update isn't
	   * skipped) the remaining update lifecycle methods are called and the DOM
	   * representation is updated.
	   *
	   * By default, this implements React's rendering and reconciliation algorithm.
	   * Sophisticated clients may wish to override this.
	   *
	   * @param {ReactReconcileTransaction} transaction
	   * @param {ReactElement} prevParentElement
	   * @param {ReactElement} nextParentElement
	   * @internal
	   * @overridable
	   */
	  updateComponent: function updateComponent(transaction, prevParentElement, nextParentElement, prevUnmaskedContext, nextUnmaskedContext) {
	    var inst = this._instance;

	    var nextContext = inst.context;
	    var nextProps = inst.props;

	    // Distinguish between a props update versus a simple state update
	    if (prevParentElement !== nextParentElement) {
	      nextContext = this._processContext(nextParentElement._context);
	      nextProps = this._processProps(nextParentElement.props);

	      if (false) {
	        if (nextUnmaskedContext != null) {
	          this._warnIfContextsDiffer(nextParentElement._context, nextUnmaskedContext);
	        }
	      }

	      // An update here will schedule an update but immediately set
	      // _pendingStateQueue which will ensure that any state updates gets
	      // immediately reconciled instead of waiting for the next batch.

	      if (inst.componentWillReceiveProps) {
	        inst.componentWillReceiveProps(nextProps, nextContext);
	      }
	    }

	    var nextState = this._processPendingState(nextProps, nextContext);

	    var shouldUpdate = this._pendingForceUpdate || !inst.shouldComponentUpdate || inst.shouldComponentUpdate(nextProps, nextState, nextContext);

	    if (false) {
	      "production" !== process.env.NODE_ENV ? warning(typeof shouldUpdate !== "undefined", "%s.shouldComponentUpdate(): Returned undefined instead of a " + "boolean value. Make sure to return true or false.", this.getName() || "ReactCompositeComponent") : null;
	    }

	    if (shouldUpdate) {
	      this._pendingForceUpdate = false;
	      // Will set `this.props`, `this.state` and `this.context`.
	      this._performComponentUpdate(nextParentElement, nextProps, nextState, nextContext, transaction, nextUnmaskedContext);
	    } else {
	      // If it's determined that a component should not update, we still want
	      // to set props and state but we shortcut the rest of the update.
	      this._currentElement = nextParentElement;
	      this._context = nextUnmaskedContext;
	      inst.props = nextProps;
	      inst.state = nextState;
	      inst.context = nextContext;
	    }
	  },

	  _processPendingState: function _processPendingState(props, context) {
	    var inst = this._instance;
	    var queue = this._pendingStateQueue;
	    var replace = this._pendingReplaceState;
	    this._pendingReplaceState = false;
	    this._pendingStateQueue = null;

	    if (!queue) {
	      return inst.state;
	    }

	    if (replace && queue.length === 1) {
	      return queue[0];
	    }

	    var nextState = assign({}, replace ? queue[0] : inst.state);
	    for (var i = replace ? 1 : 0; i < queue.length; i++) {
	      var partial = queue[i];
	      assign(nextState, typeof partial === "function" ? partial.call(inst, nextState, props, context) : partial);
	    }

	    return nextState;
	  },

	  /**
	   * Merges new props and state, notifies delegate methods of update and
	   * performs update.
	   *
	   * @param {ReactElement} nextElement Next element
	   * @param {object} nextProps Next public object to set as properties.
	   * @param {?object} nextState Next object to set as state.
	   * @param {?object} nextContext Next public object to set as context.
	   * @param {ReactReconcileTransaction} transaction
	   * @param {?object} unmaskedContext
	   * @private
	   */
	  _performComponentUpdate: function _performComponentUpdate(nextElement, nextProps, nextState, nextContext, transaction, unmaskedContext) {
	    var inst = this._instance;

	    var prevProps = inst.props;
	    var prevState = inst.state;
	    var prevContext = inst.context;

	    if (inst.componentWillUpdate) {
	      inst.componentWillUpdate(nextProps, nextState, nextContext);
	    }

	    this._currentElement = nextElement;
	    this._context = unmaskedContext;
	    inst.props = nextProps;
	    inst.state = nextState;
	    inst.context = nextContext;

	    this._updateRenderedComponent(transaction, unmaskedContext);

	    if (inst.componentDidUpdate) {
	      transaction.getReactMountReady().enqueue(inst.componentDidUpdate.bind(inst, prevProps, prevState, prevContext), inst);
	    }
	  },

	  /**
	   * Call the component's `render` method and update the DOM accordingly.
	   *
	   * @param {ReactReconcileTransaction} transaction
	   * @internal
	   */
	  _updateRenderedComponent: function _updateRenderedComponent(transaction, context) {
	    var prevComponentInstance = this._renderedComponent;
	    var prevRenderedElement = prevComponentInstance._currentElement;
	    var childContext = this._getValidatedChildContext();
	    var nextRenderedElement = this._renderValidatedComponent(childContext);
	    if (shouldUpdateReactComponent(prevRenderedElement, nextRenderedElement)) {
	      ReactReconciler.receiveComponent(prevComponentInstance, nextRenderedElement, transaction, this._mergeChildContext(context, childContext));
	    } else {
	      // These two IDs are actually the same! But nothing should rely on that.
	      var thisID = this._rootNodeID;
	      var prevComponentID = prevComponentInstance._rootNodeID;
	      ReactReconciler.unmountComponent(prevComponentInstance);

	      this._renderedComponent = this._instantiateReactComponent(nextRenderedElement, this._currentElement.type);
	      var nextMarkup = ReactReconciler.mountComponent(this._renderedComponent, thisID, transaction, this._mergeChildContext(context, childContext));
	      this._replaceNodeWithMarkupByID(prevComponentID, nextMarkup);
	    }
	  },

	  /**
	   * @protected
	   */
	  _replaceNodeWithMarkupByID: function _replaceNodeWithMarkupByID(prevComponentID, nextMarkup) {
	    ReactComponentEnvironment.replaceNodeWithMarkupByID(prevComponentID, nextMarkup);
	  },

	  /**
	   * @protected
	   */
	  _renderValidatedComponentWithoutOwnerOrContext: function _renderValidatedComponentWithoutOwnerOrContext() {
	    var inst = this._instance;
	    var renderedComponent = inst.render();
	    if (false) {
	      // We allow auto-mocks to proceed as if they're returning null.
	      if (typeof renderedComponent === "undefined" && inst.render._isMockFunction) {
	        // This is probably bad practice. Consider warning here and
	        // deprecating this convenience.
	        renderedComponent = null;
	      }
	    }

	    return renderedComponent;
	  },

	  /**
	   * @private
	   */
	  _renderValidatedComponent: function _renderValidatedComponent(childContext) {
	    var renderedComponent;
	    var previousContext = ReactContext.current;
	    ReactContext.current = this._mergeChildContext(this._currentElement._context, childContext);
	    ReactCurrentOwner.current = this;
	    try {
	      renderedComponent = this._renderValidatedComponentWithoutOwnerOrContext();
	    } finally {
	      ReactContext.current = previousContext;
	      ReactCurrentOwner.current = null;
	    }
	    false ? invariant(
	    // TODO: An `isValidNode` function would probably be more appropriate
	    renderedComponent === null || renderedComponent === false || ReactElement.isValidElement(renderedComponent), "%s.render(): A valid ReactComponent must be returned. You may have " + "returned undefined, an array or some other invalid object.", this.getName() || "ReactCompositeComponent") : invariant( // TODO: An `isValidNode` function would probably be more appropriate
	    renderedComponent === null || renderedComponent === false || ReactElement.isValidElement(renderedComponent));
	    return renderedComponent;
	  },

	  /**
	   * Lazily allocates the refs object and stores `component` as `ref`.
	   *
	   * @param {string} ref Reference name.
	   * @param {component} component Component to store as `ref`.
	   * @final
	   * @private
	   */
	  attachRef: function attachRef(ref, component) {
	    var inst = this.getPublicInstance();
	    var refs = inst.refs === emptyObject ? inst.refs = {} : inst.refs;
	    refs[ref] = component.getPublicInstance();
	  },

	  /**
	   * Detaches a reference name.
	   *
	   * @param {string} ref Name to dereference.
	   * @final
	   * @private
	   */
	  detachRef: function detachRef(ref) {
	    var refs = this.getPublicInstance().refs;
	    delete refs[ref];
	  },

	  /**
	   * Get a text description of the component that can be used to identify it
	   * in error messages.
	   * @return {string} The name or null.
	   * @internal
	   */
	  getName: function getName() {
	    var type = this._currentElement.type;
	    var constructor = this._instance && this._instance.constructor;
	    return type.displayName || constructor && constructor.displayName || type.name || constructor && constructor.name || null;
	  },

	  /**
	   * Get the publicly accessible representation of this component - i.e. what
	   * is exposed by refs and returned by React.render. Can be null for stateless
	   * components.
	   *
	   * @return {ReactComponent} the public component instance.
	   * @internal
	   */
	  getPublicInstance: function getPublicInstance() {
	    return this._instance;
	  },

	  // Stub
	  _instantiateReactComponent: null

	};

	ReactPerf.measureMethods(ReactCompositeComponentMixin, "ReactCompositeComponent", {
	  mountComponent: "mountComponent",
	  updateComponent: "updateComponent",
	  _renderValidatedComponent: "_renderValidatedComponent"
	});

	var ReactCompositeComponent = {

	  Mixin: ReactCompositeComponentMixin

	};

	module.exports = ReactCompositeComponent;

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactInstanceMap
	 */

	'use strict';

	/**
	 * `ReactInstanceMap` maintains a mapping from a public facing stateful
	 * instance (key) and the internal representation (value). This allows public
	 * methods to accept the user facing instance as an argument and map them back
	 * to internal methods.
	 */

	// TODO: Replace this with ES6: var ReactInstanceMap = new Map();
	var ReactInstanceMap = {

	  /**
	   * This API should be called `delete` but we'd have to make sure to always
	   * transform these to strings for IE support. When this transform is fully
	   * supported we can rename it.
	   */
	  remove: function remove(key) {
	    key._reactInternalInstance = undefined;
	  },

	  get: function get(key) {
	    return key._reactInternalInstance;
	  },

	  has: function has(key) {
	    return key._reactInternalInstance !== undefined;
	  },

	  set: function set(key, value) {
	    key._reactInternalInstance = value;
	  }

	};

	module.exports = ReactInstanceMap;

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactLifeCycle
	 */

	'use strict';

	/**
	 * This module manages the bookkeeping when a component is in the process
	 * of being mounted or being unmounted. This is used as a way to enforce
	 * invariants (or warnings) when it is not recommended to call
	 * setState/forceUpdate.
	 *
	 * currentlyMountingInstance: During the construction phase, it is not possible
	 * to trigger an update since the instance is not fully mounted yet. However, we
	 * currently allow this as a convenience for mutating the initial state.
	 *
	 * currentlyUnmountingInstance: During the unmounting phase, the instance is
	 * still mounted and can therefore schedule an update. However, this is not
	 * recommended and probably an error since it's about to be unmounted.
	 * Therefore we still want to trigger in an error for that case.
	 */

	var ReactLifeCycle = {
	  currentlyMountingInstance: null,
	  currentlyUnmountingInstance: null
	};

	module.exports = ReactLifeCycle;

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactPerf
	 * @typechecks static-only
	 */

	"use strict";

	/**
	 * ReactPerf is a general AOP system designed to measure performance. This
	 * module only has the hooks: see ReactDefaultPerf for the analysis tool.
	 */
	var ReactPerf = {
	  /**
	   * Boolean to enable/disable measurement. Set to false by default to prevent
	   * accidental logging and perf loss.
	   */
	  enableMeasure: false,

	  /**
	   * Holds onto the measure function in use. By default, don't measure
	   * anything, but we'll override this if we inject a measure function.
	   */
	  storedMeasure: _noMeasure,

	  /**
	   * @param {object} object
	   * @param {string} objectName
	   * @param {object<string>} methodNames
	   */
	  measureMethods: function measureMethods(object, objectName, methodNames) {
	    if (false) {
	      for (var key in methodNames) {
	        if (!methodNames.hasOwnProperty(key)) {
	          continue;
	        }
	        object[key] = ReactPerf.measure(objectName, methodNames[key], object[key]);
	      }
	    }
	  },

	  /**
	   * Use this to wrap methods you want to measure. Zero overhead in production.
	   *
	   * @param {string} objName
	   * @param {string} fnName
	   * @param {function} func
	   * @return {function}
	   */
	  measure: function measure(objName, fnName, func) {
	    if (false) {
	      var measuredFunc = null;
	      var wrapper = function wrapper() {
	        if (ReactPerf.enableMeasure) {
	          if (!measuredFunc) {
	            measuredFunc = ReactPerf.storedMeasure(objName, fnName, func);
	          }
	          return measuredFunc.apply(this, arguments);
	        }
	        return func.apply(this, arguments);
	      };
	      wrapper.displayName = objName + "_" + fnName;
	      return wrapper;
	    }
	    return func;
	  },

	  injection: {
	    /**
	     * @param {function} measure
	     */
	    injectMeasure: function injectMeasure(measure) {
	      ReactPerf.storedMeasure = measure;
	    }
	  }
	};

	/**
	 * Simply passes through the measured function, without measuring it.
	 *
	 * @param {string} objName
	 * @param {string} fnName
	 * @param {function} func
	 * @return {function}
	 */
	function _noMeasure(objName, fnName, func) {
	  return func;
	}

	module.exports = ReactPerf;

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactUpdates
	 */

	"use strict";

	var CallbackQueue = __webpack_require__(37);
	var PooledClass = __webpack_require__(38);
	var ReactCurrentOwner = __webpack_require__(21);
	var ReactPerf = __webpack_require__(35);
	var ReactReconciler = __webpack_require__(10);
	var Transaction = __webpack_require__(39);

	var assign = __webpack_require__(19);
	var invariant = __webpack_require__(7);
	var warning = __webpack_require__(16);

	var dirtyComponents = [];
	var asapCallbackQueue = CallbackQueue.getPooled();
	var asapEnqueued = false;

	var batchingStrategy = null;

	function ensureInjected() {
	  false ? invariant(ReactUpdates.ReactReconcileTransaction && batchingStrategy, "ReactUpdates: must inject a reconcile transaction class and batching " + "strategy") : invariant(ReactUpdates.ReactReconcileTransaction && batchingStrategy);
	}

	var NESTED_UPDATES = {
	  initialize: function initialize() {
	    this.dirtyComponentsLength = dirtyComponents.length;
	  },
	  close: function close() {
	    if (this.dirtyComponentsLength !== dirtyComponents.length) {
	      // Additional updates were enqueued by componentDidUpdate handlers or
	      // similar; before our own UPDATE_QUEUEING wrapper closes, we want to run
	      // these new updates so that if A's componentDidUpdate calls setState on
	      // B, B will update before the callback A's updater provided when calling
	      // setState.
	      dirtyComponents.splice(0, this.dirtyComponentsLength);
	      flushBatchedUpdates();
	    } else {
	      dirtyComponents.length = 0;
	    }
	  }
	};

	var UPDATE_QUEUEING = {
	  initialize: function initialize() {
	    this.callbackQueue.reset();
	  },
	  close: function close() {
	    this.callbackQueue.notifyAll();
	  }
	};

	var TRANSACTION_WRAPPERS = [NESTED_UPDATES, UPDATE_QUEUEING];

	function ReactUpdatesFlushTransaction() {
	  this.reinitializeTransaction();
	  this.dirtyComponentsLength = null;
	  this.callbackQueue = CallbackQueue.getPooled();
	  this.reconcileTransaction = ReactUpdates.ReactReconcileTransaction.getPooled();
	}

	assign(ReactUpdatesFlushTransaction.prototype, Transaction.Mixin, {
	  getTransactionWrappers: function getTransactionWrappers() {
	    return TRANSACTION_WRAPPERS;
	  },

	  destructor: function destructor() {
	    this.dirtyComponentsLength = null;
	    CallbackQueue.release(this.callbackQueue);
	    this.callbackQueue = null;
	    ReactUpdates.ReactReconcileTransaction.release(this.reconcileTransaction);
	    this.reconcileTransaction = null;
	  },

	  perform: function perform(method, scope, a) {
	    // Essentially calls `this.reconcileTransaction.perform(method, scope, a)`
	    // with this transaction's wrappers around it.
	    return Transaction.Mixin.perform.call(this, this.reconcileTransaction.perform, this.reconcileTransaction, method, scope, a);
	  }
	});

	PooledClass.addPoolingTo(ReactUpdatesFlushTransaction);

	function batchedUpdates(callback, a, b, c, d) {
	  ensureInjected();
	  batchingStrategy.batchedUpdates(callback, a, b, c, d);
	}

	/**
	 * Array comparator for ReactComponents by mount ordering.
	 *
	 * @param {ReactComponent} c1 first component you're comparing
	 * @param {ReactComponent} c2 second component you're comparing
	 * @return {number} Return value usable by Array.prototype.sort().
	 */
	function mountOrderComparator(c1, c2) {
	  return c1._mountOrder - c2._mountOrder;
	}

	function runBatchedUpdates(transaction) {
	  var len = transaction.dirtyComponentsLength;
	  false ? invariant(len === dirtyComponents.length, "Expected flush transaction's stored dirty-components length (%s) to " + "match dirty-components array length (%s).", len, dirtyComponents.length) : invariant(len === dirtyComponents.length);

	  // Since reconciling a component higher in the owner hierarchy usually (not
	  // always -- see shouldComponentUpdate()) will reconcile children, reconcile
	  // them before their children by sorting the array.
	  dirtyComponents.sort(mountOrderComparator);

	  for (var i = 0; i < len; i++) {
	    // If a component is unmounted before pending changes apply, it will still
	    // be here, but we assume that it has cleared its _pendingCallbacks and
	    // that performUpdateIfNecessary is a noop.
	    var component = dirtyComponents[i];

	    // If performUpdateIfNecessary happens to enqueue any new updates, we
	    // shouldn't execute the callbacks until the next render happens, so
	    // stash the callbacks first
	    var callbacks = component._pendingCallbacks;
	    component._pendingCallbacks = null;

	    ReactReconciler.performUpdateIfNecessary(component, transaction.reconcileTransaction);

	    if (callbacks) {
	      for (var j = 0; j < callbacks.length; j++) {
	        transaction.callbackQueue.enqueue(callbacks[j], component.getPublicInstance());
	      }
	    }
	  }
	}

	var flushBatchedUpdates = function flushBatchedUpdates() {
	  // ReactUpdatesFlushTransaction's wrappers will clear the dirtyComponents
	  // array and perform any updates enqueued by mount-ready handlers (i.e.,
	  // componentDidUpdate) but we need to check here too in order to catch
	  // updates enqueued by setState callbacks and asap calls.
	  while (dirtyComponents.length || asapEnqueued) {
	    if (dirtyComponents.length) {
	      var transaction = ReactUpdatesFlushTransaction.getPooled();
	      transaction.perform(runBatchedUpdates, null, transaction);
	      ReactUpdatesFlushTransaction.release(transaction);
	    }

	    if (asapEnqueued) {
	      asapEnqueued = false;
	      var queue = asapCallbackQueue;
	      asapCallbackQueue = CallbackQueue.getPooled();
	      queue.notifyAll();
	      CallbackQueue.release(queue);
	    }
	  }
	};
	flushBatchedUpdates = ReactPerf.measure("ReactUpdates", "flushBatchedUpdates", flushBatchedUpdates);

	/**
	 * Mark a component as needing a rerender, adding an optional callback to a
	 * list of functions which will be executed once the rerender occurs.
	 */
	function enqueueUpdate(component) {
	  ensureInjected();

	  // Various parts of our code (such as ReactCompositeComponent's
	  // _renderValidatedComponent) assume that calls to render aren't nested;
	  // verify that that's the case. (This is called by each top-level update
	  // function, like setProps, setState, forceUpdate, etc.; creation and
	  // destruction of top-level components is guarded in ReactMount.)
	  false ? warning(ReactCurrentOwner.current == null, "enqueueUpdate(): Render methods should be a pure function of props " + "and state; triggering nested component updates from render is not " + "allowed. If necessary, trigger nested updates in " + "componentDidUpdate.") : null;

	  if (!batchingStrategy.isBatchingUpdates) {
	    batchingStrategy.batchedUpdates(enqueueUpdate, component);
	    return;
	  }

	  dirtyComponents.push(component);
	}

	/**
	 * Enqueue a callback to be run at the end of the current batching cycle. Throws
	 * if no updates are currently being performed.
	 */
	function asap(callback, context) {
	  false ? invariant(batchingStrategy.isBatchingUpdates, "ReactUpdates.asap: Can't enqueue an asap callback in a context where" + "updates are not being batched.") : invariant(batchingStrategy.isBatchingUpdates);
	  asapCallbackQueue.enqueue(callback, context);
	  asapEnqueued = true;
	}

	var ReactUpdatesInjection = {
	  injectReconcileTransaction: function injectReconcileTransaction(ReconcileTransaction) {
	    false ? invariant(ReconcileTransaction, "ReactUpdates: must provide a reconcile transaction class") : invariant(ReconcileTransaction);
	    ReactUpdates.ReactReconcileTransaction = ReconcileTransaction;
	  },

	  injectBatchingStrategy: function injectBatchingStrategy(_batchingStrategy) {
	    false ? invariant(_batchingStrategy, "ReactUpdates: must provide a batching strategy") : invariant(_batchingStrategy);
	    false ? invariant(typeof _batchingStrategy.batchedUpdates === "function", "ReactUpdates: must provide a batchedUpdates() function") : invariant(typeof _batchingStrategy.batchedUpdates === "function");
	    false ? invariant(typeof _batchingStrategy.isBatchingUpdates === "boolean", "ReactUpdates: must provide an isBatchingUpdates boolean attribute") : invariant(typeof _batchingStrategy.isBatchingUpdates === "boolean");
	    batchingStrategy = _batchingStrategy;
	  }
	};

	var ReactUpdates = {
	  /**
	   * React references `ReactReconcileTransaction` using this property in order
	   * to allow dependency injection.
	   *
	   * @internal
	   */
	  ReactReconcileTransaction: null,

	  batchedUpdates: batchedUpdates,
	  enqueueUpdate: enqueueUpdate,
	  flushBatchedUpdates: flushBatchedUpdates,
	  injection: ReactUpdatesInjection,
	  asap: asap
	};

	module.exports = ReactUpdates;

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule CallbackQueue
	 */

	"use strict";

	var PooledClass = __webpack_require__(38);

	var assign = __webpack_require__(19);
	var invariant = __webpack_require__(7);

	/**
	 * A specialized pseudo-event module to help keep track of components waiting to
	 * be notified when their DOM representations are available for use.
	 *
	 * This implements `PooledClass`, so you should never need to instantiate this.
	 * Instead, use `CallbackQueue.getPooled()`.
	 *
	 * @class ReactMountReady
	 * @implements PooledClass
	 * @internal
	 */
	function CallbackQueue() {
	  this._callbacks = null;
	  this._contexts = null;
	}

	assign(CallbackQueue.prototype, {

	  /**
	   * Enqueues a callback to be invoked when `notifyAll` is invoked.
	   *
	   * @param {function} callback Invoked when `notifyAll` is invoked.
	   * @param {?object} context Context to call `callback` with.
	   * @internal
	   */
	  enqueue: function enqueue(callback, context) {
	    this._callbacks = this._callbacks || [];
	    this._contexts = this._contexts || [];
	    this._callbacks.push(callback);
	    this._contexts.push(context);
	  },

	  /**
	   * Invokes all enqueued callbacks and clears the queue. This is invoked after
	   * the DOM representation of a component has been created or updated.
	   *
	   * @internal
	   */
	  notifyAll: function notifyAll() {
	    var callbacks = this._callbacks;
	    var contexts = this._contexts;
	    if (callbacks) {
	      false ? invariant(callbacks.length === contexts.length, "Mismatched list of contexts in callback queue") : invariant(callbacks.length === contexts.length);
	      this._callbacks = null;
	      this._contexts = null;
	      for (var i = 0, l = callbacks.length; i < l; i++) {
	        callbacks[i].call(contexts[i]);
	      }
	      callbacks.length = 0;
	      contexts.length = 0;
	    }
	  },

	  /**
	   * Resets the internal queue.
	   *
	   * @internal
	   */
	  reset: function reset() {
	    this._callbacks = null;
	    this._contexts = null;
	  },

	  /**
	   * `PooledClass` looks for this.
	   */
	  destructor: function destructor() {
	    this.reset();
	  }

	});

	PooledClass.addPoolingTo(CallbackQueue);

	module.exports = CallbackQueue;

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule PooledClass
	 */

	"use strict";

	var invariant = __webpack_require__(7);

	/**
	 * Static poolers. Several custom versions for each potential number of
	 * arguments. A completely generic pooler is easy to implement, but would
	 * require accessing the `arguments` object. In each of these, `this` refers to
	 * the Class itself, not an instance. If any others are needed, simply add them
	 * here, or in their own files.
	 */
	var oneArgumentPooler = function oneArgumentPooler(copyFieldsFrom) {
	  var Klass = this;
	  if (Klass.instancePool.length) {
	    var instance = Klass.instancePool.pop();
	    Klass.call(instance, copyFieldsFrom);
	    return instance;
	  } else {
	    return new Klass(copyFieldsFrom);
	  }
	};

	var twoArgumentPooler = function twoArgumentPooler(a1, a2) {
	  var Klass = this;
	  if (Klass.instancePool.length) {
	    var instance = Klass.instancePool.pop();
	    Klass.call(instance, a1, a2);
	    return instance;
	  } else {
	    return new Klass(a1, a2);
	  }
	};

	var threeArgumentPooler = function threeArgumentPooler(a1, a2, a3) {
	  var Klass = this;
	  if (Klass.instancePool.length) {
	    var instance = Klass.instancePool.pop();
	    Klass.call(instance, a1, a2, a3);
	    return instance;
	  } else {
	    return new Klass(a1, a2, a3);
	  }
	};

	var fiveArgumentPooler = function fiveArgumentPooler(a1, a2, a3, a4, a5) {
	  var Klass = this;
	  if (Klass.instancePool.length) {
	    var instance = Klass.instancePool.pop();
	    Klass.call(instance, a1, a2, a3, a4, a5);
	    return instance;
	  } else {
	    return new Klass(a1, a2, a3, a4, a5);
	  }
	};

	var standardReleaser = function standardReleaser(instance) {
	  var Klass = this;
	  false ? invariant(instance instanceof Klass, "Trying to release an instance into a pool of a different type.") : invariant(instance instanceof Klass);
	  if (instance.destructor) {
	    instance.destructor();
	  }
	  if (Klass.instancePool.length < Klass.poolSize) {
	    Klass.instancePool.push(instance);
	  }
	};

	var DEFAULT_POOL_SIZE = 10;
	var DEFAULT_POOLER = oneArgumentPooler;

	/**
	 * Augments `CopyConstructor` to be a poolable class, augmenting only the class
	 * itself (statically) not adding any prototypical fields. Any CopyConstructor
	 * you give this may have a `poolSize` property, and will look for a
	 * prototypical `destructor` on instances (optional).
	 *
	 * @param {Function} CopyConstructor Constructor that can be used to reset.
	 * @param {Function} pooler Customizable pooler.
	 */
	var addPoolingTo = function addPoolingTo(CopyConstructor, pooler) {
	  var NewKlass = CopyConstructor;
	  NewKlass.instancePool = [];
	  NewKlass.getPooled = pooler || DEFAULT_POOLER;
	  if (!NewKlass.poolSize) {
	    NewKlass.poolSize = DEFAULT_POOL_SIZE;
	  }
	  NewKlass.release = standardReleaser;
	  return NewKlass;
	};

	var PooledClass = {
	  addPoolingTo: addPoolingTo,
	  oneArgumentPooler: oneArgumentPooler,
	  twoArgumentPooler: twoArgumentPooler,
	  threeArgumentPooler: threeArgumentPooler,
	  fiveArgumentPooler: fiveArgumentPooler
	};

	module.exports = PooledClass;

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule Transaction
	 */

	"use strict";

	var invariant = __webpack_require__(7);

	/**
	 * `Transaction` creates a black box that is able to wrap any method such that
	 * certain invariants are maintained before and after the method is invoked
	 * (Even if an exception is thrown while invoking the wrapped method). Whoever
	 * instantiates a transaction can provide enforcers of the invariants at
	 * creation time. The `Transaction` class itself will supply one additional
	 * automatic invariant for you - the invariant that any transaction instance
	 * should not be run while it is already being run. You would typically create a
	 * single instance of a `Transaction` for reuse multiple times, that potentially
	 * is used to wrap several different methods. Wrappers are extremely simple -
	 * they only require implementing two methods.
	 *
	 * <pre>
	 *                       wrappers (injected at creation time)
	 *                                      +        +
	 *                                      |        |
	 *                    +-----------------|--------|--------------+
	 *                    |                 v        |              |
	 *                    |      +---------------+   |              |
	 *                    |   +--|    wrapper1   |---|----+         |
	 *                    |   |  +---------------+   v    |         |
	 *                    |   |          +-------------+  |         |
	 *                    |   |     +----|   wrapper2  |--------+   |
	 *                    |   |     |    +-------------+  |     |   |
	 *                    |   |     |                     |     |   |
	 *                    |   v     v                     v     v   | wrapper
	 *                    | +---+ +---+   +---------+   +---+ +---+ | invariants
	 * perform(anyMethod) | |   | |   |   |         |   |   | |   | | maintained
	 * +----------------->|-|---|-|---|-->|anyMethod|---|---|-|---|-|-------->
	 *                    | |   | |   |   |         |   |   | |   | |
	 *                    | |   | |   |   |         |   |   | |   | |
	 *                    | |   | |   |   |         |   |   | |   | |
	 *                    | +---+ +---+   +---------+   +---+ +---+ |
	 *                    |  initialize                    close    |
	 *                    +-----------------------------------------+
	 * </pre>
	 *
	 * Use cases:
	 * - Preserving the input selection ranges before/after reconciliation.
	 *   Restoring selection even in the event of an unexpected error.
	 * - Deactivating events while rearranging the DOM, preventing blurs/focuses,
	 *   while guaranteeing that afterwards, the event system is reactivated.
	 * - Flushing a queue of collected DOM mutations to the main UI thread after a
	 *   reconciliation takes place in a worker thread.
	 * - Invoking any collected `componentDidUpdate` callbacks after rendering new
	 *   content.
	 * - (Future use case): Wrapping particular flushes of the `ReactWorker` queue
	 *   to preserve the `scrollTop` (an automatic scroll aware DOM).
	 * - (Future use case): Layout calculations before and after DOM updates.
	 *
	 * Transactional plugin API:
	 * - A module that has an `initialize` method that returns any precomputation.
	 * - and a `close` method that accepts the precomputation. `close` is invoked
	 *   when the wrapped process is completed, or has failed.
	 *
	 * @param {Array<TransactionalWrapper>} transactionWrapper Wrapper modules
	 * that implement `initialize` and `close`.
	 * @return {Transaction} Single transaction for reuse in thread.
	 *
	 * @class Transaction
	 */
	var Mixin = {
	  /**
	   * Sets up this instance so that it is prepared for collecting metrics. Does
	   * so such that this setup method may be used on an instance that is already
	   * initialized, in a way that does not consume additional memory upon reuse.
	   * That can be useful if you decide to make your subclass of this mixin a
	   * "PooledClass".
	   */
	  reinitializeTransaction: function reinitializeTransaction() {
	    this.transactionWrappers = this.getTransactionWrappers();
	    if (!this.wrapperInitData) {
	      this.wrapperInitData = [];
	    } else {
	      this.wrapperInitData.length = 0;
	    }
	    this._isInTransaction = false;
	  },

	  _isInTransaction: false,

	  /**
	   * @abstract
	   * @return {Array<TransactionWrapper>} Array of transaction wrappers.
	   */
	  getTransactionWrappers: null,

	  isInTransaction: function isInTransaction() {
	    return !!this._isInTransaction;
	  },

	  /**
	   * Executes the function within a safety window. Use this for the top level
	   * methods that result in large amounts of computation/mutations that would
	   * need to be safety checked.
	   *
	   * @param {function} method Member of scope to call.
	   * @param {Object} scope Scope to invoke from.
	   * @param {Object?=} args... Arguments to pass to the method (optional).
	   *                           Helps prevent need to bind in many cases.
	   * @return Return value from `method`.
	   */
	  perform: function perform(method, scope, a, b, c, d, e, f) {
	    false ? invariant(!this.isInTransaction(), "Transaction.perform(...): Cannot initialize a transaction when there " + "is already an outstanding transaction.") : invariant(!this.isInTransaction());
	    var errorThrown;
	    var ret;
	    try {
	      this._isInTransaction = true;
	      // Catching errors makes debugging more difficult, so we start with
	      // errorThrown set to true before setting it to false after calling
	      // close -- if it's still set to true in the finally block, it means
	      // one of these calls threw.
	      errorThrown = true;
	      this.initializeAll(0);
	      ret = method.call(scope, a, b, c, d, e, f);
	      errorThrown = false;
	    } finally {
	      try {
	        if (errorThrown) {
	          // If `method` throws, prefer to show that stack trace over any thrown
	          // by invoking `closeAll`.
	          try {
	            this.closeAll(0);
	          } catch (err) {}
	        } else {
	          // Since `method` didn't throw, we don't want to silence the exception
	          // here.
	          this.closeAll(0);
	        }
	      } finally {
	        this._isInTransaction = false;
	      }
	    }
	    return ret;
	  },

	  initializeAll: function initializeAll(startIndex) {
	    var transactionWrappers = this.transactionWrappers;
	    for (var i = startIndex; i < transactionWrappers.length; i++) {
	      var wrapper = transactionWrappers[i];
	      try {
	        // Catching errors makes debugging more difficult, so we start with the
	        // OBSERVED_ERROR state before overwriting it with the real return value
	        // of initialize -- if it's still set to OBSERVED_ERROR in the finally
	        // block, it means wrapper.initialize threw.
	        this.wrapperInitData[i] = Transaction.OBSERVED_ERROR;
	        this.wrapperInitData[i] = wrapper.initialize ? wrapper.initialize.call(this) : null;
	      } finally {
	        if (this.wrapperInitData[i] === Transaction.OBSERVED_ERROR) {
	          // The initializer for wrapper i threw an error; initialize the
	          // remaining wrappers but silence any exceptions from them to ensure
	          // that the first error is the one to bubble up.
	          try {
	            this.initializeAll(i + 1);
	          } catch (err) {}
	        }
	      }
	    }
	  },

	  /**
	   * Invokes each of `this.transactionWrappers.close[i]` functions, passing into
	   * them the respective return values of `this.transactionWrappers.init[i]`
	   * (`close`rs that correspond to initializers that failed will not be
	   * invoked).
	   */
	  closeAll: function closeAll(startIndex) {
	    false ? invariant(this.isInTransaction(), "Transaction.closeAll(): Cannot close transaction when none are open.") : invariant(this.isInTransaction());
	    var transactionWrappers = this.transactionWrappers;
	    for (var i = startIndex; i < transactionWrappers.length; i++) {
	      var wrapper = transactionWrappers[i];
	      var initData = this.wrapperInitData[i];
	      var errorThrown;
	      try {
	        // Catching errors makes debugging more difficult, so we start with
	        // errorThrown set to true before setting it to false after calling
	        // close -- if it's still set to true in the finally block, it means
	        // wrapper.close threw.
	        errorThrown = true;
	        if (initData !== Transaction.OBSERVED_ERROR && wrapper.close) {
	          wrapper.close.call(this, initData);
	        }
	        errorThrown = false;
	      } finally {
	        if (errorThrown) {
	          // The closer for wrapper i threw an error; close the remaining
	          // wrappers but silence any exceptions from them to ensure that the
	          // first error is the one to bubble up.
	          try {
	            this.closeAll(i + 1);
	          } catch (e) {}
	        }
	      }
	    }
	    this.wrapperInitData.length = 0;
	  }
	};

	var Transaction = {

	  Mixin: Mixin,

	  /**
	   * Token to look for to determine if an error occured.
	   */
	  OBSERVED_ERROR: {}

	};

	module.exports = Transaction;

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule shouldUpdateReactComponent
	 * @typechecks static-only
	 */

	'use strict';

	var warning = __webpack_require__(16);

	/**
	 * Given a `prevElement` and `nextElement`, determines if the existing
	 * instance should be updated as opposed to being destroyed or replaced by a new
	 * instance. Both arguments are elements. This ensures that this logic can
	 * operate on stateless trees without any backing instance.
	 *
	 * @param {?object} prevElement
	 * @param {?object} nextElement
	 * @return {boolean} True if the existing instance should be updated.
	 * @protected
	 */
	function shouldUpdateReactComponent(prevElement, nextElement) {
	  if (prevElement != null && nextElement != null) {
	    var prevType = typeof prevElement;
	    var nextType = typeof nextElement;
	    if (prevType === 'string' || prevType === 'number') {
	      return nextType === 'string' || nextType === 'number';
	    } else {
	      if (nextType === 'object' && prevElement.type === nextElement.type && prevElement.key === nextElement.key) {
	        var ownersMatch = prevElement._owner === nextElement._owner;
	        var prevName = null;
	        var nextName = null;
	        var nextDisplayName = null;
	        if (false) {
	          if (!ownersMatch) {
	            if (prevElement._owner != null && prevElement._owner.getPublicInstance() != null && prevElement._owner.getPublicInstance().constructor != null) {
	              prevName = prevElement._owner.getPublicInstance().constructor.displayName;
	            }
	            if (nextElement._owner != null && nextElement._owner.getPublicInstance() != null && nextElement._owner.getPublicInstance().constructor != null) {
	              nextName = nextElement._owner.getPublicInstance().constructor.displayName;
	            }
	            if (nextElement.type != null && nextElement.type.displayName != null) {
	              nextDisplayName = nextElement.type.displayName;
	            }
	            if (nextElement.type != null && typeof nextElement.type === 'string') {
	              nextDisplayName = nextElement.type;
	            }
	            if (typeof nextElement.type !== 'string' || nextElement.type === 'input' || nextElement.type === 'textarea') {
	              if (prevElement._owner != null && prevElement._owner._isOwnerNecessary === false || nextElement._owner != null && nextElement._owner._isOwnerNecessary === false) {
	                if (prevElement._owner != null) {
	                  prevElement._owner._isOwnerNecessary = true;
	                }
	                if (nextElement._owner != null) {
	                  nextElement._owner._isOwnerNecessary = true;
	                }
	                'production' !== process.env.NODE_ENV ? warning(false, '<%s /> is being rendered by both %s and %s using the same ' + 'key (%s) in the same place. Currently, this means that ' + 'they don\'t preserve state. This behavior should be very ' + 'rare so we\'re considering deprecating it. Please contact ' + 'the React team and explain your use case so that we can ' + 'take that into consideration.', nextDisplayName || 'Unknown Component', prevName || '[Unknown]', nextName || '[Unknown]', prevElement.key) : null;
	              }
	            }
	          }
	        }
	        return ownersMatch;
	      }
	    }
	  }
	  return false;
	}

	module.exports = shouldUpdateReactComponent;

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactEmptyComponent
	 */

	"use strict";

	var ReactElement = __webpack_require__(15);
	var ReactInstanceMap = __webpack_require__(33);

	var invariant = __webpack_require__(7);

	var component;
	// This registry keeps track of the React IDs of the components that rendered to
	// `null` (in reality a placeholder such as `noscript`)
	var nullComponentIDsRegistry = {};

	var ReactEmptyComponentInjection = {
	  injectEmptyComponent: function injectEmptyComponent(emptyComponent) {
	    component = ReactElement.createFactory(emptyComponent);
	  }
	};

	var ReactEmptyComponentType = function ReactEmptyComponentType() {};
	ReactEmptyComponentType.prototype.componentDidMount = function () {
	  var internalInstance = ReactInstanceMap.get(this);
	  // TODO: Make sure we run these methods in the correct order, we shouldn't
	  // need this check. We're going to assume if we're here it means we ran
	  // componentWillUnmount already so there is no internal instance (it gets
	  // removed as part of the unmounting process).
	  if (!internalInstance) {
	    return;
	  }
	  registerNullComponentID(internalInstance._rootNodeID);
	};
	ReactEmptyComponentType.prototype.componentWillUnmount = function () {
	  var internalInstance = ReactInstanceMap.get(this);
	  // TODO: Get rid of this check. See TODO in componentDidMount.
	  if (!internalInstance) {
	    return;
	  }
	  deregisterNullComponentID(internalInstance._rootNodeID);
	};
	ReactEmptyComponentType.prototype.render = function () {
	  false ? invariant(component, "Trying to return null from a render, but no null placeholder component " + "was injected.") : invariant(component);
	  return component();
	};

	var emptyElement = ReactElement.createElement(ReactEmptyComponentType);

	/**
	 * Mark the component as having rendered to null.
	 * @param {string} id Component's `_rootNodeID`.
	 */
	function registerNullComponentID(id) {
	  nullComponentIDsRegistry[id] = true;
	}

	/**
	 * Unmark the component as having rendered to null: it renders to something now.
	 * @param {string} id Component's `_rootNodeID`.
	 */
	function deregisterNullComponentID(id) {
	  delete nullComponentIDsRegistry[id];
	}

	/**
	 * @param {string} id Component's `_rootNodeID`.
	 * @return {boolean} True if the component is rendered to null.
	 */
	function isNullComponentID(id) {
	  return !!nullComponentIDsRegistry[id];
	}

	var ReactEmptyComponent = {
	  emptyElement: emptyElement,
	  injection: ReactEmptyComponentInjection,
	  isNullComponentID: isNullComponentID
	};

	module.exports = ReactEmptyComponent;

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var VML = __webpack_require__(43);
	var Canvas = __webpack_require__(62);
	//var Flash = require('./flash');

	var hasCanvas = function hasCanvas() {

		var canvas = document.createElement('canvas');
		return canvas && !!canvas.getContext;
	};

	/*
	var hasFlash = function(){

		var flash = navigator.plugins && navigator.plugins['Shockwave Flash'];
		try {
			flash = flash ? flash.description :
				new ActiveXObject('ShockwaveFlash.ShockwaveFlash')
				.GetVariable('$version');
		} catch (x){ }
		return flash && flash.match(/\d+/) >= 9;

	};
	*/

	var MODE = hasCanvas() ? Canvas : /*hasFlash() ? Flash :*/VML;

	exports.Surface = MODE.Surface;
	exports.Path = MODE.Path;
	exports.Shape = MODE.Shape;
	exports.Group = MODE.Group;
	exports.ClippingRectangle = MODE.ClippingRectangle;
	exports.Text = MODE.Text;

	__webpack_require__(61).setCurrent(exports);

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.Surface = __webpack_require__(53);
	exports.Path = __webpack_require__(54);
	exports.Shape = __webpack_require__(56);
	exports.Group = __webpack_require__(59);
	exports.ClippingRectangle = __webpack_require__(44);
	exports.Text = __webpack_require__(60);

	var DOM = __webpack_require__(52);
	if (typeof document !== 'undefined') DOM.init(document);

	__webpack_require__(61).setCurrent(exports);

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Class = __webpack_require__(45);
	var Transform = __webpack_require__(46);
	var Container = __webpack_require__(47);
	var Node = __webpack_require__(48);

	module.exports = Class(Node, Container, {

	  element_initialize: Node.prototype.initialize,

	  initialize: function initialize(width, height) {
	    this.element_initialize('clippingrectangle');
	    this.width = width;
	    this.height = height;
	  },

	  _transform: function _transform() {
	    var element = this.element;
	    element.clip = true;
	    element.coordorigin = -this.x + ',' + -1 * this.y;
	    element.coordsize = this.width + ',' + this.height;
	    // IE8 doesn't like clipBottom.  Don't ask me why.
	    // element.style.clipBottom = this.height + this.y;
	    element.style.clipLeft = this.x;
	    element.style.clipRight = this.width + this.x;
	    element.style.clipTop = this.y;
	    element.style.left = -this.x;
	    element.style.top = -this.y;
	    element.style.width = this.width + this.x;
	    element.style.height = this.height + this.y;
	    element.style.rotation = 0;

	    var container = this.parentNode;
	    this._activeTransform = container ? new Transform(container._activeTransform).transform(this) : this;
	    var node = this.firstChild;
	    while (node) {
	      node._transform();
	      node = node.nextSibling;
	    }
	  }

	});

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (mixins) {
		var proto = {};
		for (var i = 0, l = arguments.length; i < l; i++) {
			var mixin = arguments[i];
			if (typeof mixin == 'function') mixin = mixin.prototype;
			for (var key in mixin) proto[key] = mixin[key];
		}
		if (!proto.initialize) proto.initialize = function () {};
		proto.constructor = function (a, b, c, d, e, f, g, h) {
			return new proto.initialize(a, b, c, d, e, f, g, h);
		};
		proto.constructor.prototype = proto.initialize.prototype = proto;
		return proto.constructor;
	};

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Class = __webpack_require__(45);

	function Transform(xx, yx, xy, yy, x, y) {
		if (xx && typeof xx == 'object') {
			yx = xx.yx;yy = xx.yy;y = xx.y;
			xy = xx.xy;x = xx.x;xx = xx.xx;
		}
		this.xx = xx == null ? 1 : xx;
		this.yx = yx || 0;
		this.xy = xy || 0;
		this.yy = yy == null ? 1 : yy;
		this.x = (x == null ? this.x : x) || 0;
		this.y = (y == null ? this.y : y) || 0;
		this._transform();
		return this;
	};

	module.exports = Class({

		initialize: Transform,

		_transform: function _transform() {},

		xx: 1, yx: 0, x: 0,
		xy: 0, yy: 1, y: 0,

		transform: function transform(xx, yx, xy, yy, x, y) {
			var m = this;
			if (xx && typeof xx == 'object') {
				yx = xx.yx;yy = xx.yy;y = xx.y;
				xy = xx.xy;x = xx.x;xx = xx.xx;
			}
			if (!x) x = 0;
			if (!y) y = 0;
			return this.transformTo(m.xx * xx + m.xy * yx, m.yx * xx + m.yy * yx, m.xx * xy + m.xy * yy, m.yx * xy + m.yy * yy, m.xx * x + m.xy * y + m.x, m.yx * x + m.yy * y + m.y);
		},

		transformTo: Transform,

		translate: function translate(x, y) {
			return this.transform(1, 0, 0, 1, x, y);
		},

		move: function move(x, y) {
			this.x += x || 0;
			this.y += y || 0;
			this._transform();
			return this;
		},

		scale: function scale(x, y) {
			if (y == null) y = x;
			return this.transform(x, 0, 0, y, 0, 0);
		},

		rotate: function rotate(deg, x, y) {
			if (x == null || y == null) {
				x = (this.left || 0) + (this.width || 0) / 2;
				y = (this.top || 0) + (this.height || 0) / 2;
			}

			var rad = deg * Math.PI / 180,
			    sin = Math.sin(rad),
			    cos = Math.cos(rad);

			this.transform(1, 0, 0, 1, x, y);
			var m = this;

			return this.transformTo(cos * m.xx - sin * m.yx, sin * m.xx + cos * m.yx, cos * m.xy - sin * m.yy, sin * m.xy + cos * m.yy, m.x, m.y).transform(1, 0, 0, 1, -x, -y);
		},

		moveTo: function moveTo(x, y) {
			var m = this;
			return this.transformTo(m.xx, m.yx, m.xy, m.yy, x, y);
		},

		rotateTo: function rotateTo(deg, x, y) {
			var m = this;
			var flip = m.yx / m.xx > m.yy / m.xy ? -1 : 1;
			if (m.xx < 0 ? m.xy >= 0 : m.xy < 0) flip = -flip;
			return this.rotate(deg - Math.atan2(flip * m.yx, flip * m.xx) * 180 / Math.PI, x, y);
		},

		scaleTo: function scaleTo(x, y) {
			// Normalize
			var m = this;

			var h = Math.sqrt(m.xx * m.xx + m.yx * m.yx);
			m.xx /= h;m.yx /= h;

			h = Math.sqrt(m.yy * m.yy + m.xy * m.xy);
			m.yy /= h;m.xy /= h;

			return this.scale(x, y);
		},

		resizeTo: function resizeTo(width, height) {
			var w = this.width,
			    h = this.height;
			if (!w || !h) return this;
			return this.scaleTo(width / w, height / h);
		},

		/*
	 inverse: function(){
	 	var a = this.xx, b = this.yx,
	 		c = this.xy, d = this.yy,
	 		e = this.x, f = this.y;
	 	if (a * d - b * c == 0) return null;
	 	return new Transform(
	 		d/(a * d-b * c), b/(b * c-a * d),
	 		c/(b * c-a * d), a/(a * d-b * c),
	 		(d * e-c * f)/(b * c-a * d), (b * e-a * f)/(a * d-b * c)
	 	);
	 },
	 */

		inversePoint: function inversePoint(x, y) {
			var a = this.xx,
			    b = this.yx,
			    c = this.xy,
			    d = this.yy,
			    e = this.x,
			    f = this.y;
			var det = b * c - a * d;
			if (det == 0) return null;
			return {
				x: (d * (e - x) + c * (y - f)) / det,
				y: (a * (f - y) + b * (x - e)) / det
			};
		},

		point: function point(x, y) {
			var m = this;
			return {
				x: m.xx * x + m.xy * y + m.x,
				y: m.yx * x + m.yy * y + m.y
			};
		}

	});

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Class = __webpack_require__(45);

	module.exports = Class({

		grab: function grab() {
			for (var i = 0; i < arguments.length; i++) arguments[i].inject(this);
			return this;
		},

		empty: function empty() {
			var node;
			while (node = this.firstChild) node.eject();
			return this;
		}

	});

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Class = __webpack_require__(45);
	var Transform = __webpack_require__(46);
	var Element = __webpack_require__(49);
	var DOM = __webpack_require__(52);

	module.exports = Class(Element, Transform, {

		initialize: function initialize(tag) {
			//this.uid = uniqueID();
			var element = this.element = DOM.createElement(tag);
			//element.setAttribute('id', 'e' + this.uid);
		},

		_place: function _place() {
			if (this.parentNode) {
				this._transform();
			}
		},

		// visibility

		hide: function hide() {
			this.element.style.display = 'none';
			return this;
		},

		show: function show() {
			this.element.style.display = '';
			return this;
		},

		// interaction

		indicate: function indicate(cursor, tooltip) {
			if (cursor) this.element.style.cursor = cursor;
			if (tooltip) this.element.title = tooltip;
			return this;
		}

	});

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Class = __webpack_require__(45);
	var Dummy = __webpack_require__(50);
	var Native = __webpack_require__(51);

	module.exports = Class(Dummy, Native, {

		dummy_inject: Dummy.prototype.inject,
		dummy_injectBefore: Dummy.prototype.injectBefore,
		dummy_eject: Dummy.prototype.eject,
		native_inject: Native.prototype.inject,
		native_injectBefore: Native.prototype.injectBefore,
		native_eject: Native.prototype.eject,

		inject: function inject(container) {
			this.dummy_inject(container);
			this.native_inject(container);
			return this;
		},

		injectBefore: function injectBefore(sibling) {
			this.dummy_injectBefore(sibling);
			this.native_injectBefore(sibling);
			return this;
		},

		eject: function eject() {
			this.dummy_eject();
			this.native_eject();
			return this;
		}

	});

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Class = __webpack_require__(45);

	module.exports = Class({

		// placement

		_resetPlacement: function _resetPlacement() {
			var container = this.parentNode;
			if (container) {
				var previous = this.previousSibling,
				    next = this.nextSibling;
				if (previous) {
					previous.nextSibling = next;
				} else {
					container.firstChild = next;
				}
				if (next) {
					next.previousSibling = previous;
				} else {
					container.lastChild = this.previousSibling;
				}
			}
			this.previousSibling = null;
			this.nextSibling = null;
			this.parentNode = null;
			return this;
		},

		inject: function inject(container) {
			this._resetPlacement();
			var last = container.lastChild;
			if (last) {
				last.nextSibling = this;
				this.previousSibling = last;
			} else {
				container.firstChild = this;
			}
			container.lastChild = this;
			this.parentNode = container;
			this._place();
			return this;
		},

		injectBefore: function injectBefore(sibling) {
			this._resetPlacement();
			var container = sibling.parentNode;
			if (!container) return this;
			var previous = sibling.previousSibling;
			if (previous) {
				previous.nextSibling = this;
				this.previousSibling = previous;
			} else {
				container.firstChild = this;
			}
			sibling.previousSibling = this;
			this.nextSibling = sibling;
			this.parentNode = container;
			this._place();
			return this;
		},

		eject: function eject() {
			this._resetPlacement();
			this._place();
			return this;
		},

		_place: function _place() {},

		// events

		dispatch: function dispatch(event) {
			var events = this._events,
			    listeners = events && events[event.type];
			if (listeners) {
				listeners = listeners.slice(0);
				for (var i = 0, l = listeners.length; i < l; i++) {
					var fn = listeners[i],
					    result;
					if (typeof fn == 'function') result = fn.call(this, event);else result = fn.handleEvent(event);
					if (result === false) event.preventDefault();
				}
			}
			if (this.parentNode && this.parentNode.dispatch) {
				this.parentNode.dispatch(event);
			}
		},

		subscribe: function subscribe(type, fn, bind) {
			if (typeof type != 'string') {
				// listen type / fn with object
				var subscriptions = [];
				for (var t in type) subscriptions.push(this.subscribe(t, type[t]));
				return function () {
					// unsubscribe
					for (var i = 0, l = subscriptions.length; i < l; i++) subscriptions[i]();
					return this;
				};
			} else {
				// listen to one
				var bound = typeof fn === 'function' ? fn.bind(bind || this) : fn,
				    events = this._events || (this._events = {}),
				    listeners = events[type] || (events[type] = []);
				listeners.push(bound);
				return function () {
					// unsubscribe
					for (var i = 0, l = listeners.length; i < l; i++) {
						if (listeners[i] === bound) {
							listeners.splice(i, 1);
							break;
						}
					}
				};
			}
		}

	});

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Class = __webpack_require__(45);

	function elementFrom(node) {
		if (node.toElement) return node.toElement();
		if (node.getDOMNode) return node.getDOMNode();
		if (node.getNode) return node.getNode();
		return node;
	}

	module.exports = Class({

		// conventions

		toElement: function toElement() {
			return this.element;
		},

		getDOMNode: function getDOMNode() {
			return this.toElement();
		},

		getNode: function getNode() {
			return this.toElement();
		},

		// placement

		inject: function inject(container) {
			(container.containerElement || elementFrom(container)).appendChild(this.element);
			return this;
		},

		injectBefore: function injectBefore(sibling) {
			var element = elementFrom(sibling);
			element.parentNode.insertBefore(this.element, element);
			return this;
		},

		eject: function eject() {
			var element = this.element,
			    parent = element.parentNode;
			if (parent) parent.removeChild(element); // TODO: VML Nodes are dead after being ejected
			return this;
		},

		// events

		subscribe: function subscribe(type, fn, bind) {
			if (typeof type != 'string') {
				// listen type / fn with object
				var subscriptions = [];
				for (var t in type) subscriptions.push(this.subscribe(t, type[t]));
				return function () {
					// unsubscribe
					for (var i = 0, l = subscriptions.length; i < l; i++) subscriptions[i]();
					return this;
				};
			} else {
				// listen to one
				if (!bind) bind = this;
				var bound;
				if (typeof fn === 'function') {
					bound = fn.bind ? fn.bind(bind) : function () {
						return fn.apply(bind, arguments);
					};
				} else {
					bound = fn;
				}
				var element = this.element;
				if (element.addEventListener) {
					element.addEventListener(type, bound, false);
					return function () {
						// unsubscribe
						element.removeEventListener(type, bound, false);
						return this;
					};
				} else {
					element.attachEvent('on' + type, bound);
					return function () {
						// unsubscribe
						element.detachEvent('on' + type, bound);
						return this;
					};
				}
			}
		}

	});

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var VMLCSS = 'behavior:url(#default#VML);display:inline-block;position:absolute;left:0px;top:0px;';

	var styleSheet,
	    styledTags = {},
	    styleTag = function styleTag(tag) {
		if (styleSheet) styledTags[tag] = styleSheet.addRule('av\\:' + tag, VMLCSS);
	};

	exports.init = function (document) {

		var namespaces;
		try {
			// IE9 workaround: sometimes it throws here
			namespaces = document.namespaces;
		} catch (e) {}
		if (!namespaces) return false;

		namespaces.add('av', 'urn:schemas-microsoft-com:vml');
		namespaces.add('ao', 'urn:schemas-microsoft-com:office:office');

		styleSheet = document.createStyleSheet();
		styleSheet.addRule('vml', 'display:inline-block;position:relative;overflow:hidden;');
		/*	styleTag('skew');
	 	styleTag('fill');
	 	styleTag('stroke');
	 	styleTag('path');
	 	styleTag('textpath');
	 	styleTag('group');*/

		styleTag('vml');

		return true;
	};

	exports.createElement = function (tag) {
		if (!(tag in styledTags)) styleTag(tag);
		return document.createElement('av:' + tag);
	};

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Class = __webpack_require__(45);
	var Container = __webpack_require__(47);
	var Element = __webpack_require__(51);
	var DOM = __webpack_require__(52);

	var precision = 100;

	var VMLSurface = Class(Element, Container, {

		initialize: function VMLSurface(width, height, existingElement) {
			this.element = existingElement || document.createElement('vml');
			this.containerElement = DOM.createElement('group');
			this.element.appendChild(this.containerElement);
			if (width != null && height != null) this.resize(width, height);
		},

		resize: function resize(width, height) {
			this.width = width;
			this.height = height;

			var style = this.element.style;
			style.pixelWidth = width;
			style.pixelHeight = height;

			style = this.containerElement.style;
			style.width = width;
			style.height = height;

			var halfPixel = 0.5 * precision;

			this.containerElement.coordorigin = halfPixel + ',' + halfPixel;
			this.containerElement.coordsize = width * precision + ',' + height * precision;

			return this;
		}

	});

	VMLSurface.tagName = 'av:vml';

	module.exports = VMLSurface;

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Class = __webpack_require__(45);
	var Path = __webpack_require__(55);

	var precision = 100;

	var round = Math.round;

	var VMLPath = Class(Path, {

		initialize: function initialize(path) {
			this.reset();
			if (path instanceof VMLPath) {
				this.path = [Array.prototype.join.call(path.path, ' ')];
			} else if (path) {
				if (path.applyToPath) path.applyToPath(this);else this.push(path);
			}
		},

		onReset: function onReset() {
			this.path = [];
		},

		onMove: function onMove(sx, sy, x, y) {
			this.path.push('m', round(x * precision), round(y * precision));
		},

		onLine: function onLine(sx, sy, x, y) {
			this.path.push('l', round(x * precision), round(y * precision));
		},

		onBezierCurve: function onBezierCurve(sx, sy, p1x, p1y, p2x, p2y, x, y) {
			this.path.push('c', round(p1x * precision), round(p1y * precision), round(p2x * precision), round(p2y * precision), round(x * precision), round(y * precision));
		},

		_arcToBezier: Path.prototype.onArc,

		onArc: function onArc(sx, sy, ex, ey, cx, cy, rx, ry, sa, ea, ccw, rotation) {
			if (rx != ry || rotation) return this._arcToBezier(sx, sy, ex, ey, cx, cy, rx, ry, sa, ea, ccw, rotation);
			cx *= precision;
			cy *= precision;
			rx *= precision;
			this.path.push(ccw ? 'at' : 'wa', round(cx - rx), round(cy - rx), round(cx + rx), round(cy + rx), round(sx * precision), round(sy * precision), round(ex * precision), round(ey * precision));
		},

		onClose: function onClose() {
			this.path.push('x');
		},

		toVML: function toVML() {
			return this.path.join(' ');
		}

	});

	VMLPath.prototype.toString = VMLPath.prototype.toVML;

	module.exports = VMLPath;

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Class = __webpack_require__(45);

	module.exports = Class({

		initialize: function initialize(path) {
			this.reset().push(path);
		},

		/* parser */

		push: function push() {
			var p = Array.prototype.join.call(arguments, ' ').match(/[a-df-z]|[\-+]?(?:[\d\.]e[\-+]?|[^\s\-+,a-z])+/ig);
			if (!p) return this;

			var last,
			    cmd = p[0],
			    i = 1;
			while (cmd) {
				switch (cmd) {
					case 'm':
						this.move(p[i++], p[i++]);break;
					case 'l':
						this.line(p[i++], p[i++]);break;
					case 'c':
						this.curve(p[i++], p[i++], p[i++], p[i++], p[i++], p[i++]);break;
					case 's':
						this.curve(p[i++], p[i++], null, null, p[i++], p[i++]);break;
					case 'q':
						this.curve(p[i++], p[i++], p[i++], p[i++]);break;
					case 't':
						this.curve(p[i++], p[i++]);break;
					case 'a':
						this.arc(p[i + 5], p[i + 6], p[i], p[i + 1], p[i + 3], ! +p[i + 4], p[i + 2]);i += 7;break;
					case 'h':
						this.line(p[i++], 0);break;
					case 'v':
						this.line(0, p[i++]);break;

					case 'M':
						this.moveTo(p[i++], p[i++]);break;
					case 'L':
						this.lineTo(p[i++], p[i++]);break;
					case 'C':
						this.curveTo(p[i++], p[i++], p[i++], p[i++], p[i++], p[i++]);break;
					case 'S':
						this.curveTo(p[i++], p[i++], null, null, p[i++], p[i++]);break;
					case 'Q':
						this.curveTo(p[i++], p[i++], p[i++], p[i++]);break;
					case 'T':
						this.curveTo(p[i++], p[i++]);break;
					case 'A':
						this.arcTo(p[i + 5], p[i + 6], p[i], p[i + 1], p[i + 3], ! +p[i + 4], p[i + 2]);i += 7;break;
					case 'H':
						this.lineTo(p[i++], this.penY);break;
					case 'V':
						this.lineTo(this.penX, p[i++]);break;

					case 'Z':case 'z':
						this.close();break;
					default:
						cmd = last;i--;continue;
				}

				last = cmd;
				if (last == 'm') last = 'l';else if (last == 'M') last = 'L';
				cmd = p[i++];
			}
			return this;
		},

		/* utility methods */

		reset: function reset() {
			this.penX = this.penY = 0;
			this.penDownX = this.penDownY = null;
			this._pivotX = this._pivotY = 0;
			this.onReset();
			return this;
		},

		move: function move(x, y) {
			this.onMove(this.penX, this.penY, this._pivotX = this.penX += +x, this._pivotY = this.penY += +y);
			return this;
		},
		moveTo: function moveTo(x, y) {
			this.onMove(this.penX, this.penY, this._pivotX = this.penX = +x, this._pivotY = this.penY = +y);
			return this;
		},

		line: function line(x, y) {
			return this.lineTo(this.penX + +x, this.penY + +y);
		},
		lineTo: function lineTo(x, y) {
			if (this.penDownX == null) {
				this.penDownX = this.penX;this.penDownY = this.penY;
			}
			this.onLine(this.penX, this.penY, this._pivotX = this.penX = +x, this._pivotY = this.penY = +y);
			return this;
		},

		curve: function curve(c1x, c1y, c2x, c2y, ex, ey) {
			var x = this.penX,
			    y = this.penY;
			return this.curveTo(x + +c1x, y + +c1y, c2x == null ? null : x + +c2x, c2y == null ? null : y + +c2y, ex == null ? null : x + +ex, ey == null ? null : y + +ey);
		},
		curveTo: function curveTo(c1x, c1y, c2x, c2y, ex, ey) {
			var x = this.penX,
			    y = this.penY;
			if (c2x == null) {
				c2x = +c1x;c2y = +c1y;
				c1x = x * 2 - (this._pivotX || 0);c1y = y * 2 - (this._pivotY || 0);
			}
			if (ex == null) {
				this._pivotX = +c1x;this._pivotY = +c1y;
				ex = +c2x;ey = +c2y;
				c2x = (ex + +c1x * 2) / 3;c2y = (ey + +c1y * 2) / 3;
				c1x = (x + +c1x * 2) / 3;c1y = (y + +c1y * 2) / 3;
			} else {
				this._pivotX = +c2x;this._pivotY = +c2y;
			}
			if (this.penDownX == null) {
				this.penDownX = x;this.penDownY = y;
			}
			this.onBezierCurve(x, y, +c1x, +c1y, +c2x, +c2y, this.penX = +ex, this.penY = +ey);
			return this;
		},

		arc: function arc(x, y, rx, ry, outer, counterClockwise, rotation) {
			return this.arcTo(this.penX + +x, this.penY + +y, rx, ry, outer, counterClockwise, rotation);
		},
		arcTo: function arcTo(x, y, rx, ry, outer, counterClockwise, rotation) {
			ry = Math.abs(+ry || +rx || +y - this.penY);
			rx = Math.abs(+rx || +x - this.penX);

			if (!rx || !ry || x == this.penX && y == this.penY) return this.lineTo(x, y);

			var tX = this.penX,
			    tY = this.penY,
			    clockwise = ! +counterClockwise,
			    large = !! +outer;

			var rad = rotation ? rotation * Math.PI / 180 : 0,
			    cos = Math.cos(rad),
			    sin = Math.sin(rad);
			x -= tX;y -= tY;

			// Ellipse Center
			var cx = cos * x / 2 + sin * y / 2,
			    cy = -sin * x / 2 + cos * y / 2,
			    rxry = rx * rx * ry * ry,
			    rycx = ry * ry * cx * cx,
			    rxcy = rx * rx * cy * cy,
			    a = rxry - rxcy - rycx;

			if (a < 0) {
				a = Math.sqrt(1 - a / rxry);
				rx *= a;ry *= a;
				cx = x / 2;cy = y / 2;
			} else {
				a = Math.sqrt(a / (rxcy + rycx));
				if (large == clockwise) a = -a;
				var cxd = -a * cy * rx / ry,
				    cyd = a * cx * ry / rx;
				cx = cos * cxd - sin * cyd + x / 2;
				cy = sin * cxd + cos * cyd + y / 2;
			}

			// Rotation + Scale Transform
			var xx = cos / rx,
			    yx = sin / rx,
			    xy = -sin / ry,
			    yy = cos / ry;

			// Start and End Angle
			var sa = Math.atan2(xy * -cx + yy * -cy, xx * -cx + yx * -cy),
			    ea = Math.atan2(xy * (x - cx) + yy * (y - cy), xx * (x - cx) + yx * (y - cy));

			cx += tX;cy += tY;
			x += tX;y += tY;

			// Circular Arc
			if (this.penDownX == null) {
				this.penDownX = this.penX;this.penDownY = this.penY;
			}
			this.onArc(tX, tY, this._pivotX = this.penX = x, this._pivotY = this.penY = y, cx, cy, rx, ry, sa, ea, !clockwise, rotation);
			return this;
		},

		counterArc: function counterArc(x, y, rx, ry, outer) {
			return this.arc(x, y, rx, ry, outer, true);
		},
		counterArcTo: function counterArcTo(x, y, rx, ry, outer) {
			return this.arcTo(x, y, rx, ry, outer, true);
		},

		close: function close() {
			if (this.penDownX != null) {
				this.onClose(this.penX, this.penY, this.penX = this.penDownX, this.penY = this.penDownY);
				this.penDownX = null;
			}
			return this;
		},

		/* overridable handlers */

		onReset: function onReset() {},

		onMove: function onMove(sx, sy, ex, ey) {},

		onLine: function onLine(sx, sy, ex, ey) {
			this.onBezierCurve(sx, sy, sx, sy, ex, ey, ex, ey);
		},

		onBezierCurve: function onBezierCurve(sx, sy, c1x, c1y, c2x, c2y, ex, ey) {
			var gx = ex - sx,
			    gy = ey - sy,
			    g = gx * gx + gy * gy,
			    v1,
			    v2,
			    cx,
			    cy,
			    u;

			cx = c1x - sx;cy = c1y - sy;
			u = cx * gx + cy * gy;

			if (u > g) {
				cx -= gx;
				cy -= gy;
			} else if (u > 0 && g != 0) {
				cx -= u / g * gx;
				cy -= u / g * gy;
			}

			v1 = cx * cx + cy * cy;

			cx = c2x - sx;cy = c2y - sy;
			u = cx * gx + cy * gy;

			if (u > g) {
				cx -= gx;
				cy -= gy;
			} else if (u > 0 && g != 0) {
				cx -= u / g * gx;
				cy -= u / g * gy;
			}

			v2 = cx * cx + cy * cy;

			if (v1 < 0.01 && v2 < 0.01) {
				this.onLine(sx, sy, ex, ey);
				return;
			}

			// Avoid infinite recursion
			if (isNaN(v1) || isNaN(v2)) {
				throw new Error('Bad input');
			}

			// Split curve
			var s1x = (c1x + c2x) * 0.5,
			    s1y = (c1y + c2y) * 0.5,
			    l1x = (c1x + sx) * 0.5,
			    l1y = (c1y + sy) * 0.5,
			    l2x = (l1x + s1x) * 0.5,
			    l2y = (l1y + s1y) * 0.5,
			    r2x = (ex + c2x) * 0.5,
			    r2y = (ey + c2y) * 0.5,
			    r1x = (r2x + s1x) * 0.5,
			    r1y = (r2y + s1y) * 0.5,
			    l2r1x = (l2x + r1x) * 0.5,
			    l2r1y = (l2y + r1y) * 0.5;

			// TODO: Manual stack if necessary. Currently recursive without tail optimization.
			this.onBezierCurve(sx, sy, l1x, l1y, l2x, l2y, l2r1x, l2r1y);
			this.onBezierCurve(l2r1x, l2r1y, r1x, r1y, r2x, r2y, ex, ey);
		},

		onArc: function onArc(sx, sy, ex, ey, cx, cy, rx, ry, sa, ea, ccw, rotation) {
			// Inverse Rotation + Scale Transform
			var rad = rotation ? rotation * Math.PI / 180 : 0,
			    cos = Math.cos(rad),
			    sin = Math.sin(rad),
			    xx = cos * rx,
			    yx = -sin * ry,
			    xy = sin * rx,
			    yy = cos * ry;

			// Bezier Curve Approximation
			var arc = ea - sa;
			if (arc < 0 && !ccw) arc += Math.PI * 2;else if (arc > 0 && ccw) arc -= Math.PI * 2;

			var n = Math.ceil(Math.abs(arc / (Math.PI / 2))),
			    step = arc / n,
			    k = 4 / 3 * Math.tan(step / 4);

			var x = Math.cos(sa),
			    y = Math.sin(sa);

			for (var i = 0; i < n; i++) {
				var cp1x = x - k * y,
				    cp1y = y + k * x;

				sa += step;
				x = Math.cos(sa);y = Math.sin(sa);

				var cp2x = x + k * y,
				    cp2y = y - k * x;

				this.onBezierCurve(sx, sy, cx + xx * cp1x + yx * cp1y, cy + xy * cp1x + yy * cp1y, cx + xx * cp2x + yx * cp2y, cy + xy * cp2x + yy * cp2y, sx = cx + xx * x + yx * y, sy = cy + xy * x + yy * y);
			}
		},

		onClose: function onClose(sx, sy, ex, ey) {
			this.onLine(sx, sy, ex, ey);
		}

	});

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Class = __webpack_require__(45);
	var Base = __webpack_require__(57);
	var Path = __webpack_require__(54);
	var DOM = __webpack_require__(52);

	var precision = 100;

	module.exports = Class(Base, {

		base_initialize: Base.prototype.initialize,

		initialize: function initialize(path, width, height) {
			this.base_initialize('shape');

			var p = this.pathElement = DOM.createElement('path');
			p.gradientshapeok = true;
			this.element.appendChild(p);

			this.width = width;
			this.height = height;

			if (path != null) this.draw(path);
		},

		// SVG to VML

		draw: function draw(path, width, height) {

			if (!(path instanceof Path)) path = new Path(path);
			this._vml = path.toVML();
			//this._size = path.measure();

			if (width != null) this.width = width;
			if (height != null) this.height = height;

			if (!this._boxCoords) this._transform();
			this._redraw(this._prefix, this._suffix);

			return this;
		},

		// radial gradient workaround

		_redraw: function _redraw(prefix, suffix) {
			var vml = this._vml || '';

			this._prefix = prefix;
			this._suffix = suffix;
			if (prefix) {
				vml = [prefix, vml, suffix,
				// Don't stroke the path with the extra ellipse, redraw the stroked path separately
				'ns e', vml, 'nf'].join(' ');
			}

			this.element.path = vml + 'e';
		},

		fillRadial: function fillRadial(stops, focusX, focusY, radiusX, radiusY, centerX, centerY) {
			var fill = this._createGradient('gradientradial', stops);
			if (focusX == null) focusX = (this.left || 0) + (this.width || 0) * 0.5;
			if (focusY == null) focusY = (this.top || 0) + (this.height || 0) * 0.5;
			if (radiusY == null) radiusY = radiusX || this.height * 0.5 || 0;
			if (radiusX == null) radiusX = (this.width || 0) * 0.5;
			if (centerX == null) centerX = focusX;
			if (centerY == null) centerY = focusY;

			centerX += centerX - focusX;
			centerY += centerY - focusY;

			var cx = Math.round(centerX * precision),
			    cy = Math.round(centerY * precision),
			    rx = Math.round(radiusX * 2 * precision),
			    ry = Math.round(radiusY * 2 * precision),
			    arc = ['wa', cx - rx, cy - ry, cx + rx, cy + ry].join(' ');

			this._redraw(
			// Resolve rendering bug
			['m', cx, cy - ry, 'l', cx, cy - ry].join(' '),
			// Draw an ellipse around the path to force an elliptical gradient on any shape
			['m', cx, cy - ry, arc, cx, cy - ry, cx, cy + ry, arc, cx, cy + ry, cx, cy - ry, arc, cx, cy - ry, cx, cy + ry, arc, cx, cy + ry, cx, cy - ry].join(' '));

			this._boxCoords = { left: focusX - 2, top: focusY - 2, width: 4, height: 4 };

			fill.focusposition = '0.5,0.5';
			fill.focussize = '0 0';
			fill.focus = '50%';

			this._transform();

			return this;
		}

	});

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Class = __webpack_require__(45);
	var Transform = __webpack_require__(46);
	var Color = __webpack_require__(58);
	var Node = __webpack_require__(48);
	var DOM = __webpack_require__(52);

	var precision = 100;

	var defaultBox = { left: 0, top: 0, width: 500, height: 500 };

	module.exports = Class(Node, {

		element_initialize: Node.prototype.initialize,

		initialize: function initialize(tag) {
			this.element_initialize(tag);
			var element = this.element;

			var skew = this.skewElement = DOM.createElement('skew');
			skew.on = true;
			element.appendChild(skew);

			var fill = this.fillElement = DOM.createElement('fill');
			fill.on = false;
			element.appendChild(fill);

			var stroke = this.strokeElement = DOM.createElement('stroke');
			stroke.on = false;
			element.appendChild(stroke);
		},

		/* transform */

		_transform: function _transform() {
			var container = this.parentNode;

			// Active Transformation Matrix
			var m = container ? new Transform(container._activeTransform).transform(this) : this;

			// Box in shape user space

			var box = this._boxCoords || this._size || defaultBox;

			var originX = box.left || 0,
			    originY = box.top || 0,
			    width = box.width || 1,
			    height = box.height || 1;

			// Flipped
			var flip = m.yx / m.xx > m.yy / m.xy;
			if (m.xx < 0 ? m.xy >= 0 : m.xy < 0) flip = !flip;
			flip = flip ? -1 : 1;

			m = new Transform().scale(flip, 1).transform(m);

			// Rotation is approximated based on the transform
			var rotation = Math.atan2(-m.xy, m.yy) * 180 / Math.PI;

			// Reverse the rotation, leaving the final transform in box space
			var rad = rotation * Math.PI / 180,
			    sin = Math.sin(rad),
			    cos = Math.cos(rad);

			var transform = new Transform(m.xx * cos - m.xy * sin, (m.yx * cos - m.yy * sin) * flip, (m.xy * cos + m.xx * sin) * flip, m.yy * cos + m.yx * sin);

			var rotationTransform = new Transform().rotate(rotation, 0, 0);

			var shapeToBox = new Transform().rotate(-rotation, 0, 0).transform(m).moveTo(0, 0);

			// Scale box after reversing rotation
			width *= Math.abs(shapeToBox.xx);
			height *= Math.abs(shapeToBox.yy);

			// Place box
			var left = m.x,
			    top = m.y;

			// Compensate for offset by center origin rotation
			var vx = -width / 2,
			    vy = -height / 2;
			var point = rotationTransform.point(vx, vy);
			left -= point.x - vx;
			top -= point.y - vy;

			// Adjust box position based on offset
			var rsm = new Transform(m).moveTo(0, 0);
			point = rsm.point(originX, originY);
			left += point.x;
			top += point.y;

			if (flip < 0) left = -left - width;

			// Place transformation origin
			var point0 = rsm.point(-originX, -originY);
			var point1 = rotationTransform.point(width, height);
			var point2 = rotationTransform.point(width, 0);
			var point3 = rotationTransform.point(0, height);

			var minX = Math.min(0, point1.x, point2.x, point3.x),
			    maxX = Math.max(0, point1.x, point2.x, point3.x),
			    minY = Math.min(0, point1.y, point2.y, point3.y),
			    maxY = Math.max(0, point1.y, point2.y, point3.y);

			var transformOriginX = (point0.x - point1.x / 2) / (maxX - minX) * flip,
			    transformOriginY = (point0.y - point1.y / 2) / (maxY - minY);

			// Adjust the origin
			point = shapeToBox.point(originX, originY);
			originX = point.x;
			originY = point.y;

			// Scale stroke
			var strokeWidth = this._strokeWidth;
			if (strokeWidth) {
				// Scale is the hypothenus between the two vectors
				// TODO: Use area calculation instead
				var vx = m.xx + m.xy,
				    vy = m.yy + m.yx;
				strokeWidth *= Math.sqrt(vx * vx + vy * vy) / Math.sqrt(2);
			}

			// convert to multiplied precision space
			originX *= precision;
			originY *= precision;
			left *= precision;
			top *= precision;
			width *= precision;
			height *= precision;

			// Set box
			var element = this.element;
			element.coordorigin = originX + ',' + originY;
			element.coordsize = width + ',' + height;
			element.style.left = left + 'px';
			element.style.top = top + 'px';
			element.style.width = width;
			element.style.height = height;
			element.style.rotation = rotation.toFixed(8);
			element.style.flip = flip < 0 ? 'x' : '';

			// Set transform
			var skew = this.skewElement;
			skew.matrix = [transform.xx.toFixed(4), transform.xy.toFixed(4), transform.yx.toFixed(4), transform.yy.toFixed(4), 0, 0];
			skew.origin = transformOriginX + ',' + transformOriginY;

			// Set stroke
			this.strokeElement.weight = strokeWidth + 'px';
		},

		/* styles */

		_createGradient: function _createGradient(style, stops) {
			var fill = this.fillElement;

			// Temporarily eject the fill from the DOM
			this.element.removeChild(fill);

			fill.type = style;
			fill.method = 'none';
			fill.rotate = true;

			var colors = [],
			    color1,
			    color2;

			var addColor = function addColor(offset, color) {
				color = Color.detach(color);
				if (color1 == null) color1 = color2 = color;else color2 = color;
				colors.push(offset + ' ' + color[0]);
			};

			// Enumerate stops, assumes offsets are enumerated in order
			if ('length' in stops) for (var i = 0, l = stops.length - 1; i <= l; i++) addColor(i / l, stops[i]);else for (var offset in stops) addColor(offset, stops[offset]);

			fill.color = color1[0];
			fill.color2 = color2[0];

			//if (fill.colors) fill.colors.value = colors; else
			fill.colors = colors;

			// Opacity order gets flipped when color stops are specified
			fill.opacity = color2[1];
			fill['ao:opacity2'] = color1[1];

			fill.on = true;
			this.element.appendChild(fill);
			return fill;
		},

		_setColor: function _setColor(type, color) {
			var element = type == 'fill' ? this.fillElement : this.strokeElement;
			if (color == null) {
				element.on = false;
			} else {
				color = Color.detach(color);
				element.color = color[0];
				element.opacity = color[1];
				element.on = true;
			}
		},

		fill: function fill(color) {
			if (arguments.length > 1) {
				this.fillLinear(arguments);
			} else {
				this._boxCoords = defaultBox;
				var fill = this.fillElement;
				fill.type = 'solid';
				fill.color2 = '';
				fill['ao:opacity2'] = '';
				if (fill.colors) fill.colors.value = '';
				this._setColor('fill', color);
			}
			return this;
		},

		fillRadial: function fillRadial(stops, focusX, focusY, radiusX, radiusY, centerX, centerY) {
			var fill = this._createGradient('gradientradial', stops);
			if (focusX == null) focusX = this.left + this.width * 0.5;
			if (focusY == null) focusY = this.top + this.height * 0.5;
			if (radiusY == null) radiusY = radiusX || this.height * 0.5;
			if (radiusX == null) radiusX = this.width * 0.5;
			if (centerX == null) centerX = focusX;
			if (centerY == null) centerY = focusY;

			centerX += centerX - focusX;
			centerY += centerY - focusY;

			var box = this._boxCoords = {
				left: centerX - radiusX * 2,
				top: centerY - radiusY * 2,
				width: radiusX * 4,
				height: radiusY * 4
			};
			focusX -= box.left;
			focusY -= box.top;
			focusX /= box.width;
			focusY /= box.height;

			fill.focussize = '0 0';
			fill.focusposition = focusX + ',' + focusY;
			fill.focus = '50%';

			this._transform();

			return this;
		},

		fillLinear: function fillLinear(stops, x1, y1, x2, y2) {
			var fill = this._createGradient('gradient', stops);
			fill.focus = '100%';
			if (arguments.length == 5) {
				var w = Math.abs(x2 - x1),
				    h = Math.abs(y2 - y1);
				this._boxCoords = {
					left: Math.min(x1, x2),
					top: Math.min(y1, y2),
					width: w < 1 ? h : w,
					height: h < 1 ? w : h
				};
				fill.angle = (360 + Math.atan2((x2 - x1) / h, (y2 - y1) / w) * 180 / Math.PI) % 360;
			} else {
				this._boxCoords = null;
				fill.angle = x1 == null ? 0 : (90 + x1) % 360;
			}
			this._transform();
			return this;
		},

		fillImage: function fillImage(url, width, height, left, top, color1, color2) {
			var fill = this.fillElement;
			if (color1 != null) {
				color1 = Color.detach(color1);
				if (color2 != null) color2 = Color.detach(color2);
				fill.type = 'pattern';
				fill.color = color1[0];
				fill.color2 = color2 == null ? color1[0] : color2[0];
				fill.opacity = color2 == null ? 0 : color2[1];
				fill['ao:opacity2'] = color1[1];
			} else {
				fill.type = 'tile';
				fill.color = '';
				fill.color2 = '';
				fill.opacity = 1;
				fill['ao:opacity2'] = 1;
			}
			if (fill.colors) fill.colors.value = '';
			fill.rotate = true;
			fill.src = url;

			fill.size = '1,1';
			fill.position = '0,0';
			fill.origin = '0,0';
			fill.aspect = 'ignore'; // ignore, atleast, atmost
			fill.on = true;

			if (!left) left = 0;
			if (!top) top = 0;
			this._boxCoords = width ? { left: left + 0.5, top: top + 0.5, width: width, height: height } : null;
			this._transform();
			return this;
		},

		/* stroke */

		stroke: function stroke(color, width, cap, join) {
			var stroke = this.strokeElement;
			this._strokeWidth = width != null ? width : 1;
			stroke.weight = width != null ? width + 'px' : 1;
			stroke.endcap = cap != null ? cap == 'butt' ? 'flat' : cap : 'round';
			stroke.joinstyle = join != null ? join : 'round';

			this._setColor('stroke', color);
			return this;
		}

	});

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var colors = {
		maroon: '#800000', red: '#ff0000', orange: '#ffA500', yellow: '#ffff00', olive: '#808000',
		purple: '#800080', fuchsia: '#ff00ff', white: '#ffffff', lime: '#00ff00', green: '#008000',
		navy: '#000080', blue: '#0000ff', aqua: '#00ffff', teal: '#008080',
		black: '#000000', silver: '#c0c0c0', gray: '#808080'
	};

	var map = function map(array, fn) {
		var results = [];
		for (var i = 0, l = array.length; i < l; i++) results[i] = fn(array[i], i);
		return results;
	};

	var Color = function Color(color, type) {

		if (color.isColor) {

			this.red = color.red;
			this.green = color.green;
			this.blue = color.blue;
			this.alpha = color.alpha;
		} else {

			var namedColor = colors[color];
			if (namedColor) {
				color = namedColor;
				type = 'hex';
			}

			switch (typeof color) {
				case 'string':
					if (!type) type = (type = color.match(/^rgb|^hsb|^hsl/)) ? type[0] : 'hex';break;
				case 'object':
					type = type || 'rgb';color = color.toString();break;
				case 'number':
					type = 'hex';color = color.toString(16);break;
			}

			color = Color['parse' + type.toUpperCase()](color);
			this.red = color[0];
			this.green = color[1];
			this.blue = color[2];
			this.alpha = color[3];
		}

		this.isColor = true;
	};

	var limit = function limit(number, min, max) {
		return Math.min(max, Math.max(min, number));
	};

	var listMatch = /([-.\d]+\%?)\s*,\s*([-.\d]+\%?)\s*,\s*([-.\d]+\%?)\s*,?\s*([-.\d]*\%?)/;
	var hexMatch = /^#?([a-f0-9]{1,2})([a-f0-9]{1,2})([a-f0-9]{1,2})([a-f0-9]{0,2})$/i;

	Color.parseRGB = function (color) {
		return map(color.match(listMatch).slice(1), function (bit, i) {
			if (bit) bit = parseFloat(bit) * (bit[bit.length - 1] == '%' ? 2.55 : 1);
			return i < 3 ? Math.round((bit %= 256) < 0 ? bit + 256 : bit) : limit(bit === '' ? 1 : Number(bit), 0, 1);
		});
	};

	Color.parseHEX = function (color) {
		if (color.length == 1) color = color + color + color;
		return map(color.match(hexMatch).slice(1), function (bit, i) {
			if (i == 3) return bit ? parseInt(bit, 16) / 255 : 1;
			return parseInt(bit.length == 1 ? bit + bit : bit, 16);
		});
	};

	Color.parseHSB = function (color) {
		var hsb = map(color.match(listMatch).slice(1), function (bit, i) {
			if (bit) bit = parseFloat(bit);
			if (i === 0) return Math.round((bit %= 360) < 0 ? bit + 360 : bit);else if (i < 3) return limit(Math.round(bit), 0, 100);else return limit(bit === '' ? 1 : Number(bit), 0, 1);
		});

		var a = hsb[3];
		var br = Math.round(hsb[2] / 100 * 255);
		if (hsb[1] == 0) return [br, br, br, a];

		var hue = hsb[0];
		var f = hue % 60;
		var p = Math.round(hsb[2] * (100 - hsb[1]) / 10000 * 255);
		var q = Math.round(hsb[2] * (6000 - hsb[1] * f) / 600000 * 255);
		var t = Math.round(hsb[2] * (6000 - hsb[1] * (60 - f)) / 600000 * 255);

		switch (Math.floor(hue / 60)) {
			case 0:
				return [br, t, p, a];
			case 1:
				return [q, br, p, a];
			case 2:
				return [p, br, t, a];
			case 3:
				return [p, q, br, a];
			case 4:
				return [t, p, br, a];
			default:
				return [br, p, q, a];
		}
	};

	Color.parseHSL = function (color) {
		var hsb = map(color.match(listMatch).slice(1), function (bit, i) {
			if (bit) bit = parseFloat(bit);
			if (i === 0) return Math.round((bit %= 360) < 0 ? bit + 360 : bit);else if (i < 3) return limit(Math.round(bit), 0, 100);else return limit(bit === '' ? 1 : Number(bit), 0, 1);
		});

		var h = hsb[0] / 60;
		var s = hsb[1] / 100;
		var l = hsb[2] / 100;
		var a = hsb[3];

		var c = (1 - Math.abs(2 * l - 1)) * s;
		var x = c * (1 - Math.abs(h % 2 - 1));
		var m = l - c / 2;

		var p = Math.round((c + m) * 255);
		var q = Math.round((x + m) * 255);
		var t = Math.round(m * 255);

		switch (Math.floor(h)) {
			case 0:
				return [p, q, t, a];
			case 1:
				return [q, p, t, a];
			case 2:
				return [t, p, q, a];
			case 3:
				return [t, q, p, a];
			case 4:
				return [q, t, p, a];
			default:
				return [p, t, q, a];
		}
	};

	var toString = function toString(type, array) {
		if (array[3] != 1) type += 'a';else array.pop();
		return type + '(' + array.join(', ') + ')';
	};

	Color.prototype = {

		toHSB: function toHSB(array) {
			var red = this.red,
			    green = this.green,
			    blue = this.blue,
			    alpha = this.alpha;

			var max = Math.max(red, green, blue),
			    min = Math.min(red, green, blue),
			    delta = max - min;
			var hue = 0,
			    saturation = delta != 0 ? delta / max : 0,
			    brightness = max / 255;
			if (saturation) {
				var rr = (max - red) / delta,
				    gr = (max - green) / delta,
				    br = (max - blue) / delta;
				hue = red == max ? br - gr : green == max ? 2 + rr - br : 4 + gr - rr;
				if ((hue /= 6) < 0) hue++;
			}

			var hsb = [Math.round(hue * 360), Math.round(saturation * 100), Math.round(brightness * 100), alpha];

			return array ? hsb : toString('hsb', hsb);
		},

		toHSL: function toHSL(array) {
			var red = this.red,
			    green = this.green,
			    blue = this.blue,
			    alpha = this.alpha;

			var max = Math.max(red, green, blue),
			    min = Math.min(red, green, blue),
			    delta = max - min;
			var hue = 0,
			    saturation = delta != 0 ? delta / (255 - Math.abs(max + min - 255)) : 0,
			    lightness = (max + min) / 512;
			if (saturation) {
				var rr = (max - red) / delta,
				    gr = (max - green) / delta,
				    br = (max - blue) / delta;
				hue = red == max ? br - gr : green == max ? 2 + rr - br : 4 + gr - rr;
				if ((hue /= 6) < 0) hue++;
			}

			var hsl = [Math.round(hue * 360), Math.round(saturation * 100), Math.round(lightness * 100), alpha];

			return array ? hsl : toString('hsl', hsl);
		},

		toHEX: function toHEX(array) {

			var a = this.alpha;
			var alpha = (a = Math.round(a * 255).toString(16)).length == 1 ? a + a : a;

			var hex = map([this.red, this.green, this.blue], function (bit) {
				bit = bit.toString(16);
				return bit.length == 1 ? '0' + bit : bit;
			});

			return array ? hex.concat(alpha) : '#' + hex.join('') + (alpha == 'ff' ? '' : alpha);
		},

		toRGB: function toRGB(array) {
			var rgb = [this.red, this.green, this.blue, this.alpha];
			return array ? rgb : toString('rgb', rgb);
		}

	};

	Color.prototype.toString = Color.prototype.toRGB;

	Color.hex = function (hex) {
		return new Color(hex, 'hex');
	};

	if (undefined.hex == null) undefined.hex = Color.hex;

	Color.hsb = function (h, s, b, a) {
		return new Color([h || 0, s || 0, b || 0, a == null ? 1 : a], 'hsb');
	};

	if (undefined.hsb == null) undefined.hsb = Color.hsb;

	Color.hsl = function (h, s, l, a) {
		return new Color([h || 0, s || 0, l || 0, a == null ? 1 : a], 'hsl');
	};

	if (undefined.hsl == null) undefined.hsl = Color.hsl;

	Color.rgb = function (r, g, b, a) {
		return new Color([r || 0, g || 0, b || 0, a == null ? 1 : a], 'rgb');
	};

	if (undefined.rgb == null) undefined.rgb = Color.rgb;

	Color.detach = function (color) {
		color = new Color(color);
		return [Color.rgb(color.red, color.green, color.blue).toString(), color.alpha];
	};

	module.exports = Color;

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Class = __webpack_require__(45);
	var Transform = __webpack_require__(46);
	var Container = __webpack_require__(47);
	var Node = __webpack_require__(48);

	module.exports = Class(Node, Container, {

		element_initialize: Node.prototype.initialize,

		initialize: function initialize(width, height) {
			this.element_initialize('group');
			this.width = width;
			this.height = height;
		},

		_transform: function _transform() {
			var element = this.element;
			element.coordorigin = '0,0';
			element.coordsize = '1000,1000';
			element.style.left = 0;
			element.style.top = 0;
			element.style.width = 1000;
			element.style.height = 1000;
			element.style.rotation = 0;

			var container = this.parentNode;
			this._activeTransform = container ? new Transform(container._activeTransform).transform(this) : this;
			var node = this.firstChild;
			while (node) {
				node._transform();
				node = node.nextSibling;
			}
		}

	});

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Class = __webpack_require__(45);
	var Base = __webpack_require__(57);
	var Path = __webpack_require__(54);
	var Surface = __webpack_require__(53);
	var Group = __webpack_require__(59);
	var DOM = __webpack_require__(52);

	var fontAnchors = { start: 'left', middle: 'center', end: 'right' };

	module.exports = Class(Base, {

		base_initialize: Base.prototype.initialize,

		initialize: function initialize(text, font, alignment, path) {
			this.base_initialize('shape');

			var p = this.pathElement = DOM.createElement('path');
			p.textpathok = true;
			this.element.appendChild(p);

			p = this.textPathElement = DOM.createElement('textpath');
			p.on = true;
			p.style['v-text-align'] = 'left';
			this.element.appendChild(p);

			this.draw.apply(this, arguments);
		},

		draw: function draw(text, font, alignment, path) {
			var element = this.element,
			    textPath = this.textPathElement,
			    style = textPath.style;

			textPath.string = text;

			if (font) {
				if (typeof font == 'string') {
					style.font = font;
				} else {
					for (var key in font) {
						var ckey = key.camelCase ? key.camelCase() : key;
						if (ckey == 'fontFamily') style[ckey] = '\'' + font[key] + '\'';
						// NOT UNIVERSALLY SUPPORTED OPTIONS
						// else if (ckey == 'kerning') style['v-text-kern'] = !!font[key];
						// else if (ckey == 'rotateGlyphs') style['v-rotate-letters'] = !!font[key];
						// else if (ckey == 'letterSpacing') style['v-text-spacing'] = Number(font[key]) + '';
						else style[ckey] = font[key];
					}
				}
			}

			if (alignment) style['v-text-align'] = fontAnchors[alignment] || alignment;

			if (path) {
				this.currentPath = path = new Path(path);
				this.element.path = path.toVML();
			} else if (!this.currentPath) {
				var i = -1,
				    offsetRows = '\n';
				while ((i = text.indexOf('\n', i + 1)) > -1) offsetRows += '\n';
				textPath.string = offsetRows + textPath.string;
				this.element.path = 'm0,0l1,0';
			}

			// Measuring the bounding box is currently necessary for gradients etc.

			// Clone element because the element is dead once it has been in the DOM
			element = element.cloneNode(true);
			style = element.style;

			// Reset coordinates while measuring
			element.coordorigin = '0,0';
			element.coordsize = '10000,10000';
			style.left = '0px';
			style.top = '0px';
			style.width = '10000px';
			style.height = '10000px';
			style.rotation = 0;
			element.removeChild(element.firstChild); // Remove skew

			// Inject the clone into the document

			var canvas = new Surface(1, 1),
			    group = new Group(),
			    // Wrapping it in a group seems to alleviate some client rect weirdness
			body = element.ownerDocument.body;

			canvas.inject(body);
			group.element.appendChild(element);
			group.inject(canvas);

			var ebb = element.getBoundingClientRect(),
			    cbb = canvas.toElement().getBoundingClientRect();

			canvas.eject();

			this.left = ebb.left - cbb.left;
			this.top = ebb.top - cbb.top;
			this.width = ebb.right - ebb.left;
			this.height = ebb.bottom - ebb.top;
			this.right = ebb.right - cbb.left;
			this.bottom = ebb.bottom - cbb.top;

			this._transform();

			//this._size = { left: this.left, top: this.top, width: this.width, height: this.height};
			return this;
		}

	});

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function warning() {
		throw new Error('You must require a mode before requiring anything else.');
	}

	exports.Surface = warning;
	exports.Path = warning;
	exports.Shape = warning;
	exports.Group = warning;
	exports.ClippingRectangle = warning;
	exports.Text = warning;

	exports.setCurrent = function (mode) {
		for (var key in mode) {
			exports[key] = mode[key];
		}
	};

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.Surface = __webpack_require__(65);
	exports.Path = __webpack_require__(66);
	exports.Shape = __webpack_require__(67);
	exports.Group = __webpack_require__(63);
	exports.ClippingRectangle = __webpack_require__(69);
	exports.Text = __webpack_require__(70);

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Class = __webpack_require__(45);
	var Container = __webpack_require__(47);
	var Node = __webpack_require__(64);

	module.exports = Class(Node, Container, {

		initialize: function initialize(width, height) {
			this.width = width;
			this.height = height;
		},

		localHitTest: function localHitTest(x, y) {
			var node = this.lastChild;
			while (node) {
				var hit = node.hitTest(x, y);
				if (hit) return hit;
				node = node.previousSibling;
			}
			return null;
		},

		renderLayerTo: function renderLayerTo(context, xx, yx, xy, yy, x, y) {
			if (this._invisible) return;

			x = xx * this.x + xy * this.y + x;
			y = yx * this.x + yy * this.y + y;

			var t = xx;
			xx = t * this.xx + xy * this.yx;
			xy = t * this.xy + xy * this.yy;
			t = yx;
			yx = t * this.xx + yy * this.yx;
			yy = t * this.xy + yy * this.yy;

			var node = this.firstChild;
			while (node) {
				node.renderTo(context, xx, yx, xy, yy, x, y);
				node = node.nextSibling;
			}
		}

	});

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Class = __webpack_require__(45);
	var Transform = __webpack_require__(46);
	var Element = __webpack_require__(50);

	var CanvasNode = Class(Transform, Element, {

		invalidate: function invalidate() {
			if (this.parentNode) this.parentNode.invalidate();
			if (this._layer) this._layerCache = null;
			return this;
		},

		_place: function _place() {
			this.invalidate();
		},

		_transform: function _transform() {
			this.invalidate();
		},

		blend: function blend(opacity) {
			if (opacity >= 1 && this._layer) this._layer = null;
			this._opacity = opacity;
			if (this.parentNode) this.parentNode.invalidate();
			return this;
		},

		// visibility

		hide: function hide() {
			this._invisible = true;
			if (this.parentNode) this.parentNode.invalidate();
			return this;
		},

		show: function show() {
			this._invisible = false;
			if (this.parentNode) this.parentNode.invalidate();
			return this;
		},

		// interaction

		indicate: function indicate(cursor, tooltip) {
			this._cursor = cursor;
			this._tooltip = tooltip;
			return this.invalidate();
		},

		hitTest: function hitTest(x, y) {
			if (this._invisible) return null;
			var point = this.inversePoint(x, y);
			if (!point) return null;
			return this.localHitTest(point.x, point.y);
		},

		// rendering

		renderTo: function renderTo(context, xx, yx, xy, yy, x, y) {
			var opacity = this._opacity;
			if (opacity == null || opacity >= 1) {
				return this.renderLayerTo(context, xx, yx, xy, yy, x, y);
			}

			// Render to a compositing layer and cache it

			var layer = this._layer,
			    canvas,
			    isDirty = true,
			    w = context.canvas.width,
			    h = context.canvas.height;
			if (layer) {
				layer.setTransform(1, 0, 0, 1, 0, 0);
				canvas = layer.canvas;
				if (canvas.width < w || canvas.height < h) {
					canvas.width = w;
					canvas.height = h;
				} else {
					var c = this._layerCache;
					if (c && c.xx === xx && c.yx === yx && c.xy === xy && c.yy === yy && c.x === x && c.y === y) {
						isDirty = false;
					} else {
						layer.clearRect(0, 0, w, h);
					}
				}
			} else {
				canvas = document.createElement('canvas');
				canvas.width = w;
				canvas.height = h;
				this._layer = layer = canvas.getContext('2d');
			}

			if (isDirty) {
				this.renderLayerTo(layer, xx, yx, xy, yy, x, y);
				this._layerCache = {
					xx: xx,
					yx: yx,
					xy: xy,
					yy: yy,
					x: x,
					y: y
				};
			}

			context.globalAlpha = opacity;
			context.setTransform(1, 0, 0, 1, 0, 0);
			context.drawImage(canvas, 0, 0, w, h, 0, 0, w, h);
			context.globalAlpha = 1;
		}

	});

	module.exports = CanvasNode;

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Class = __webpack_require__(45);
	var Container = __webpack_require__(47);
	var Element = __webpack_require__(51);

	var fps = 1000 / 60,
	    invalids = [],
	    renderTimer,
	    renderInvalids = function renderInvalids() {
		clearTimeout(renderTimer);
		renderTimer = null;
		var canvases = invalids;
		invalids = [];
		for (var i = 0, l = canvases.length; i < l; i++) {
			var c = canvases[i];
			c._valid = true;
			c.render();
		}
	};

	var resolution = typeof window !== 'undefined' && window.devicePixelRatio || 1;

	var previousHit = null,
	    previousHitSurface = null;

	var CanvasSurface = Class(Element, Container, {

		initialize: function initialize(width, height, existingElement) {
			var element = this.element = existingElement || document.createElement('canvas');
			var context = this.context = element.getContext('2d');
			this._valid = true;
			if (width != null && height != null) this.resize(width, height);

			element.addEventListener('mousemove', this, false);
			element.addEventListener('mouseout', this, false);
			element.addEventListener('mouseover', this, false);
			element.addEventListener('mouseup', this, false);
			element.addEventListener('mousedown', this, false);
			element.addEventListener('click', this, false);
		},

		handleEvent: function handleEvent(event) {
			if (event.clientX == null) return;
			var element = this.element,
			    rect = element.getBoundingClientRect(),
			    x = event.clientX - rect.left - element.clientLeft,
			    y = event.clientY - rect.top - element.clientTop,
			    hit = this.hitTest(x, y);

			if (hit !== previousHit) {
				if (previousHit) {
					previousHit.dispatch({
						type: 'mouseout',
						target: previousHit,
						relatedTarget: hit,
						sourceEvent: event
					});
				}
				if (hit) {
					hit.dispatch({
						type: 'mouseover',
						target: hit,
						relatedTarget: previousHit,
						sourceEvent: event
					});
				}
				previousHit = hit;
				previousHitSurface = this;
				this.refreshCursor();
			}

			if (hit) hit.dispatch(event);
		},

		refreshCursor: function refreshCursor() {
			if (previousHitSurface !== this) return;
			var hit = previousHit,
			    hitCursor = '',
			    hitTooltip = '';
			while (hit) {
				if (!hitCursor && hit._cursor) {
					hitCursor = hit._cursor;
					if (hitTooltip) break;
				}
				if (!hitTooltip && hit._tooltip) {
					hitTooltip = hit._tooltip;
					if (hitCursor) break;
				}
				hit = hit.parentNode;
			}
			// TODO: No way to set cursor/title on the surface
			this.element.style.cursor = hitCursor;
			this.element.title = hitTooltip;
		},

		resize: function resize(width, height) {
			var element = this.element;
			element.setAttribute('width', width * resolution);
			element.setAttribute('height', height * resolution);
			element.style.width = width + 'px';
			element.style.height = height + 'px';
			this.width = width;
			this.height = height;
			return this;
		},

		invalidate: function invalidate(left, top, width, height) {
			if (this._valid) {
				this._valid = false;
				invalids.push(this);
				if (!renderTimer) {
					if (window.mozRequestAnimationFrame) {
						renderTimer = true;
						window.mozRequestAnimationFrame(renderInvalids);
					} else {
						renderTimer = setTimeout(renderInvalids, fps);
					}
				}
			}
			return this;
		},

		hitTest: function hitTest(x, y) {
			if (x < 0 || y < 0 || x > this.width || y > this.height) return null;
			var node = this.lastChild;
			while (node) {
				var hit = node.hitTest(x, y);
				if (hit) return hit;
				node = node.previousSibling;
			}
			return null;
		},

		render: function render() {
			var node = this.firstChild,
			    context = this.context;
			context.setTransform(resolution, 0, 0, resolution, 0, 0);
			context.clearRect(0, 0, this.width, this.height);
			while (node) {
				node.renderTo(context, resolution, 0, 0, resolution, 0, 0);
				node = node.nextSibling;
			}
			this.refreshCursor();
		}

	});

	CanvasSurface.tagName = 'canvas';

	module.exports = CanvasSurface;

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Class = __webpack_require__(45);
	var Path = __webpack_require__(55);

	var CanvasPath = Class(Path, {

		initialize: function initialize(path) {
			this.reset();
			if (path instanceof CanvasPath) {
				this.path = path.path.slice(0);
			} else if (path) {
				if (path.applyToPath) path.applyToPath(this);else this.push(path);
			}
		},

		onReset: function onReset() {
			this.path = [];
		},

		onMove: function onMove(sx, sy, x, y) {
			this.path.push(function (context) {
				context.moveTo(x, y);
			});
		},

		onLine: function onLine(sx, sy, x, y) {
			this.path.push(function (context) {
				context.lineTo(x, y);
			});
		},

		onBezierCurve: function onBezierCurve(sx, sy, p1x, p1y, p2x, p2y, x, y) {
			this.path.push(function (context) {
				context.bezierCurveTo(p1x, p1y, p2x, p2y, x, y);
			});
		},

		_arcToBezier: Path.prototype.onArc,

		onArc: function onArc(sx, sy, ex, ey, cx, cy, rx, ry, sa, ea, ccw, rotation) {
			if (rx != ry || rotation) return this._arcToBezier(sx, sy, ex, ey, cx, cy, rx, ry, sa, ea, ccw, rotation);
			this.path.push(function (context) {
				context.arc(cx, cy, rx, sa, ea, ccw);
			});
		},

		onClose: function onClose() {
			this.path.push(function (context) {
				context.closePath();
			});
		},

		toCommands: function toCommands() {
			return this.path.slice(0);
		}

	});

	module.exports = CanvasPath;

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Class = __webpack_require__(45);
	var Base = __webpack_require__(68);
	var Path = __webpack_require__(66);

	module.exports = Class(Base, {

		base_initialize: Base.prototype.initialize,

		initialize: function initialize(path, width, height) {
			this.base_initialize();
			this.width = width;
			this.height = height;
			if (path != null) this.draw(path);
		},

		draw: function draw(path, width, height) {
			if (!(path instanceof Path)) path = new Path(path);
			this.path = path;
			this._commands = path.toCommands();
			if (width != null) this.width = width;
			if (height != null) this.height = height;
			return this.invalidate();
		},

		localHitTest: function localHitTest(x, y) {
			if (!this._fill) return null;
			if (this.width == null || this.height == null) {
				var context = Base._genericContext,
				    commands = this._commands;
				if (!commands) return null;
				context.beginPath();
				for (var i = 0, l = commands.length; i < l; i++) commands[i](context);
				return context.isPointInPath(x, y) ? this : null;
			}
			if (x > 0 && y > 0 && x < this.width && y < this.height) {
				return this;
			}
			return null;
		},

		renderShapeTo: function renderShapeTo(context) {
			if (this._invisible || !this._commands || !this._fill && !this._stroke) {
				return null;
			}
			context.transform(this.xx, this.yx, this.xy, this.yy, this.x, this.y);
			var commands = this._commands,
			    fill = this._fill,
			    stroke = this._stroke,
			    dash = this._strokeDash;

			context.beginPath();

			if (dash) {
				if (context.setLineDash) {
					context.setLineDash(dash);
				} else {
					// TODO: Remove when FF supports setLineDash.
					context.mozDash = dash;
				}
				// TODO: Create fallback to other browsers.
			} else {
				if (context.setLineDash) {
					context.setLineDash([]);
				} else {
					context.mozDash = null;
				}
			}

			for (var i = 0, l = commands.length; i < l; i++) commands[i](context);

			if (fill) {
				var m = this._fillTransform;
				if (m) {
					context.save(); // TODO: Optimize away this by restoring the transform before stroking
					context.transform(m.xx, m.yx, m.xy, m.yy, m.x, m.y);
					context.fillStyle = fill;
					context.fill();
					context.restore();
				} else {
					context.fillStyle = fill;
					context.fill();
				}
			}
			if (stroke) {
				context.strokeStyle = stroke;
				context.lineWidth = this._strokeWidth;
				context.lineCap = this._strokeCap;
				context.lineJoin = this._strokeJoin;
				context.stroke();
			}
		}

	});

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Class = __webpack_require__(45);
	var Color = __webpack_require__(58);
	var Transform = __webpack_require__(46);
	var Node = __webpack_require__(64);

	var genericCanvas = typeof document !== 'undefined' && document.createElement('canvas'),
	    genericContext = genericCanvas && genericCanvas.getContext && genericCanvas.getContext('2d');

	function recolorImage(img, color1, color2) {
		// TODO: Fix this experimental implementation
		color1 = Color.detach(color1);
		color2 = Color.detach(color2);
		var canvas = document.createElement('canvas'),
		    context = canvas.getContext('2d');
		canvas.width = img.width;
		canvas.height = img.height;
		context.fillStyle = color2[0];
		context.fillRect(0, 0, img.width, img.height);
		context.globalCompositeOperation = 'lighter';
		context.drawImage(img, 0, 0);
		return canvas;
	}

	var Base = Class(Node, {

		initialize: function initialize() {
			this._fill = null;
			this._pendingFill = null;
			this._fillTransform = null;
			this._stroke = null;
			this._strokeCap = null;
			this._strokeDash = null;
			this._strokeJoin = null;
			this._strokeWidth = null;
		},

		/* styles */

		_addColors: function _addColors(gradient, stops) {
			// Enumerate stops, assumes offsets are enumerated in order
			// TODO: Sort. Chrome doesn't always enumerate in expected order but requires stops to be specified in order.
			if ('length' in stops) for (var i = 0, l = stops.length - 1; i <= l; i++) gradient.addColorStop(i / l, new Color(stops[i]).toString());else for (var offset in stops) gradient.addColorStop(offset, new Color(stops[offset]).toString());
			return gradient;
		},

		fill: function fill(color) {
			if (arguments.length > 1) return this.fillLinear(arguments);
			if (this._pendingFill) this._pendingFill();
			this._fill = color ? new Color(color).toString() : null;
			return this.invalidate();
		},

		fillRadial: function fillRadial(stops, focusX, focusY, radiusX, radiusY, centerX, centerY) {
			if (focusX == null) focusX = (this.left || 0) + (this.width || 0) * 0.5;
			if (focusY == null) focusY = (this.top || 0) + (this.height || 0) * 0.5;
			if (radiusY == null) radiusY = radiusX || this.height * 0.5 || 0;
			if (radiusX == null) radiusX = (this.width || 0) * 0.5;
			if (centerX == null) centerX = focusX;
			if (centerY == null) centerY = focusY;

			centerX += centerX - focusX;
			centerY += centerY - focusY;

			if (radiusX === 0 || radiusX === '0') return this.fillLinear(stops);
			var ys = radiusY / radiusX;

			if (this._pendingFill) this._pendingFill();

			var gradient = genericContext.createRadialGradient(focusX, focusY / ys, 0, centerX, centerY / ys, radiusX * 2);

			// Double fill radius to simulate repeating gradient
			if ('length' in stops) for (var i = 0, l = stops.length - 1; i <= l; i++) {
				gradient.addColorStop(i / l / 2, new Color(stops[i]).toString());
				gradient.addColorStop(1 - i / l / 2, new Color(stops[i]).toString());
			} else for (var offset in stops) {
				gradient.addColorStop(offset / 2, new Color(stops[offset]).toString());
				gradient.addColorStop(1 - offset / 2, new Color(stops[offset]).toString());
			}

			this._fill = gradient;
			this._fillTransform = new Transform(1, 0, 0, ys);
			return this.invalidate();
		},

		fillLinear: function fillLinear(stops, x1, y1, x2, y2) {
			if (arguments.length < 5) {
				var angle = (x1 == null ? 270 : x1) * Math.PI / 180;

				var x = Math.cos(angle),
				    y = -Math.sin(angle),
				    l = (Math.abs(x) + Math.abs(y)) / 2,
				    w = this.width || 1,
				    h = this.height || 1;

				x *= l;y *= l;

				x1 = 0.5 - x;
				x2 = 0.5 + x;
				y1 = 0.5 - y;
				y2 = 0.5 + y;
				this._fillTransform = new Transform(w, 0, 0, h);
			} else {
				this._fillTransform = null;
			}
			if (this._pendingFill) this._pendingFill();
			var gradient = genericContext.createLinearGradient(x1, y1, x2, y2);
			this._addColors(gradient, stops);
			this._fill = gradient;
			return this.invalidate();
		},

		fillImage: function fillImage(url, width, height, left, top, color1, color2) {
			if (this._pendingFill) this._pendingFill();
			var img = url;
			if (!(img instanceof Image)) {
				img = new Image();
				img.src = url;
			}
			if (img.width && img.height) {
				return this._fillImage(img, width, height, left || 0, top || 0, color1, color2);
			}

			// Not yet loaded
			this._fill = null;
			var self = this,
			    callback = function callback() {
				cancel();
				self._fillImage(img, width, height, left || 0, top || 0, color1, color2);
			},
			    cancel = function cancel() {
				img.removeEventListener('load', callback, false);
				self._pendingFill = null;
			};
			this._pendingFill = cancel;
			img.addEventListener('load', callback, false);
			return this;
		},

		_fillImage: function _fillImage(img, width, height, left, top, color1, color2) {
			var w = width ? width / img.width : 1,
			    h = height ? height / img.height : 1;
			if (color1 != null) img = recolorImage(img, color1, color2);
			this._fill = genericContext.createPattern(img, 'repeat');
			this._fillTransform = new Transform(w, 0, 0, h, left || 0, top || 0);
			return this.invalidate();
		},

		stroke: function stroke(color, width, cap, join, dash) {
			this._stroke = color ? new Color(color).toString() : null;
			this._strokeWidth = width != null ? width : 1;
			this._strokeCap = cap != null ? cap : 'round';
			this._strokeJoin = join != null ? join : 'round';
			this._strokeDash = dash;
			return this.invalidate();
		},

		// Rendering

		element_renderTo: Node.prototype.renderTo,

		renderTo: function renderTo(context, xx, yx, xy, yy, x, y) {
			var opacity = this._opacity;
			if (opacity == null || opacity >= 1) {
				return this.renderLayerTo(context, xx, yx, xy, yy, x, y);
			}
			if (this._fill && this._stroke) {
				return this.element_renderTo(context, xx, yx, xy, yy, x, y);
			}
			context.globalAlpha = opacity;
			var r = this.renderLayerTo(context, xx, yx, xy, yy, x, y);
			context.globalAlpha = 1;
			return r;
		},

		renderLayerTo: function renderLayerTo(context, xx, yx, xy, yy, x, y) {
			context.setTransform(xx, yx, xy, yy, x, y);
			this.renderShapeTo(context);
		}

	});

	Base._genericContext = genericContext;

	module.exports = Base;

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Class = __webpack_require__(45);
	var Container = __webpack_require__(47);
	var Node = __webpack_require__(64);

	module.exports = Class(Node, Container, {

		initialize: function initialize(width, height) {
			this.width = width;
			this.height = height;
		},

		localHitTest: function localHitTest(x, y) {
			var node = this.lastChild;
			while (node) {
				var hit = node.hitTest(x, y);
				if (hit) return hit;
				node = node.previousSibling;
			}
			return null;
		},

		renderLayerTo: function renderLayerTo(context, xx, yx, xy, yy, x, y) {
			context.setTransform(xx, yx, xy, yy, x, y);
			context.save();
			// Need beginPath to fix Firefox bug. See 3354054.
			context.beginPath();
			context.rect(this.x, this.y, this.width, this.height);
			context.clip();

			var node = this.firstChild;
			while (node) {
				node.renderTo(context, xx, yx, xy, yy, x, y);
				node = node.nextSibling;
			}
			context.restore();
		}
	});

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Class = __webpack_require__(45);
	var Base = __webpack_require__(68);

	var fontAnchors = { middle: 'center' };

	module.exports = Class(Base, {

		base_initialize: Base.prototype.initialize,

		initialize: function initialize(text, font, alignment, path) {
			this.base_initialize();
			this.draw.apply(this, arguments);
		},

		draw: function draw(text, font, alignment, path) {
			var em;
			if (typeof font == 'string') {
				em = Number(/(\d+)/.exec(font)[0]);
			} else if (font) {
				em = parseFloat(font.fontSize || font['font-size'] || '12');
				font = (font.fontStyle || font['font-style'] || '') + ' ' + (font.fontVariant || font['font-variant'] || '') + ' ' + (font.fontWeight || font['font-weight'] || '') + ' ' + em + 'px ' + (font.fontFamily || font['font-family'] || 'Arial');
			} else {
				font = this._font;
			}

			var lines = text && text.split(/\r?\n/);
			this._font = font;
			this._fontSize = em;
			this._text = lines;
			this._alignment = fontAnchors[alignment] || alignment || 'left';

			var context = Base._genericContext;

			context.font = this._font;
			context.textAlign = this._alignment;
			context.textBaseline = 'middle';

			lines = this._text;
			var l = lines.length,
			    width = 0;
			for (var i = 0; i < l; i++) {
				var w = context.measureText(lines[i]).width;
				if (w > width) width = w;
			}
			this.width = width;
			this.height = l ? l * 1.1 * em : 0;
			return this.invalidate();
		},

		// Interaction

		localHitTest: function localHitTest(x, y) {
			if (!this._fill) return null;
			if (x > 0 && y > 0 && x < this.width && y < this.height) {
				return this;
			}
			return null;
		},

		// Rendering

		renderShapeTo: function renderShapeTo(context) {
			if (this._invisible || !this._text || !this._fill && !this._stroke) {
				return null;
			}
			context.transform(this.xx, this.yx, this.xy, this.yy, this.x, this.y);
			var fill = this._fill,
			    stroke = this._stroke,
			    text = this._text,
			    dash = this._strokeDash;

			context.font = this._font;
			context.textAlign = this._alignment;
			context.textBaseline = 'middle';

			var em = this._fontSize,
			    y = em / 2,
			    lineHeight = 1.1 * em,
			    lines = text,
			    l = lines.length;

			if (fill) {
				context.fillStyle = fill;
				for (var i = 0; i < l; i++) context.fillText(lines[i], 0, y + i * lineHeight);
			}
			if (stroke) {
				if (dash) {
					if (context.setLineDash) {
						context.setLineDash(dash);
					} else {
						// TODO: Remove when FF supports setLineDash.
						context.mozDash = dash;
					}
					// TODO: Create fallback to other browsers.
				} else {
					if (context.setLineDash) {
						context.setLineDash([]);
					} else {
						context.mozDash = null;
					}
				}

				context.strokeStyle = stroke;
				context.lineWidth = this._strokeWidth;
				context.lineCap = this._strokeCap;
				context.lineJoin = this._strokeJoin;
				for (i = 0; i < l; i++) context.strokeText(lines[i], 0, y + i * lineHeight);
			}
		}

	});

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var TemplateUtil = __webpack_require__(72);
	var MapTheTiles = __webpack_require__(2);
	var gmu = __webpack_require__(73);

	var TileUtil = {
	    getSubdmain: function getSubdmain(tilePoint, subdomains) {
	        var index = Math.abs(tilePoint.x + tilePoint.y) % subdomains.length;
	        return subdomains[index];
	    },
	    getTileUrl: function getTileUrl(str, coords, subdomains) {

	        return TemplateUtil.template(str, {
	            s: this.getSubdmain(coords, subdomains),
	            x: coords.x,
	            y: coords.y,
	            z: coords.z
	        });
	    },
	    degrees2meters: function degrees2meters(lon, lat) {
	        var x = lon * 20037508.34 / 180;
	        var y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
	        y = y * 20037508.34 / 180;
	        return [x, y];
	    },
	    meters2degress: function meters2degress(x, y) {
	        var lon = x * 180 / 20037508.34;
	        var lat = Number(180 / Math.PI * (2 * Math.atan(Math.exp(y * Math.PI / 180)) - Math.PI / 2));
	        return [lon, lat];
	    },
	    getTileLayout: function getTileLayout(options) {
	        var layout = [];
	        var bounds = gmu.calcBounds(options.center[1], options.center[0], options.zoom, options.width, options.height);

	        var topLeftMeters = TileUtil.degrees2meters(bounds.left, bounds.top),
	            bottomRightMeters = TileUtil.degrees2meters(bounds.right, bounds.bottom);

	        var tiler = new MapTheTiles(null, options.tileWidth);

	        var layoutForBounds = {
	            top: topLeftMeters[1],
	            left: topLeftMeters[0],
	            right: bottomRightMeters[0],
	            bottom: bottomRightMeters[1]
	        };

	        var tiles = tiler.getTiles(layoutForBounds, options.zoom);

	        tiles.forEach(function (tile) {
	            var coordPoint = {
	                x: tile.X,
	                y: tile.Y,
	                z: tile.Z
	            },
	                coord = {
	                x: tile.left,
	                y: tile.top,
	                img: TileUtil.getTileUrl(options.tileSource, coordPoint, options.subdomains)
	            };

	            layout.push(coord);
	        }, this);

	        return layout;
	    }
	};

	module.exports = TileUtil;

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var templateRe = /\{ *([\w_]+) *\}/g;

	var TemplateUtil = {
	    template: function template(str, data) {
	        return str.replace(templateRe, function (str, key) {
	            var value = data[key];

	            if (value === undefined) {
	                throw new Error('No value provided for variable ' + str);
	            } else if (typeof value === 'function') {
	                value = value(data);
	            }
	            return value;
	        });
	    }
	};

	module.exports = TemplateUtil;

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var merc = __webpack_require__(74);

	exports.calcBounds = calcBounds;
	exports.calcZoomForBounds = calcZoomForBounds;

	// return the viewport bounds for a given lonlat, zoom and map/image width & height
	function calcBounds(latitude, longitude, zoom, width, height) {
		var scale = Math.pow(2, zoom);
		var centerPx = merc.fromLatLngToPoint({ lng: longitude, lat: latitude });

		var SWPoint = { x: centerPx.x - width / 2 / scale, y: centerPx.y + height / 2 / scale };
		var SWLatLon = merc.fromPointToLatLng(SWPoint);

		var NEPoint = { x: centerPx.x + width / 2 / scale, y: centerPx.y - height / 2 / scale };
		var NELatLon = merc.fromPointToLatLng(NEPoint);

		return {
			bounds: [SWLatLon.lng, SWLatLon.lat, NELatLon.lng, NELatLon.lat] // [w, s, e, n]
			, bbox: SWLatLon.lng + ',' + SWLatLon.lat + ',' + NELatLon.lng + ',' + NELatLon.lat,
			top: NELatLon.lat,
			right: NELatLon.lng,
			bottom: SWLatLon.lat,
			left: SWLatLon.lng
		};
	};

	// return the zoom for a given bounds and map/image width height
	function calcZoomForBounds(bounds, width, height) {
		var WORLD_DIM = { width: 256, height: 256 };
		var ZOOM_MAX = 21;

		var ne = { lon: bounds[2], lat: bounds[3] };
		var sw = { lon: bounds[0], lat: bounds[1] };

		var latFraction = (_latRad(ne.lat) - _latRad(sw.lat)) / Math.PI;
		var lonDiff = ne.lon - sw.lon;
		var lonFraction = (lonDiff < 0 ? lonDiff + 360 : lonDiff) / 360;

		var latZoom = _zoom(height, WORLD_DIM.height, latFraction);
		var lonZoom = _zoom(width, WORLD_DIM.width, lonFraction);

		return Math.min(latZoom, lonZoom, ZOOM_MAX);
	};

	// private helpers
	function _latRad(lat) {
		var sin = Math.sin(lat * Math.PI / 180);
		var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
		return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
	}

	function _zoom(mapPx, worldPx, fraction) {
		return Math.round(Math.log(mapPx / worldPx / fraction) / Math.LN2);
	}

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.fromLatLngToPoint = fromLatLngToPoint;
	exports.fromPointToLatLng = fromPointToLatLng;

	var TILE_SIZE = 256;
	var pixelOrigin_ = { x: TILE_SIZE / 2, y: TILE_SIZE / 2 };
	var pixelsPerLonDegree_ = TILE_SIZE / 360;
	var pixelsPerLonRadian_ = TILE_SIZE / (2 * Math.PI);

	function _bound(value, opt_min, opt_max) {
		if (opt_min != null) value = Math.max(value, opt_min);
		if (opt_max != null) value = Math.min(value, opt_max);
		return value;
	}

	function _degreesToRadians(deg) {
		return deg * (Math.PI / 180);
	}

	function _radiansToDegrees(rad) {
		return rad / (Math.PI / 180);
	}

	function fromLatLngToPoint(latLng, opt_point) {
		var point = { x: null, y: null };
		var origin = pixelOrigin_;

		point.x = origin.x + latLng.lng * pixelsPerLonDegree_;

		// Truncating to 0.9999 effectively limits latitude to 89.189. This is
		// about a third of a tile past the edge of the world tile.
		var siny = _bound(Math.sin(_degreesToRadians(latLng.lat)), -0.9999, 0.9999);
		point.y = origin.y + 0.5 * Math.log((1 + siny) / (1 - siny)) * -pixelsPerLonRadian_;

		return point;
	};

	function fromPointToLatLng(point) {
		var origin = pixelOrigin_;
		var lng = (point.x - origin.x) / pixelsPerLonDegree_;
		var latRadians = (point.y - origin.y) / -pixelsPerLonRadian_;
		var lat = _radiansToDegrees(2 * Math.atan(Math.exp(latRadians)) - Math.PI / 2);

		return { lat: lat, lng: lng };
	};

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by uRequire v0.7.0-beta.15 target: 'dist' template: 'nodejs'
	'use strict';

	(function () {

	  var __isAMD = !!("function" === 'function' && __webpack_require__(76)),
	      __isNode = typeof exports === 'object',
	      __isWeb = !__isNode;

	  var Polygon = __webpack_require__(77);

	  module.exports = (function () {
	    return function (arg) {
	      var bottom, left, right, top;
	      left = arg.left, right = arg.right, top = arg.top, bottom = arg.bottom;
	      return Polygon({
	        points: [[right, top], [right, bottom], [left, bottom], [left, top]],
	        closed: true
	      });
	    };
	  }).call(this);
	}).call(undefined);

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;

	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by uRequire v0.7.0-beta.15 target: 'dist' template: 'nodejs'
	'use strict';

	(function () {

	  var __isAMD = !!("function" === 'function' && __webpack_require__(76)),
	      __isNode = typeof exports === 'object',
	      __isWeb = !__isNode;

	  var Path = __webpack_require__(78),
	      O = __webpack_require__(79);

	  module.exports = (function () {
	    return function (arg) {
	      var closed, head, l, path, points, ref, tail;
	      points = arg.points, closed = arg.closed;
	      l = points.length;
	      head = points[0];
	      tail = points.slice(1, +l + 1 || 9000000000);
	      path = tail.reduce(function (pt, p) {
	        return pt.lineto.apply(pt, p);
	      }, (ref = Path()).moveto.apply(ref, head));
	      return {
	        path: closed ? path.closepath() : path,
	        centroid: O.average(points)
	      };
	    };
	  }).call(this);
	}).call(undefined);

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by uRequire v0.7.0-beta.15 target: 'dist' template: 'nodejs'
	'use strict';

	(function () {

	  var __isAMD = !!("function" === 'function' && __webpack_require__(76)),
	      __isNode = typeof exports === 'object',
	      __isWeb = !__isNode;

	  module.exports = (function () {
	    var Path;
	    Path = function (init) {
	      var areEqualPoints, _instructions, plus, point, printInstrunction, push, round, trimZeros, verbosify;
	      _instructions = init || [];
	      push = function (arr, el) {
	        var copy;
	        copy = arr.slice(0, arr.length);
	        copy.push(el);
	        return copy;
	      };
	      areEqualPoints = function (p1, p2) {
	        return p1[0] === p2[0] && p1[1] === p2[1];
	      };
	      trimZeros = function (string, char) {
	        var l;
	        l = string.length;
	        while (string.charAt(l - 1) === '0') {
	          l -= 1;
	        }
	        if (string.charAt(l - 1) === '.') {
	          l -= 1;
	        }
	        return string.substr(0, l);
	      };
	      round = function (number, digits) {
	        var str;
	        str = number.toFixed(digits);
	        return trimZeros(str);
	      };
	      printInstrunction = function (arg) {
	        var command, numbers, param, params;
	        command = arg.command, params = arg.params;
	        numbers = (function () {
	          var i, len, results;
	          results = [];
	          for (i = 0, len = params.length; i < len; i++) {
	            param = params[i];
	            results.push(round(param, 6));
	          }
	          return results;
	        })();
	        return command + ' ' + numbers.join(' ');
	      };
	      point = function (arg, arg1) {
	        var command, params, prev_x, prev_y;
	        command = arg.command, params = arg.params;
	        prev_x = arg1[0], prev_y = arg1[1];
	        switch (command) {
	          case 'M':
	            return [params[0], params[1]];
	          case 'L':
	            return [params[0], params[1]];
	          case 'H':
	            return [params[0], prev_y];
	          case 'V':
	            return [prev_x, params[0]];
	          case 'Z':
	            return null;
	          case 'C':
	            return [params[4], params[5]];
	          case 'S':
	            return [params[2], params[3]];
	          case 'Q':
	            return [params[2], params[3]];
	          case 'T':
	            return [params[0], params[1]];
	          case 'A':
	            return [params[5], params[6]];
	        }
	      };
	      verbosify = function (keys, f) {
	        return function (a) {
	          var args;
	          args = typeof a === 'object' ? keys.map(function (k) {
	            return a[k];
	          }) : arguments;
	          return f.apply(null, args);
	        };
	      };
	      plus = function (instruction) {
	        return Path(push(_instructions, instruction));
	      };
	      return {
	        moveto: verbosify(['x', 'y'], function (x, y) {
	          return plus({
	            command: 'M',
	            params: [x, y]
	          });
	        }),
	        lineto: verbosify(['x', 'y'], function (x, y) {
	          return plus({
	            command: 'L',
	            params: [x, y]
	          });
	        }),
	        hlineto: verbosify(['x'], function (x) {
	          return plus({
	            command: 'H',
	            params: [x]
	          });
	        }),
	        vlineto: verbosify(['y'], function (y) {
	          return plus({
	            command: 'V',
	            params: [y]
	          });
	        }),
	        closepath: function closepath() {
	          return plus({
	            command: 'Z',
	            params: []
	          });
	        },
	        curveto: verbosify(['x1', 'y1', 'x2', 'y2', 'x', 'y'], function (x1, y1, x2, y2, x, y) {
	          return plus({
	            command: 'C',
	            params: [x1, y1, x2, y2, x, y]
	          });
	        }),
	        smoothcurveto: verbosify(['x2', 'y2', 'x', 'y'], function (x2, y2, x, y) {
	          return plus({
	            command: 'S',
	            params: [x2, y2, x, y]
	          });
	        }),
	        qcurveto: verbosify(['x1', 'y1', 'x', 'y'], function (x1, y1, x, y) {
	          return plus({
	            command: 'Q',
	            params: [x1, y1, x, y]
	          });
	        }),
	        smoothqcurveto: verbosify(['x', 'y'], function (x, y) {
	          return plus({
	            command: 'T',
	            params: [x, y]
	          });
	        }),
	        arc: verbosify(['rx', 'ry', 'xrot', 'large_arc_flag', 'sweep_flag', 'x', 'y'], function (rx, ry, xrot, large_arc_flag, sweep_flag, x, y) {
	          return plus({
	            command: 'A',
	            params: [rx, ry, xrot, large_arc_flag, sweep_flag, x, y]
	          });
	        }),
	        print: function print() {
	          return _instructions.map(printInstrunction).join(' ');
	        },
	        points: function points() {
	          var fn, i, instruction, len, prev, ps;
	          ps = [];
	          prev = [0, 0];
	          fn = function () {
	            var p;
	            p = point(instruction, prev);
	            prev = p;
	            if (p) {
	              return ps.push(p);
	            }
	          };
	          for (i = 0, len = _instructions.length; i < len; i++) {
	            instruction = _instructions[i];
	            fn();
	          }
	          return ps;
	        },
	        instructions: function instructions() {
	          return _instructions.slice(0, _instructions.length);
	        },
	        connect: function connect(path) {
	          var first, last, newInstructions;
	          last = this.points().slice(-1)[0];
	          first = path.points()[0];
	          newInstructions = path.instructions().slice(1);
	          if (!areEqualPoints(last, first)) {
	            newInstructions.unshift({
	              command: 'L',
	              params: first
	            });
	          }
	          return Path(this.instructions().concat(newInstructions));
	        }
	      };
	    };
	    return function () {
	      return Path();
	    };
	  }).call(this);
	}).call(undefined);

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by uRequire v0.7.0-beta.15 target: 'dist' template: 'nodejs'
	'use strict';

	(function () {

	  var __isAMD = !!("function" === 'function' && __webpack_require__(76)),
	      __isNode = typeof exports === 'object',
	      __isWeb = !__isNode;

	  module.exports = (function () {
	    var average, enhance, length, max, min, minus, on_circle, plus, sum, sum_vectors, times;
	    sum = function (xs) {
	      return xs.reduce(function (a, b) {
	        return a + b;
	      }, 0);
	    };
	    min = function (xs) {
	      return xs.reduce(function (a, b) {
	        return Math.min(a, b);
	      });
	    };
	    max = function (xs) {
	      return xs.reduce(function (a, b) {
	        return Math.max(a, b);
	      });
	    };
	    plus = function (arg, arg1) {
	      var a, b, c, d;
	      a = arg[0], b = arg[1];
	      c = arg1[0], d = arg1[1];
	      return [a + c, b + d];
	    };
	    minus = function (arg, arg1) {
	      var a, b, c, d;
	      a = arg[0], b = arg[1];
	      c = arg1[0], d = arg1[1];
	      return [a - c, b - d];
	    };
	    times = function (k, arg) {
	      var a, b;
	      a = arg[0], b = arg[1];
	      return [k * a, k * b];
	    };
	    length = function (arg) {
	      var a, b;
	      a = arg[0], b = arg[1];
	      return Math.sqrt(a * a + b * b);
	    };
	    sum_vectors = function (xs) {
	      return xs.reduce(function (v, w) {
	        return plus(v, w);
	      }, [0, 0]);
	    };
	    average = function (points) {
	      return times(1 / points.length, points.reduce(plus));
	    };
	    on_circle = function (r, angle) {
	      return times(r, [Math.sin(angle), -Math.cos(angle)]);
	    };
	    enhance = function (compute, curve) {
	      var key, method, ref;
	      ref = compute || {};
	      for (key in ref) {
	        method = ref[key];
	        curve[key] = method(curve.index, curve.item, curve.group);
	      }
	      return curve;
	    };
	    return {
	      sum: sum,
	      min: min,
	      max: max,
	      plus: plus,
	      minus: minus,
	      times: times,
	      length: length,
	      sum_vectors: sum_vectors,
	      average: average,
	      on_circle: on_circle,
	      enhance: enhance
	    };
	  }).call(this);
	}).call(undefined);

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(3);

	var ZoomControl = React.createClass({
	    displayName: 'ZoomControl',

	    render: function render() {
	        return React.createElement('div', null);
	    }

	});

	module.exports = ZoomControl;

/***/ }
/******/ ])
});
;