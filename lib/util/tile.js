'use strict';

var TemplateUtil = require('./template');
var MapTheTiles = require('map-the-tiles');
var gmu = require('googlemaps-utils');

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