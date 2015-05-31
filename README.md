#ReactMap

```
npm install react-art-map
```

```js
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
    -122.668197,45.525292 //Portland
];

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
```