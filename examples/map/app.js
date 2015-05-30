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

var App = React.createClass({
  render: function () {
    return (
      <div>
        <Map
            width={viewportWidth()}
            height={viewportHeight()}
            center={center}
            zoom={15}
            tileSource="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
      </div>
    );
  }
});

React.render(<App/>, document.getElementById('example'));
