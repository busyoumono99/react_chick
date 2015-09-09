var React = require('react');
var Name = require('./name.jsx');
var PropTypes = React.PropTypes;

var App = React.createClass({

  render: function() {
    return (
      <div>
        <h1>React App!!!</h1>
        <Name name="busyomono99" />
      </div>
    );
  }

});

module.exports = App;
