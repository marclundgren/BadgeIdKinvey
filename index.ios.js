/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  View,
} = React;

var BadgeIdKinvey = React.createClass({
  login: function() {
    // let credentials = {this.refs.username, this.refs.password};


  },
  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome Badge ID Kinvey!
        </Text>
        <Text style={styles.instructions}>
          Log in
        </Text>
        <TextInput ref="username" />
        <TextInput ref="password" />
        <TouchableNativeFeedback onPress="login">
          <View>
            Log in
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('BadgeIdKinvey', () => BadgeIdKinvey);
