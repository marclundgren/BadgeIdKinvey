'use strict';

var React = require('react-native');

var {
  Text,
  View
} = React;

// var styles = require('./style');
var LoginView = require('../Login');

var Root = React.createClass({
  getInitialState: function() {
    return {};
  },

  componentDidMount: function () {
    // transition to login

    this.props.navigator.push({
      title: 'Login',
      component: LoginView,
      passProps: {}
    });

    // TODO: store authentication session and attempt to retrieve it here
  },

  render: function() {

    return (
      <View>
        <Text>Loading ...</Text>
      </View>
    );
  }
});
module.exports = Root;
