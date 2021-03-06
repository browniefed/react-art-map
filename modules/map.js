var React = require('react');
var ReactArt = require('react-art');
var TileUtil = require('./util/tile');
var MapTheTiles = require('map-the-tiles');
var Rectangle = require('paths-js/rectangle');

var {
    Surface,
    Shape,
    Group,
    Pattern
} = ReactArt;

var rectanglePath = Rectangle({
  top: 0,
  left: 0,
  right: 256,
  bottom: 256
}).path.print();

var gmu = require('googlemaps-utils');

var Map = React.createClass({
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
    getDefaultProps() {
        return {
            subdomains: 'abc',
            tileWidth: 256,
            zoom: 15,
            onMouseDown: function() {},
            onMouseMove: function() {},
            onMouseUp: function() {},
            onDrag: function() {}
        }
    },
    componentDidMount() {
      document.addEventListener('mousemove', this.handleMouseMove , false);
      document.addEventListener('mouseup', this.handleMouseUp , false);
    },
    componentWillUnmount() {
      document.removeEventListener('mousemove', this.handleMouseMove, false);
      document.removeEventListener('mouseup', this.handleMouseUp, false);
    },
    handleMouseDown(e) {
      this.dragging = true;
      this.coords = {
        x: e.x,
        y: e.y
      };
      this.dragCenter = this.props.center.slice(0);
      
      this.props.onMouseDown(e);
    },
    handleMouseUp(e) {
      this.dragging = false;
      this.coords = {};
      this.dragCenter = [];
      this.props.onMouseUp(e);
    },
    handleMouseMove(e) {
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
           var dLat = de/R || 0;
           var dLon = dn/R || 0;

           //OffsetPosition, decimal degrees
           var latO = lat - dLat * 180/Math.PI;
           var lonO = lon + dLon * 180/Math.PI;

           var newPos = [
            lonO,
            latO
           ];

           this.dragCenter = newPos;
           this.props.onDrag(newPos, e);
      }
    },
    getTiles() {

        var layout = TileUtil.getTileLayout({
            center: this.props.center,
            zoom: this.props.zoom,
            tileWidth: this.props.tileWidth,
            
            tileSource: this.props.tileSource,
            subdomains: this.props.subdomains,

            width: this.props.width,
            height: this.props.height
        })

        return layout.map(function(tile) {
            return (
                <Shape
                    d={rectanglePath}
                    x={tile.x}
                    y={tile.y}
                    fill={new Pattern(tile.img, this.props.tileWidth , this.props.tileWidth, 0, 0)}
                />
            )
        }, this);

    },
    render() {
        return (
            <Surface
                width={this.props.width}
                height={this.props.height}
            >
                <Group
                    onMouseDown={this.handleMouseDown}
                >
                    {this.getTiles()}
                    {this.props.children}
                </Group>
            </Surface>
        );
    }

});

module.exports = Map;