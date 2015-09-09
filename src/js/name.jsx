var React = require('react');

var Name = React.createClass({
  getName : function(){
    var name = this.props.name;
    var result = 'Name is : ' + name;
    return result;
  },
  render: function() {
    return (
      <span>{this.getName()}</span>
    );
  }

});

module.exports = Name;
