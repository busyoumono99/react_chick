import React from 'react';

export default class Name extends React.Component{
  getName(){
    var name = this.props.name;
    var result = `Name is : ${name}`;
    return result;
  }
  render() {
    return (
      <span>{this.getName()}</span>
    );
  }

};
