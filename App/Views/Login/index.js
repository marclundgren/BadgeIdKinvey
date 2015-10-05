'use strict';

var React = require('react-native');

var {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableNativeFeedback,
} = React;

// var styles = require('./style');

var LoginView = React.createClass({
  getDefaultProps: function() {
    return {};
  },

  getInitialState: function() {
    return {
      log: ''
    };
  },

  login: function() {
    var {username, password} = this.refs;

    console.log('username!');

    this.setState({
      log: 'login pressed!'
    });
  },

  render: function() {
    console.log('login render...');
    var sanityCheck = true;

    if (sanityCheck) {
      console.log('display login sanity check', styles);
      var container = {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
      };
      var welcome = {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        color: 'white',
      };

      return (
        <View style={container}>
          <Text style={styles.welcome}>
            Log in View
          </Text>
          <Text style={styles.welcome}>
            Log in View
          </Text>
          <Text style={styles.welcome}>
            Log in View
          </Text>
          <Text style={styles.welcome}>
            Log in View
          </Text>
          <Text style={styles.welcome}>
            Log in View
          </Text>
          <Text style={styles.instructions}>
            Let's create a form here.
          </Text>
        </View>
      );
    }

    return (
      <View>

        <TextInput
          placeholder="Username"
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(text) => this.setState({username: text})}
          value={this.state.text}
        />

        <TextInput
          placeholder="Password"
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(text) => this.setState({password: text})}
          value={this.state.text}
        />

        <TouchableNativeFeedback onPress={() => this.logIn()}>
          Log in
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
    backgroundColor: 'red',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: 'white',
  },
  instructions: {
    textAlign: 'center',
    color: 'white',
    marginBottom: 5,
  },
});

module.exports = LoginView;
