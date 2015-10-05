'use strict';

var React = require('react-native');

var {
  AppRegistry,
  StyleSheet,
  NavigatorIOS,
  View,
  Text,
  TextInput,
  TouchableHighlight,
  Image,
} = React;

// var LoginView = require('./App/Views/Login');

var BadgeIdKinvey = React.createClass({
  getInitialState: function() {
    return {
      authenticated: false,
      name: '',
      email: '',
      photo: null,
      authenticatedAsAdmin: false
    };
  },

  logIn: function() {
    this.setState({
      authenticated: true
    });
  },

  logOut: function() {
    this.setState({
      authenticated: false
    });
  },

  renderLogout: function() {
    return (
      <TouchableHighlight onPress={() => this.logOut()}>
        <Text>
          Log out
        </Text>
      </TouchableHighlight>
    );
  },

  renderBadge: function() {
    return (
      <View style={styles.container}>

        <View>
          <Text>
            Placeholder: {this.state.username}.fullName
          </Text>
        </View>

        <View>
          <Text>
            Placeholder: {this.state.username}.photo
          </Text>
        </View>

        <View>
          <Text>
            Placeholder: {this.state.username}.QR Code
          </Text>
        </View>

        {this.renderLogout()}


      </View>
    );
  },

  renderLogin: function() {
    return (
      <View>
        <View style={styles.toolbar}>
            <Text style={styles.toolbarButton}>Add</Text>
            <Text style={styles.toolbarTitle}>This is the title</Text>
            <Text style={styles.toolbarButton}>Like</Text>
        </View>

        <View style={styles.container}>
          <View style={styles.form}>

            <TextInput
              autofocus="true"
              placeholder="Username"
              style={{width:140, height: 40, borderColor: 'gray', borderWidth: 1}}
              onChangeText={(text) => this.setState({username: text})}
              value={this.state.text}
            />

            <TextInput
              placeholder="Password"
              style={{width:140, height: 40, borderColor: 'gray', borderWidth: 1}}
              onChangeText={(text) => this.setState({password: text})}
              value={this.state.text}
            />

            <TouchableHighlight onPress={() => this.logIn()}>
              <Text>Log in</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  },

  render: function() {

    if (this.state.authenticated) {
      if (this.state.authenticatedAsAdmin) {
        return this.renderScanner();
      }

      return this.renderBadge();
    }

    return this.renderLogin();
  }
});

var styles = StyleSheet.create({
  form: {
    flexDirection: 'column',
    alignItems: 'center'
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: 'white',
    marginBottom: 5,
  },

  toolbar:{
        backgroundColor:'#81c04d',
        paddingTop:30,
        paddingBottom:10,
        flexDirection:'row'
    },
    toolbarButton:{
        width: 50,
        color:'#fff',
        textAlign:'center'
    },
    toolbarTitle:{
        color:'#fff',
        textAlign:'center',
        fontWeight:'bold',
        flex:1
    },

    content:{
        backgroundColor:'#ebeef0',
        flex:1
    }
});

AppRegistry.registerComponent('BadgeIdKinvey', () => BadgeIdKinvey);

module.exports = BadgeIdKinvey;
