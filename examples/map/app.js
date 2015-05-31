var React = require('react');
var ReactMap = require('react-map');

var {
    Map
} = ReactMap;

var viewportWidth = function() {
    return  window.innerWidth - 100;
}
var viewportHeight = function() {
    return window.innerHeight - 100;
}

var center = [
    -122.668197,45.525292
]

var degrees2meters = function(lon,lat) {
        var x = lon * 20037508.34 / 180;
        var y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
        y = y * 20037508.34 / 180;
        return [x, y]
}

var meters2degress = function(x,y) {
        var lon = x *  180 / 20037508.34 ;
        var lat =Number(180 / Math.PI * (2 * Math.atan(Math.exp(y * Math.PI / 180)) - Math.PI / 2));
 
        return [lon, lat]
}
 

var App = React.createClass({
  getInitialState: function() {
    return {
      center: center,
      zoom: 15
    }
  },

  handleDrag: function(newCenter) {
    this.setState({
      center: newCenter
    })
  }, 
  render: function () {
    return (
      <div>
        <Map
            width={viewportWidth()}
            height={viewportHeight()}
            center={this.state.center}
            zoom={this.state.zoom}
            tileSource="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
            onDrag={this.handleDrag}
        />
      </div>
    );
  }
});

React.render(<App/>, document.getElementById('example'));
