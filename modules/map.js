var React = require('react');
var ReactArt = require('react-art');
var TemplateUtil = require('./util/template');
var TileBelt = require('tilebelt');
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


var Map = React.createClass({
    propTypes: {
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        zoom: React.PropTypes.number,
        center: React.PropTypes.array,
        tileSource: React.PropTypes.string,
        subdomains: React.PropTypes.string
    },
    getDefaultProps: function() {
        return {
            subdomains: 'abc'
        }
    },
    getTileLayout: function(tileSource, center, zoom, {width,height}) {
        var centerCoords = this.pointsToCoords(TileBelt.pointToTile(center[0], center[1], zoom));
        var centerTileImg = this.getTileUrl(tileSource, centerCoords);

        var layout = [
            {
                img: centerTileImg,
                x: (width/2) - 128,
                y: (height/2) - 128
            }
        ];

        return layout;
    },
    getTiles: function() {
        var layout = this.getTileLayout(this.props.tileSource, this.props.center, this.props.zoom, {width: this.props.width, height: this.props.height});

        return layout.map(function(tile) {
            return (
                <Shape
                    d={rectanglePath}
                    x={tile.x}
                    y={tile.y}
                    fill={new Pattern(tile.img, 256, 256, 0, 0)}
                />
            )
        });

    },
    pointsToCoords: function(points) {
        return {
            z: points[2],
            x: points[0],
            y: points[1]
        };
    },
    getSubdmain: function(tilePoint) {
        var index = Math.abs(tilePoint.x + tilePoint.y) % this.props.subdomains.length;
        return this.props.subdomains[index];
    },
    getTileUrl: function(str, coords) {

        return TemplateUtil.template(str, {
            s: this.getSubdmain(coords),
            x: coords.x,
            y: coords.y,
            z: coords.z
        });
    },
    render() {
        return (
            <Surface
                width={this.props.width}
                height={this.props.height}
            >
                {this.getTiles()}
                {this.props.children}
            </Surface>
        );
    }

});

module.exports = Map;