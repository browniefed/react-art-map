var TemplateUtil = require('./template');
var TileUtil = {
    getSubdmain: function(tilePoint, subdomains) {
        var index = Math.abs(tilePoint.x + tilePoint.y) % subdomains.length;
        return subdomains[index];
    },
    getTileUrl: function(str, coords, subdomains) {

        return TemplateUtil.template(str, {
            s: this.getSubdmain(coords, subdomains),
            x: coords.x,
            y: coords.y,
            z: coords.z
        });
    },
};

module.exports = TileUtil;